import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, from as observableFrom, Observable, of as observableOf, Subscription } from 'rxjs';
import { concatMap, scan, take } from 'rxjs/operators';
import { NgbActiveModal, NgbDropdownConfig, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { findIndex } from 'lodash';

import { ImpactPathwayStep } from '../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { PaginatedList } from '../../core/data/paginated-list';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { SearchTaskService } from './search-task.service';
import { SearchFilterConfig } from '../../shared/search/search-filter-config.model';
import { FilterBox, FilterBoxEntry, FilterBoxType } from './search-header/filter-box/filter-box.component';
import { FacetValue } from '../../shared/search/facet-value.model';
import { SearchFilter } from '../../shared/search/search-filter.model';
import { FilterType } from '../../shared/search/filter-type.model';

@Component({
  selector: 'ipw-search-task',
  styleUrls: ['./search-task.component.scss'],
  templateUrl: './search-task.component.html'
})
export class SearchTaskComponent implements OnInit, OnDestroy {

  @Input() step: ImpactPathwayStep;
  @Input() parentTask: ImpactPathwayTask;
  @Input() isObjectivePage: boolean;

  public filterBoxList$: BehaviorSubject<FilterBox[]> = new BehaviorSubject<FilterBox[]>([]);
  public availableTaskList$: BehaviorSubject<ImpactPathwayTask[]> = new BehaviorSubject<ImpactPathwayTask[]>([]);
  public filterBoxEntries$: BehaviorSubject<FacetValue[]> = new BehaviorSubject<FacetValue[]>([]);
  public page = 1;
  public pageSize = 8;
  public sortDirection = SortDirection.ASC;
  public pageInfoState: PageInfo = new PageInfo();
  public paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();
  public selectable = true;
  public selectedTasks: ImpactPathwayTask[] = [];
  public sortOptions: SortOptions;

  private entityTypeFilterBox: FilterBox;
  private titleFilterBox: FilterBox;
  private defaultSearchFilters: SearchFilter[];
  private defaultSearchQuery = '';
  private entityTypeSearchFilter: SearchFilterConfig;
  private titleSearchFilter: SearchFilterConfig;
  private processing$: Observable<boolean> = observableOf(false);

  private searching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private subs: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private service: ImpactPathwayService,
    private typeaheadConfig: NgbTypeaheadConfig,
    private dropdownConfig: NgbDropdownConfig,
    private searchTaskService: SearchTaskService
  ) {

    // customize default values of typeaheads used by this component tree
    typeaheadConfig.showHint = true;
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  ngOnInit(): void {
    const parentId = (this.isObjectivePage) ? this.parentTask.id : this.step.id;
    this.defaultSearchFilters = [new SearchFilter('f.parentStepId', [parentId], 'not')];
    this.entityTypeSearchFilter = Object.assign(new SearchFilterConfig(), {
      name: 'entityTaskType',
      type: 'authority',
      pageSize: 20,
    });

    this.entityTypeFilterBox = {
      filterName: 'type',
      filterType: FilterBoxType.filter,
      filterConfig: this.entityTypeSearchFilter,
      filterFacetValues: [],
      appliedFilterBoxEntries: []
    };

    this.titleSearchFilter = Object.assign(new SearchFilterConfig(), {
      name: 'title',
      type: 'text'
    });

    this.titleFilterBox = {
      filterName: 'title',
      filterType: FilterBoxType.search,
      filterConfig: this.titleSearchFilter,
      filterFacetValues: [],
      appliedFilterBoxEntries: []
    };
    this.filterBoxList$.next([this.entityTypeFilterBox, this.titleFilterBox]);

    this.paginationOptions.id = 'search-task';
    this.paginationOptions.pageSizeOptions = [4, 8, 12, 16, 20];
    this.paginationOptions.pageSize = this.pageSize;
    this.sortOptions = new SortOptions('dc.title', this.sortDirection);

    this.processing$ = this.service.isProcessing();

    this.search(this.paginationOptions, this.sortOptions);

  }

  isProcessing(): Observable<boolean> {
    return this.processing$;
  }

  isSearching(): Observable<boolean> {
    return this.searching$.asObservable();
  }

  onFilterChange(filterBox: FilterBox) {
    this.updateFilterList(filterBox);
    this.search(this.paginationOptions, this.sortOptions);
  }

  onPaginationChange(event) {
    this.paginationOptions = Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      currentPage: event.pagination.currentPage,
      pageSize: event.pagination.pageSize,
    });

    this.sortOptions = new SortOptions(event.sort.field, event.sort.direction);

    this.search(this.paginationOptions, this.sortOptions);
  }

  onPageChange(page) {
    this.search(Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      currentPage: page
    }), this.sortOptions);
  }

  onPageSizeChange(pageSize) {
    this.search(Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      pageSize: pageSize
    }), this.sortOptions);
  }

  onRemoveFilter(removedFilter: FilterBox) {
    this.updateFilterList(removedFilter);
    this.search(this.paginationOptions, this.sortOptions);
  }

  onSearchChange(searchbox: FilterBox) {
    this.updateFilterList(searchbox);
    this.search(this.paginationOptions, this.sortOptions);
  }

  onSubmit() {
    this.selectedTasks.forEach((task) => {
      this.addTask(task);
    });
  }

  onTaskDeselected(task: ImpactPathwayTask) {
    const index: number = this.selectedTasks.indexOf(task);
    if (index !== -1) {
      this.selectedTasks.splice(index, 1);
    }
  }

  onTaskSelected(task: ImpactPathwayTask) {
    this.selectedTasks.push(task)
  }

  private addTask(task: ImpactPathwayTask) {
    if (this.isObjectivePage) {
      this.service.dispatchAddImpactPathwaySubTaskAction(
        this.step.parentId,
        this.step.id,
        this.parentTask.id,
        task.id,
        this.activeModal);
    } else {
      this.service.dispatchAddImpactPathwayTaskAction(
        this.step.parentId,
        this.step.id,
        task.id,
        this.activeModal);
    }
  }

  private buildSearchQuery(filters: SearchFilter[]) {
    const queries = [];
    filters.forEach((filter) => {
      if (isNotEmpty(filter) && isNotEmpty(filter.values)) {
        queries.push(filter.key + ':(' + filter.values.join(' OR ') + ')');
      }
    });

    this.defaultSearchQuery = encodeURIComponent(queries.join(' AND '));
  }

  private getFilterEntries(page: number) {
    this.searchTaskService.getAvailableFilterEntriesByStepType(
      this.step.type,
      (this.isObjectivePage) ? this.parentTask.id : this.step.id,
      this.isObjectivePage,
      this.defaultSearchQuery,
      this.defaultSearchFilters,
      page,
      this.entityTypeSearchFilter)
      .subscribe((resultPaginatedList: PaginatedList<FacetValue>) => {
        this.filterBoxEntries$.next(resultPaginatedList.page);

        const appliedFilterBoxEntries = [...this.entityTypeFilterBox.appliedFilterBoxEntries]
          .filter((entry: FilterBoxEntry) => {
            return findIndex(resultPaginatedList.page, { label: entry.label }) !== -1
          });

        this.entityTypeFilterBox = Object.assign(this.entityTypeFilterBox, {
          filterFacetValues: resultPaginatedList.page,
          appliedFilterBoxEntries: appliedFilterBoxEntries
        });
        this.filterBoxList$.next([this.entityTypeFilterBox, this.titleFilterBox]);
      })
  }

  private getSearchFiltersFromFilterBoxes(filterBoxes: FilterBox[]) {
    const searchFilters = [];
    filterBoxes.forEach((filterBox: FilterBox) => {
      if (isNotEmpty(filterBox.appliedFilterBoxEntries)) {
        searchFilters.push(new SearchFilter(
          filterBox.filterConfig.name,
          filterBox.appliedFilterBoxEntries.map((entry: FilterBoxEntry) => entry.value),
          filterBox.filterConfig.type === FilterType.authority ? 'authority' : ''
        ));
      }
    });

    return searchFilters;
  }

  private search(paginationOptions: PaginationComponentOptions, sortOptions: SortOptions) {
    this.getFilterEntries(1);

    this.searching$.next(true);
    this.availableTaskList$.next([]);
    this.availableTaskList$.next([]);

    this.searchTaskService.searchAvailableImpactPathwayTasksByStepType(
      this.step.type,
      (this.isObjectivePage) ? this.parentTask.id : this.step.id,
      this.isObjectivePage,
      this.defaultSearchQuery,
      this.defaultSearchFilters,
      paginationOptions,
      sortOptions).pipe(
      take(1)
    ).subscribe((resultPaginatedList: PaginatedList<Observable<ImpactPathwayTask>>) => {
      this.pageInfoState = resultPaginatedList.pageInfo;
      this.updateResultList(resultPaginatedList.page);
      this.searching$.next(false);
    });

  }

  private updateFilterList(filterUpdate: FilterBox) {
    const filterIndex = findIndex(this.filterBoxList$.value, (filter) => {
      return filter.filterConfig.name === filterUpdate.filterConfig.name
    });

    const newFilterList = [...this.filterBoxList$.value];
    newFilterList[filterIndex] = filterUpdate;

    this.filterBoxList$.next(newFilterList);
    this.buildSearchQuery([...this.getSearchFiltersFromFilterBoxes(this.filterBoxList$.value)]);
  }

  private updateResultList(resultList: Array<Observable<ImpactPathwayTask>>) {
    this.subs.push(observableFrom(resultList).pipe(
      concatMap((list: Observable<ImpactPathwayTask>) => list),
      scan((acc: any, value: any) => [...acc, ...value], [])
    ).subscribe((taskList: ImpactPathwayTask[]) => {
      if (taskList.length === resultList.length) {
        this.availableTaskList$.next(taskList);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
