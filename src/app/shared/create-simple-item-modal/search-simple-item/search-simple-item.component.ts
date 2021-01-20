import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, from as observableFrom, Observable, Subscription } from 'rxjs';
import { concatMap, scan, take } from 'rxjs/operators';
import { NgbActiveModal, NgbDropdownConfig, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { findIndex } from 'lodash';
import { hasValue, isEmpty, isNotEmpty } from '../../empty.util';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { SearchSimpleItemService } from './search-simple-item.service';
import { SearchFilterConfig } from '../../search/search-filter-config.model';
import {
  FilterBox,
  FilterBoxEntry,
  FilterBoxType
} from './search-header/filter-box/search-simple-item-filter-box.component';
import { FacetValue } from '../../search/facet-value.model';
import { SearchFilter } from '../../search/search-filter.model';
import { FilterType } from '../../search/filter-type.model';
import { SimpleItem } from '../models/simple-item.model';

@Component({
  selector: 'ds-search-simple-item',
  styleUrls: ['./search-simple-item.component.scss'],
  templateUrl: './search-simple-item.component.html'
})
export class SearchSimpleItemComponent implements OnInit, OnDestroy {

  /**
   * The vocabulary name to use retrieve search filter labels
   * @type {string}
   */
  @Input() vocabularyName: string;

  /**
   * The list of id to exclude from search results
   * @type {string[]}
   */
  @Input() excludeListId: string[] = [];

  /**
   * The name of the filter used to exclude results from a search
   * @type {string[]}
   */
  @Input() excludeFilterName: string;

  /**
   * A boolean representing if an operation is processing
   * @type {Observable<boolean>}
   */
  @Input() processing: Observable<boolean>;

  /**
   * The search config name
   * @type {string}
   */
  @Input() searchConfiguration: string;

  /**
   * The search scope
   * @type {string}
   */
  @Input() scope = '';

  /**
   * EventEmitter that will emit an array of SimpleItem object to add
   */
  @Output() addItems: EventEmitter<SimpleItem[]> = new EventEmitter<SimpleItem[]>();

  public filterBoxList$: BehaviorSubject<FilterBox[]> = new BehaviorSubject<FilterBox[]>([]);
  public availableTaskList$: BehaviorSubject<SimpleItem[]> = new BehaviorSubject<SimpleItem[]>([]);
  public filterBoxEntries$: BehaviorSubject<FacetValue[]> = new BehaviorSubject<FacetValue[]>([]);
  public page = 1;
  public pageSize = 8;
  public sortDirection = SortDirection.ASC;
  public pageInfoState: PageInfo = new PageInfo();
  public paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();
  public selectable = true;
  public selectedTasks: SimpleItem[] = [];
  public sortOptions: SortOptions;

  private entityTypeFilterBox: FilterBox;
  private titleFilterBox: FilterBox;
  private defaultSearchFilters: SearchFilter[];
  private defaultSearchQuery = '';
  private entityTypeSearchFilter: SearchFilterConfig;
  private titleSearchFilter: SearchFilterConfig;

  private searching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private subs: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private typeaheadConfig: NgbTypeaheadConfig,
    private dropdownConfig: NgbDropdownConfig,
    private searchTaskService: SearchSimpleItemService
  ) {
    // customize default values of typeaheads used by this component tree
    typeaheadConfig.showHint = true;
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit(): void {
    this.defaultSearchFilters = this.excludeListId.map((excludeId) => {
      return new SearchFilter(`f.${this.excludeFilterName}`, [excludeId], 'not');
    });
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

    this.paginationOptions.id = 'search-simple-item';
    this.paginationOptions.pageSizeOptions = [4, 8, 12, 16, 20];
    this.paginationOptions.pageSize = this.pageSize;
    this.sortOptions = new SortOptions('dc.title', this.sortDirection);

    this.search(this.paginationOptions, this.sortOptions);

  }

  /**
   * Return boolean representing if an operation is processing
   *
   * @return {Observable<boolean>}
   */
  isProcessing(): Observable<boolean> {
    return this.processing;
  }

  /**
   * Return boolean representing if an searching is processing
   *
   * @return {Observable<boolean>}
   */
  isSearching(): Observable<boolean> {
    return this.searching$.asObservable();
  }

  /**
   * Update the filter list on change and dispatch a new search
   * @param filterBox
   */
  onFilterChange(filterBox: FilterBox): void {
    this.updateFilterList(filterBox);
    this.paginationOptions = Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      currentPage: 0
    });
    this.search(this.paginationOptions, this.sortOptions);
  }

  /**
   * Update the pagination object and dispatch a new search
   * @param event
   */
  onPaginationChange(event): void {
    this.paginationOptions = Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      currentPage: event.pagination.currentPage,
      pageSize: event.pagination.pageSize,
    });

    this.sortOptions = new SortOptions(event.sort.field, event.sort.direction);

    this.search(this.paginationOptions, this.sortOptions);
  }

  /**
   * Update the current page and dispatch a new search
   * @param page
   */
  onPageChange(page) {
    this.search(Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      currentPage: page
    }), this.sortOptions);
  }

  /**
   * Update the current page size and dispatch a new search
   * @param pageSize
   */
  onPageSizeChange(pageSize) {
    this.search(Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      pageSize: pageSize
    }), this.sortOptions);
  }

  /**
   * Update the filter list on remove and dispatch a new search
   * @param removedFilter
   */
  onRemoveFilter(removedFilter: FilterBox) {
    this.updateFilterList(removedFilter);
    this.search(this.paginationOptions, this.sortOptions);
  }

  /**
   * Update the filter list on search and dispatch a new search
   * @param searchbox
   */
  onSearchChange(searchbox: FilterBox) {
    this.updateFilterList(searchbox);
    this.paginationOptions = Object.assign(new PaginationComponentOptions(), this.paginationOptions, {
      currentPage: 0
    });
    this.search(this.paginationOptions, this.sortOptions);
  }

  /**
   * Emit list of selected item
   */
  onSubmit() {
    this.addItems.emit(this.selectedTasks);
  }

  /**
   * Remove element from the selected item list
   * @param item
   */
  onTaskDeselected(item: SimpleItem) {
    const index: number = this.selectedTasks.indexOf(item);
    if (index !== -1) {
      this.selectedTasks.splice(index, 1);
    }
  }

  /**
   * Add element from the selected item list
   * @param item
   */
  onTaskSelected(item: SimpleItem) {
    this.selectedTasks.push(item)
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
      this.searchConfiguration,
      this.vocabularyName,
      this.defaultSearchQuery,
      this.defaultSearchFilters,
      page,
      this.entityTypeSearchFilter,
      this.scope)
      .subscribe((resultPaginatedList: FacetValue[]) => {
        this.filterBoxEntries$.next(resultPaginatedList);

        const appliedFilterBoxEntries = [...this.entityTypeFilterBox.appliedFilterBoxEntries]
          .filter((entry: FilterBoxEntry) => {
            return findIndex(resultPaginatedList, { label: entry.label }) !== -1
          });

        this.entityTypeFilterBox = Object.assign(this.entityTypeFilterBox, {
          filterFacetValues: resultPaginatedList,
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
          filterBox.filterConfig.filterType === FilterType.authority ? 'authority' : ''
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
      this.searchConfiguration,
      this.defaultSearchQuery,
      this.defaultSearchFilters,
      paginationOptions,
      sortOptions,
      this.scope).pipe(
      take(1)
    ).subscribe((resultPaginatedList: PaginatedList<Observable<SimpleItem>>) => {
      this.pageInfoState = resultPaginatedList.pageInfo;
      this.updateResultList(resultPaginatedList.page);
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

  private updateResultList(resultList: Array<Observable<SimpleItem>>) {
    if (isEmpty(resultList)) {
      this.availableTaskList$.next([]);
      this.searching$.next(false);
    } else {
      this.subs.push(observableFrom(resultList).pipe(
        concatMap((list: Observable<SimpleItem>) => list),
        scan((acc: any, value: any) => [...acc, ...value], [])
      ).subscribe((itemList: SimpleItem[]) => {
        if (itemList.length === resultList.length) {
          this.availableTaskList$.next(itemList);
          this.searching$.next(false);
        }
      }));
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
