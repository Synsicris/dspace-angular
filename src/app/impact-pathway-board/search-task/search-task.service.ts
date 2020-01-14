import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImpactPathWayTask } from '../../core/impact-pathway/models/impact-path-way-task.model';
import { isEmpty } from '../../shared/empty.util';

@Injectable()
export class SearchTaskService {

  private _appliedFilters: BehaviorSubject<Map<string, any[]>> = new BehaviorSubject<Map<string, any[]>>(new Map());

  filterByTaskTitle(availableTaskList: Observable<ImpactPathWayTask[]>, title: string) {
    return availableTaskList.pipe(
      map((taskList: ImpactPathWayTask[]) => {
        return taskList.filter(
          (task: ImpactPathWayTask) => isEmpty(title) || task.item.title === title
        )
      })
    )
  }

  filterByTaskType(appliedFilters: BehaviorSubject<Map<string, any[]>>, availableTaskList: Observable<ImpactPathWayTask[]>, filterType: string) {
    const typeList = appliedFilters.value.get(filterType);
    return availableTaskList.pipe(
      map((taskList: ImpactPathWayTask[]) => {
        return taskList.filter(
          (task: ImpactPathWayTask) => isEmpty(typeList) || typeList.includes(task.type)
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
}
