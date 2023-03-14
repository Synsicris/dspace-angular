import { Injectable } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf, of } from 'rxjs';
import { concatMap, filter, first, map, mergeMap, scan, switchMap, take } from 'rxjs/operators';

import { hasValue, isNotEmpty, isNotUndefined } from '../../empty.util';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { PaginatedSearchOptions } from '../../search/models/paginated-search-options.model';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchFilter } from '../../search/models/search-filter.model';
import { MyDSpaceResponseParsingService } from '../../../core/data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../../../core/data/request.models';
import { SearchResult } from '../../search/models/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { SearchFilterConfig } from '../../search/models/search-filter-config.model';
import { SearchOptions } from '../../search/models/search-options.model';
import { FacetValue } from '../../search/models/facet-value.model';
import { SimpleItem } from '../models/simple-item.model';
import { LinkService } from '../../../core/cache/builders/link.service';
import { followLink } from '../../utils/follow-link-config.model';
import { VocabularyService } from '../../../core/submission/vocabularies/vocabulary.service';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';

@Injectable()
export class SearchSimpleItemService {

  constructor(
    private linkService: LinkService,
    private searchConfigService: SearchConfigurationService,
    private searchService: SearchService,
    private vocabularyService: VocabularyService) {
    this.searchService.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
  }

  getAvailableFilterEntriesByStepType(
    searchConfiguration: string,
    query: string = '',
    filters: SearchFilter[] = [],
    page: number,
    filterConfig: SearchFilterConfig,
    scope: string = ''): Observable<FacetValue[]> {

    const searchOptions = new SearchOptions({
      configuration: searchConfiguration,
      filters: filters,
      query: query,
      scope: scope
    });

    return this.searchConfigService.getConfig(scope, searchConfiguration).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((configFilters: SearchFilterConfig[]) => {
        let filterFound: SearchFilterConfig;
        configFilters.forEach((filterEntry: SearchFilterConfig) => {
          if (filterEntry.name === filterConfig.name) {
            filterFound = Object.assign(new SearchFilterConfig(), filterConfig, {
              _links: filterEntry._links
            });
          }
        });

        return filterFound;
      }),
      switchMap((searchFilterConfig: SearchFilterConfig ) => {
        return this.searchService.getFacetValuesFor(searchFilterConfig, page, searchOptions).pipe(
          filter((rd: RemoteData<PaginatedList<FacetValue>>) => rd.hasSucceeded),
          map((rd: RemoteData<PaginatedList<FacetValue>>) => {
            const dsoPage: any[] = rd.payload.page
              .filter((result) => hasValue(result))
              .map((searchResult: FacetValue) => {
                return of(searchResult);
              });
            const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
            return Object.assign(rd, { payload: payload });
          }),
          mergeMap((rd: RemoteData<PaginatedList<Observable<FacetValue>>>) => {
            if (rd.payload.page.length === 0) {
              return observableOf([]);
            } else {
              return observableFrom(rd.payload.page).pipe(
                concatMap((list: Observable<FacetValue>) => list),
                scan((acc: any, value: any) => [...acc, value], []),
                filter((list: FacetValue[]) => list.length === rd.payload.page.length),
              );
            }
          }),
          first((result: FacetValue[]) => isNotUndefined(result))
        );

      })
    );

  }

  searchAvailableImpactPathwayTasksByStepType(
    searchConfiguration: string,
    query: string = '',
    filters: SearchFilter[] = [],
    pagination?: PaginationComponentOptions,
    sort?: SortOptions,
    scope: string = ''): Observable<PaginatedList<Observable<SimpleItem>>> {

    const searchOptions = new PaginatedSearchOptions({
      configuration: searchConfiguration,
      query: query,
      filters: filters,
      pagination: pagination,
      sort: sort,
      scope: scope
    });

    return this.searchService.search(searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => {
            if (searchResult.indexableObject.type === 'item') {
              return observableOf(this.initSimpleItem(searchResult.indexableObject));
            } else {
              this.linkService.resolveLink(searchResult.indexableObject, followLink('item'));
              return searchResult.indexableObject.item.pipe(
                filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
                take(1),
                map((itemRD: RemoteData<Item>) => this.initSimpleItem(itemRD.payload, searchResult.indexableObject.id))
              );
            }
          });
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<Observable<SimpleItem>>>) => rd.payload)
    );
  }

  private initSimpleItem(searchItem: Item, searchworkspaceItemId: string = null): SimpleItem {
    const type: any = searchItem.firstMetadata('dspace.entity.type');
    return {
      id: searchItem.id,
      workspaceItemId: searchworkspaceItemId,
      type: type,
      metadata: searchItem.metadata
    };
  }
}
