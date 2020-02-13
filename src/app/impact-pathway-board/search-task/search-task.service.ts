import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { SearchService } from '../../core/shared/search/search.service';
import { SearchFilter } from '../../shared/search/search-filter.model';
import { MyDSpaceResponseParsingService } from '../../core/data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../../core/data/request.models';
import { SearchResult } from '../../shared/search/search-result.model';
import { Item } from '../../core/shared/item.model';
import { SearchFilterConfig } from '../../shared/search/search-filter-config.model';
import { SearchOptions } from '../../shared/search/search-options.model';
import { FacetValue } from '../../shared/search/facet-value.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';

@Injectable()
export class SearchTaskService {

  constructor(private impactPathwayService: ImpactPathwayService, private searchService: SearchService) {
    this.searchService.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
  }

  getAvailableFilterEntriesByStepType(
    stepType: string,
    parentId: string,
    isObjectivePage: boolean,
    query: string = '',
    filters: SearchFilter[] = [],
    page: number,
    filterConfig: SearchFilterConfig): Observable<PaginatedList<FacetValue>> {

    const confName = isObjectivePage ? `impactpathway_${stepType}_objective_task_type` : `impactpathway_${stepType}_task_type`;
    const searchOptions = new SearchOptions({
      configuration: confName,
      filters: filters,
      query: query,
    });

    return this.searchService.getFacetValuesFor(filterConfig, page, searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<FacetValue>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<FacetValue>>) => rd.payload)
    )

  }

  searchAvailableImpactPathwayTasksByStepType(
    stepType: string,
    parentId: string,
    isObjectivePage: boolean,
    query: string = '',
    filters: SearchFilter[] = [],
    pagination?: PaginationComponentOptions,
    sort?: SortOptions): Observable<PaginatedList<Observable<ImpactPathwayTask>>> {

    const confName = isObjectivePage ? `impactpathway_${stepType}_objective_task_type` : `impactpathway_${stepType}_task_type`;
    const searchOptions = new PaginatedSearchOptions({
      configuration: confName,
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
              return observableOf(this.impactPathwayService.initImpactPathwayTask(searchResult.indexableObject));
            } else {
              return searchResult.indexableObject.item.pipe(
                filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
                take(1),
                map((itemRD: RemoteData<Item>) => this.impactPathwayService.initImpactPathwayTask(itemRD.payload))
              )
            }
          });
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<Observable<ImpactPathwayTask>>>) => rd.payload)
    );
  }
}
