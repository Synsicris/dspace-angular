import { Injectable } from '@angular/core';

import { combineLatest, from, Observable, of } from 'rxjs';
import { concatMap, map, mergeMap, reduce, switchMap } from 'rxjs/operators';
import { differenceWith, findIndex, unionWith } from 'lodash';

import { RelationshipDataService } from '../data/relationship-data.service';
import { ItemDataService } from '../data/item-data.service';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { RemoteData } from '../data/remote-data';
import { Item } from '../shared/item.model';
import { PaginatedList } from '../data/paginated-list.model';
import { FindListOptions } from '../data/find-list-options.model';
import { MetadataValue } from '../shared/metadata.models';
import { _hasVersionComparator, _isVersionOfComparator, _unionComparator, hasVersion } from './project-version.util';
import { VersionDataService } from '../data/version-data.service';
import { Version } from '../shared/version.model';
import { VersionHistoryDataService } from '../data/version-history-data.service';
import { isEmpty, isNotEmpty, isNull, isUndefined } from '../../shared/empty.util';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { Metadata } from '../shared/metadata.utils';
import { VERSION_UNIQUE_ID } from './project-data.service';
import { SearchService } from '../shared/search/search.service';
import { environment } from '../../../environments/environment';
import { SearchResult } from '../../shared/search/models/search-result.model';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';

export enum ComparedVersionItemStatus {
  Changed = 'changed',
  New = 'new',
  Removed = 'removed',
  Equal = 'equal',
  Canceled = 'canceled',
  Done = 'done',
  Archieved = 'archieved',
  PartlyArchieved = 'partly_archieved',
}

export interface ComparedVersionItem {
  item: Item;
  versionItem?: Item;
  status: ComparedVersionItemStatus;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectVersionService {

  /**
   * Discovery configuration for searching the last visible version of an entity
   * @protected
   */
  protected lastVersionDiscoveryConfig = environment.projects.lastVersionDiscoveryConfig;

  constructor(protected itemService: ItemDataService,
    protected relationshipService: RelationshipDataService,
    protected searchService: SearchService,
    protected versionService: VersionDataService,
    protected versionHistoryService: VersionHistoryDataService,
  ) { }

  public findLastVisibleItemVersionByItemID(itemId: string): Observable<RemoteData<Item>> {
    const searchOptions = new PaginatedSearchOptions({
      configuration: this.lastVersionDiscoveryConfig,
      forcedEmbeddedKeys: ['version'],
      scope: itemId
    });

    return this.searchService.search(searchOptions).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        if (rd.hasFailed || rd.payload.totalElements === 0) {
          return null;
        } else {
          return createSuccessfulRemoteDataObject<Item>(rd.payload.page[0].indexableObject);
        }
      })
    );
  }


  public findLastVisibleVersionByItemID(itemId: string): Observable<RemoteData<Version>> {
    const searchOptions = new PaginatedSearchOptions({
      configuration: this.lastVersionDiscoveryConfig,
      forcedEmbeddedKeys: ['version'],
      scope: itemId
    });

    return this.searchService.search(searchOptions).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {

        if (rd.hasFailed || rd.payload.totalElements === 0) {
          return createSuccessfulRemoteDataObject<Version>(null);
        } else {
          return createSuccessfulRemoteDataObject<Version>(rd.payload.page[0]._embedded.indexableObject._embedded.version);
        }
      })
    );
  }

  public getVersionByItemId(itemId: string, useCachedVersionIfAvailable = true, reRequestOnStale = true): Observable<RemoteData<Version>> {
    return this.itemService.findById(itemId, useCachedVersionIfAvailable, reRequestOnStale, followLink('version')).pipe(
      getFirstCompletedRemoteData(),
      switchMap((itemRD) => {
        if (itemRD.hasSucceeded) {
          return itemRD.payload.version;
        } else {
          return createFailedRemoteDataObject$<Version>(null);
        }
      })
    );
  }

  /**
   * Retrieve all item version for the given item
   *
   * @param itemId  The item for which to search the versions available
   * @param options the FindListOptions
   */
  public getVersionsByItemId(itemId: string, options?: PaginatedSearchOptions): Observable<Version[]> {
    return this.itemService.findById(itemId, true, true, followLink('version')).pipe(
      getFirstCompletedRemoteData(),
      switchMap((itemRD: RemoteData<Item>) => {
        if (itemRD.hasSucceeded) {
          return itemRD.payload.version.pipe(
            getFirstCompletedRemoteData(),
            switchMap((versionRD: RemoteData<Version>) => {
              if (versionRD.hasSucceeded && versionRD.statusCode === 200) {
                return this.versionService.getHistoryIdFromVersion(versionRD.payload).pipe(
                  switchMap((versionHistoryId: string) => {
                    if (isNotEmpty(versionHistoryId)) {
                      return this.versionHistoryService.getVersions(versionHistoryId, options, true, true, followLink('item')).pipe(
                        getFirstCompletedRemoteData(),
                        map((listRD: RemoteData<PaginatedList<Version>>) => {
                          return listRD.hasSucceeded ? listRD.payload.page : [];
                        }),
                        map((list: Version[]) => {
                          // exclude from the returned list the version regarding the target item itself
                          return list.filter((entry: Version) => entry.id !== versionRD.payload.id);
                        })
                      );
                    } else {
                      return of([]);
                    }
                  })
                );
              } else {
                return of([]);
              }
            })
          );
        } else {
          return of([]);
        }
      })
    );

  }

  /**
   * Retrieve all item version for the given item by means the `hasVersion` relationship
   *
   * @param itemId  The item for which to search the versions available
   * @param options the FindListOptions
   */
  public getRelationVersionsByItemId(itemId: string, options?: FindListOptions): Observable<Item[]> {
    return this.itemService.findById(itemId, true, true, followLink('relationships')).pipe(
      getFirstCompletedRemoteData(),
      switchMap((itemRD: RemoteData<Item>) => {
        if (itemRD.hasSucceeded) {
          return this.relationshipService.getRelatedItemsByLabel(itemRD.payload, 'hasVersion', options).pipe(
            getFirstCompletedRemoteData(),
            map((listRD: RemoteData<PaginatedList<Item>>) => {
              return listRD.hasSucceeded && listRD.statusCode === 200 ? listRD.payload.page : [];
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }

  /**
   * Check if the version Item is relative to the active working instance of the project
   * @param versionItem the version item which metadata belongs to
   */
  isActiveWorkingInstance(versionItem: Item): boolean {
    return isEmpty(versionItem?.firstMetadataValue('synsicris.uniqueid'));
  }

  /**
   * Check if the version Item is visible
   * @param versionItem the version item which metadata belongs to
   */
  isVersionVisible(versionItem: Item): boolean {
    return versionItem?.firstMetadataValue('synsicris.version.visible') === 'true';
  }

  /**
   * Check if the version Item is not visible
   * @param versionItem the version item which metadata belongs to
   */
  isVersionNotVisible(versionItem: Item): boolean {
    return isEmpty(versionItem?.firstMetadataValue('synsicris.version.visible')) || versionItem?.firstMetadataValue('synsicris.version.visible') === 'false';
  }

  /**
   * Check if the version Item is official
   * @param versionItem the version item which metadata belongs to
   */
  isVersionOfficial(versionItem: Item): boolean {
    return versionItem?.firstMetadataValue('synsicris.version.official') === 'true';
  }

  /**
   * Check if the version Item is the last official one
   * @param versionItem the version item which metadata belongs to
   */
  isLastVersionVisible(versionItem: Item): boolean {
    return versionItem?.firstMetadataValue('synsicris.isLastVersion.visible') === 'true';
  }

  /**
   * Check if the official metadata is not already set
   * @param versionItem the version item which metadata belongs to
   */
  hasNoOfficialMetadata(versionItem: Item): boolean {
    return isUndefined(versionItem?.firstMetadataValue('synsicris.version.official'))
      || isNull(versionItem?.firstMetadataValue('synsicris.version.official'));
  }

  /**
   * Take two items and compare the items belonging to a given metadata
   *
   * @param targetItemId
   * @param versionedItemId
   * @param metadataName
   */
  public compareItemChildrenByMetadata(targetItemId: string, versionedItemId: string, metadataName: string): Observable<ComparedVersionItem[]> {
    const targetChildrenItems$: Observable<Item[]> = this.itemService.findById(targetItemId).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      mergeMap((targetItem: Item) => {
        const targetChildrenMetadata: MetadataValue[] = targetItem.findMetadataSortedByPlace(metadataName);
        if (targetChildrenMetadata.length > 0) {
          return from(targetChildrenMetadata).pipe(
            concatMap((metadata: MetadataValue) => this.itemService.findById(metadata?.authority).pipe(
              getFirstCompletedRemoteData(),
              getRemoteDataPayload()
            )),
            reduce((acc: any, value: any) => [...acc, value], []),
          );
        } else {
          return of([]);
        }
      })
    );

    let versionedChildrenItems$: Observable<Item[]> = of([]);
    if (isNotEmpty(versionedItemId)) {
      versionedChildrenItems$ = this.itemService.findById(versionedItemId).pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        mergeMap((versionedItem: Item) => {
          const versionedChildrenMetadata: MetadataValue[] = versionedItem.findMetadataSortedByPlace(metadataName);
          if (versionedChildrenMetadata.length > 0) {
            return from(versionedChildrenMetadata).pipe(
              concatMap((metadata: MetadataValue) => this.itemService.findById(metadata?.authority).pipe(
                getFirstCompletedRemoteData(),
                getRemoteDataPayload()
              )),
              reduce((acc: any, value: any) => [...acc, value], []),
            );
          } else {
            return of([]);
          }
        })
      );
    }

    return combineLatest([targetChildrenItems$, versionedChildrenItems$]).pipe(
      map(([targetChildrenItems, versionedChildrenItems]) => {
        return this.compareItemsArrays(targetChildrenItems, versionedChildrenItems);
      })
    );
  }

  private compareItemsArrays(targetItemList: Item[], versionedItemList: Item[]): ComparedVersionItem[] {
    const itemAddedList = differenceWith(targetItemList, versionedItemList, _hasVersionComparator);
    const itemRemovedList = differenceWith(versionedItemList, targetItemList, _isVersionOfComparator);
    const unionList = unionWith(targetItemList, versionedItemList, _unionComparator);
    return unionList.map((targetItem) => {
      let versionedItem: Item = null;
      const versionedItemIndex = findIndex(versionedItemList, (entry) => {
        return hasVersion(targetItem, entry);
      });
      let status = ComparedVersionItemStatus.Equal;
      if (versionedItemIndex === -1) {
        // item has not a versioned one, so check if is new or old removed
        const newItemIndex = findIndex(itemAddedList, (entry) => {
          return targetItem.id === entry.id;
        });
        status = (newItemIndex === -1) ? ComparedVersionItemStatus.Removed : ComparedVersionItemStatus.New;
      } else {
        // version exists for this item, so check modified date
        versionedItem = versionedItemList[versionedItemIndex];
        if (versionedItem.lastModified !== targetItem.lastModified) {
          status = ComparedVersionItemStatus.Changed;
        }
      }

      return {
        item: targetItem,
        versionItem: versionedItem,
        status: status
      };
    });
  }

  /**
   * Check if the item is version of an item by looking for "synsicris.uniqueid" metadata
   *
   * @param item
   */
  public isVersionOfAnItem(item: Item): boolean {
    return isNotEmpty(Metadata.allValues(item.metadata, VERSION_UNIQUE_ID));
  }

  /**
   * Retrieve all item version for the given item by means the `hasVersion` relationship
   *
   * @param itemId  The item for which to search the versions available
   * @param options the FindListOptions
   */
  public getParentRelationVersionsByItemId(itemId: string, options?: FindListOptions): Observable<Item[]> {
    return this.itemService.findById(itemId, true, true, followLink('relationships')).pipe(
      getFirstCompletedRemoteData(),
      switchMap((itemRD: RemoteData<Item>) => {
        if (itemRD.hasSucceeded) {
          return this.relationshipService.getRelatedItemsByLabel(itemRD.payload, 'isVersionOf', options).pipe(
            getFirstCompletedRemoteData(),
            map((listRD: RemoteData<PaginatedList<Item>>) => {
              return listRD.hasSucceeded && listRD.statusCode === 200 ? listRD.payload.page : [];
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }

}


