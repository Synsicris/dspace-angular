import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { toDSpaceObjectListRD } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { SearchService } from '../../core/shared/search/search.service';

@Injectable()
export class SearchTaskService {

  private _appliedFilters: BehaviorSubject<Map<string, any[]>> = new BehaviorSubject<Map<string, any[]>>(new Map());

  constructor(private searchService: SearchService) {

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
    pagination?: PaginationComponentOptions,
    sort?: SortOptions): Observable<PaginatedList<any>> {

    const confName = `impactpathway_${stepType}_task_type`;

    return this.searchService.search(
      new PaginatedSearchOptions({
        configuration: confName,
        pagination: pagination,
        sort: sort
      })).pipe(
      toDSpaceObjectListRD(),
      tap((r) => console.log('getAvailableImpactPathwayTasksByStepType search', r)),
      filter((rd: RemoteData<PaginatedList<any>>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      take(1),
      tap((r) => console.log('getAvailableImpactPathwayTasksByStepType take', r)),
      map((rd: RemoteData<PaginatedList<any>>) => rd.payload));
  }
}
