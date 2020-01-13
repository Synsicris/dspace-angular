import { Component, Input, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  flatMap,
  merge,
  scan,
  startWith,
  switchMap,
  tap
} from 'rxjs/operators';
import { NgbDropdownConfig, NgbTypeaheadConfig, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathWayStep } from '../../models/impact-path-way-step.model';
import { DashboardService } from '../../dashboard.service';
import { ImpactPathWayTask } from '../../models/impact-path-way-task.model';
import { ImpactPathWayTaskType } from '../../models/impact-path-way-task-type';
import { FilterBoxEntry } from '../filter-box/filter-box.component';
import { hasValue, isEmpty, isUndefined } from '../../../shared/empty.util';
import { SearchTaskService } from '../search-task.service';

@Component({
  selector: 'ipw-search-box',
  styleUrls: ['./search-box.component.scss'],
  templateUrl: './search-box.component.html'
})
export class SearchBoxComponent implements OnDestroy {

  /**
   * Emits the currently active filters
   */
  @Input() availableTaskList: Observable<ImpactPathWayTask[]>;
  @Input() filteredTaskList: BehaviorSubject<ImpactPathWayTask[]> = new BehaviorSubject<ImpactPathWayTask[]>([]);
  @Input() step: ImpactPathWayStep;

  public appliedFilters: BehaviorSubject<Map<string, any[]>> = new BehaviorSubject<Map<string, any[]>>(new Map());
  public searchModel: string;
  public searching: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private hideSearchingWhenUnsubscribed$ = new Observable(() => () => this.searching.next(false));
  private subs: Subscription[] = [];

  constructor(
    private service: DashboardService,
    private typeaheadConfig: NgbTypeaheadConfig,
    private dropdownConfig: NgbDropdownConfig,
    private searchTaskService: SearchTaskService
  ) {

    // customize default values of typeaheads used by this component tree
    typeaheadConfig.showHint = true;
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  formatter = (x: ImpactPathWayTask) => {
    return (typeof x === 'object') ? x.item.title : x
  };

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length < 3) {
          if (isEmpty(this.searchModel)) {
            this.subs.push(this.searchTaskService.filterByTaskTitle(this.availableTaskList, '').pipe(first())
              .subscribe((updatedList: ImpactPathWayTask[]) => {
                this.filteredTaskList.next(updatedList);
              })
            );
          }
          return observableOf([])
        } else {
          this.searching.next(true);
          return this.filteredTaskList.pipe(
            flatMap((tasks: ImpactPathWayTask[]) => tasks),
            filter((task: ImpactPathWayTask) => task.item.title.toLowerCase().startsWith(term.toLocaleLowerCase())),
            scan((acc: any, value: any) => [...acc, ...value], []),
            startWith([])
          )
        }
      }),
      tap((tasks) => this.searching.next(false)),
      merge(this.hideSearchingWhenUnsubscribed$)
    );

  getAvailableEntriesByProperty(property?: string): FilterBoxEntry[] {
    const type = (isUndefined(this.step)) ? undefined : this.step.type;
    const entries: ImpactPathWayTaskType[] = this.service.getAvailableTaskTypeByStep(type);
    return entries.map((entry: ImpactPathWayTaskType) => (
      {
        value: entry,
        label: entry
      }
    ))
  }

  onFilterChange(filterType: string) {
    this.searchModel = '';
    this.subs.push(this.searchTaskService.filterByTaskType(this.appliedFilters, this.availableTaskList, filterType).pipe(first())
      .subscribe((updatedList: ImpactPathWayTask[]) => {
        this.filteredTaskList.next(updatedList);
      })
    );
  }

  onSelectItem(event: NgbTypeaheadSelectItemEvent) {
    this.subs.push(this.searchTaskService.filterByTaskTitle(this.availableTaskList, event.item.item.title).pipe(first())
      .subscribe((updatedList: ImpactPathWayTask[]) => {
        this.filteredTaskList.next(updatedList);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
