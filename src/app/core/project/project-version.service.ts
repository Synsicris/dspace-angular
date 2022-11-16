import { Injectable } from '@angular/core';

import { combineLatest, from, Observable, of } from 'rxjs';
import { concatMap, map, mergeMap, reduce, switchMap, tap } from 'rxjs/operators';
import { differenceWith, findIndex, unionWith } from 'lodash';

import { RelationshipService } from '../data/relationship.service';
import { ItemDataService } from '../data/item-data.service';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { RemoteData } from '../data/remote-data';
import { Item } from '../shared/item.model';
import { PaginatedList } from '../data/paginated-list.model';
import { FindListOptions } from '../data/request.models';
import { MetadataValue } from '../shared/metadata.models';
import { _hasVersionComparator, _isVersionOfComparator, _unionComparator, hasVersion } from './project-version.util';
import { VersionDataService } from '../data/version-data.service';
import { Version } from '../shared/version.model';
import { VersionHistoryDataService } from '../data/version-history-data.service';
import { isNotEmpty } from '../../shared/empty.util';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { Metadata } from '../shared/metadata.utils';
import { VERSION_UNIQUE_ID } from './project-data.service';

export enum ComparedVersionItemStatus {
  Changed = 'changed',
  New = 'new',
  Removed = 'removed',
  Equal = 'equal'
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

  constructor(protected itemService: ItemDataService,
    protected relationshipService: RelationshipService,
    protected versionService: VersionDataService,
    protected versionHistoryService: VersionHistoryDataService,
  ) { }

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
        return from(targetChildrenMetadata).pipe(
          concatMap((metadata: MetadataValue) => this.itemService.findById(metadata?.authority).pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload()
          )),
          reduce((acc: any, value: any) => [...acc, value], []),
        );
      })
    );

    const versionedChildrenItems$: Observable<Item[]> = this.itemService.findById(versionedItemId).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      mergeMap((versionedItem: Item) => {
        const versionedChildrenMetadata: MetadataValue[] = versionedItem.findMetadataSortedByPlace(metadataName);
        return from(versionedChildrenMetadata).pipe(
          concatMap((metadata: MetadataValue) => this.itemService.findById(metadata?.authority).pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload()
          )),
          reduce((acc: any, value: any) => [...acc, value], []),
        );
      })
    );

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
    const metadata = Metadata.allValues(item.metadata, VERSION_UNIQUE_ID);
    return isNotEmpty(metadata);
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


