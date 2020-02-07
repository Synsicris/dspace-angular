import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf  } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
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

@Injectable()
export class SearchTaskService {

  private _appliedFilters: BehaviorSubject<Map<string, any[]>> = new BehaviorSubject<Map<string, any[]>>(new Map());

  constructor(private searchService: SearchService) {
    this.searchService.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
  }

  filterByTaskTitle(availableTaskList: Observable<ImpactPathwayTask[]>, title: string) {
    return availableTaskList.pipe(
      map((taskList: ImpactPathwayTask[]) => {
        return taskList.filter(
          (task: ImpactPathwayTask) => isEmpty(title) || task.title === title
        )
      })
    )
  }

  filterByTaskType(appliedFilters: BehaviorSubject<Map<string, any[]>>, availableTaskList: Observable<ImpactPathwayTask[]>, filterType: string) {
    const typeList = appliedFilters.value.get(filterType);
    return availableTaskList.pipe(
      map((taskList: ImpactPathwayTask[]) => {
        return taskList.filter(
          (task: ImpactPathwayTask) => isEmpty(typeList) || typeList.includes(task.type)
        )
      })
    )
  }

  addFilterValue(appliedFilters: BehaviorSubject<Map<string, any[]>>, filterType: string, ...filterValue: any) {
    const appliedFiltersValue = appliedFilters.value;
    let filterValuesList = (appliedFiltersValue.get(filterType)) ? appliedFiltersValue.get(filterType) : [];

    filterValuesList = filterValuesList.concat(...filterValue);
    appliedFiltersValue.set(filterType, filterValuesList);

    appliedFilters.next(appliedFiltersValue);
  }

  removeFilterValue(appliedFilters: BehaviorSubject<Map<string, any[]>>, filterType: string, filterValue: any) {
    const appliedFiltersValue = appliedFilters.value;
    const filterValues = appliedFiltersValue.get(filterType);
    const index = filterValues.indexOf(filterValue);
    if (index !== -1) {
      filterValues.splice(index, 1);
    }
    appliedFiltersValue.set(filterType, filterValues);

    appliedFilters.next(appliedFiltersValue);
  }

  getAppliedFilters(): Observable<Map<string, any[]>> {
    return this._appliedFilters;
  }

  resetAppliedFilters(): void {
    this._appliedFilters.next(new Map());
  }

  searchAvailableImpactPathwayTasksByStepType(
    stepType: string,
    parentId: string,
    isObjectivePage: boolean,
    pagination?: PaginationComponentOptions,
    sort?: SortOptions): any {

    const confName = isObjectivePage ? `impactpathway_${stepType}_objective_task_type` : `impactpathway_${stepType}_task_type`;
    const filters: SearchFilter[] = [
      new SearchFilter('f.parentStepId', [parentId], 'not')
    ];

    return this.searchService.search(
      new PaginatedSearchOptions({
        configuration: confName,
        filters: filters,
        pagination: pagination,
        sort: sort
      })).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => {
            if (searchResult.indexableObject.type === 'item') {
              return observableOf(searchResult.indexableObject);
            } else {
              return searchResult.indexableObject.item.pipe(
                filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
                take(1),
                map((itemRD: RemoteData<Item>) => itemRD.payload)
              )
            }
          });
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<any>>) => rd.payload)
    );
  }
}
