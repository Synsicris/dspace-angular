import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { isEmpty } from '../../shared/empty.util';

@Injectable()
export class SearchTaskService {

  private _appliedFilters: BehaviorSubject<Map<string, any[]>> = new BehaviorSubject<Map<string, any[]>>(new Map());

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
}
