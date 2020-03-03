import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { hasValue, isNotEmpty } from '../../empty.util';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PaginatedSearchOptions } from '../../search/paginated-search-options.model';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchService } from '../../../core/shared/search/search.service';
import { SearchFilter } from '../../search/search-filter.model';
import { MyDSpaceResponseParsingService } from '../../../core/data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../../../core/data/request.models';
import { SearchResult } from '../../search/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { SearchFilterConfig } from '../../search/search-filter-config.model';
import { SearchOptions } from '../../search/search-options.model';
import { FacetValue } from '../../search/facet-value.model';
import { SimpleItem } from '../models/simple-item.model';
import { LinkService } from '../../../core/cache/builders/link.service';
import { followLink } from '../../utils/follow-link-config.model';

@Injectable()
export class SearchSimpleItemService {

  constructor(
    private linkService: LinkService,
    private searchService: SearchService) {
    this.searchService.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
  }

  getAvailableFilterEntriesByStepType(
    searchConfiguration: string,
    query: string = '',
    filters: SearchFilter[] = [],
    page: number,
    filterConfig: SearchFilterConfig): Observable<PaginatedList<FacetValue>> {

    const searchOptions = new SearchOptions({
      configuration: searchConfiguration,
      filters: filters,
      query: query,
    });

    return this.searchService.getFacetValuesFor(filterConfig, page, searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<FacetValue>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<FacetValue>>) => rd.payload)
    )

  }

  searchAvailableImpactPathwayTasksByStepType(
    searchConfiguration: string,
    query: string = '',
    filters: SearchFilter[] = [],
    pagination?: PaginationComponentOptions,
    sort?: SortOptions): Observable<PaginatedList<Observable<SimpleItem>>> {

    const searchOptions = new PaginatedSearchOptions({
      configuration: searchConfiguration,
      query: query,
      filters: filters,
      pagination: pagination,
      sort: sort
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
                map((itemRD: RemoteData<Item>) => this.initSimpleItem(itemRD.payload))
              )
            }
          });
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<Observable<SimpleItem>>>) => rd.payload)
    );
  }

  private initSimpleItem(searchItem: Item): SimpleItem {
    const type: any = searchItem.firstMetadata('relationship.type');
    return {
      id: searchItem.id,
      type: type,
      metadata: searchItem.metadata
    };
  }
}
