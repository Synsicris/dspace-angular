import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, combineLatest, from as observableFrom, Observable, Subscription } from 'rxjs';
import { concatMap, debounceTime, map, scan, switchMap, tap } from 'rxjs/operators';
import { NgbActiveModal, NgbDropdownConfig, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { findIndex } from 'lodash';
import { hasValue, isEmpty, isNotEmpty } from '../../empty.util';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { SearchSimpleItemService } from './search-simple-item.service';
import { SearchFilterConfig } from '../../search/models/search-filter-config.model';
import {
  FilterBox,
  FilterBoxEntry,
  FilterBoxType
} from './search-header/filter-box/search-simple-item-filter-box.component';
import { FacetValue } from '../../search/models/facet-value.model';
import { SearchFilter } from '../../search/models/search-filter.model';
import { FilterType } from '../../search/models/filter-type.model';
import { SimpleItem } from '../models/simple-item.model';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TranslateService } from '@ngx-translate/core';

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
   * Additional search query
   * @type {string}
   */
  @Input() query = '';

  /**
   * The search scope
   * @type {string}
   */
  @Input() scope = '';

  /**
   * The i18n key of the info message to display
   */
  @Input() searchMessageInfoKey;

  /**
   * EventEmitter that will emit an array of SimpleItem object to add
   */
  @Output() addItems: EventEmitter<SimpleItem[]> = new EventEmitter<SimpleItem[]>();

  /**
   * A boolean representing if there is an info message to display
   */
  public hasInfoMessage: Observable<boolean>;

  public filterBoxList$: BehaviorSubject<FilterBox[]> = new BehaviorSubject<FilterBox[]>([]);
  public availableTaskList$: BehaviorSubject<SimpleItem[]> = new BehaviorSubject<SimpleItem[]>([]);
  public filterBoxEntries$: BehaviorSubject<FacetValue[]> = new BehaviorSubject<FacetValue[]>([]);
  public pageInfoState: PageInfo = new PageInfo();

  public paginationOptions: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'ssi',
    currentPage: 1,
    pageSizeOptions: [3, 6, 12, 16, 20],
    pageSize: 6
  });
  public selectable = true;
  public selectedTasks: SimpleItem[] = [];
  public sortOptions: SortOptions = new SortOptions('dc.title', SortDirection.ASC);

  private entityTypeFilterBox: FilterBox;
  private titleFilterBox: FilterBox;
  private defaultSearchFilters: SearchFilter[];
  private defaultSearchQuery: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private entityTypeSearchFilter: SearchFilterConfig;
  private titleSearchFilter: SearchFilterConfig;

  private searching$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private subs: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private dropdownConfig: NgbDropdownConfig,
    private paginationService: PaginationService,
    private searchTaskService: SearchSimpleItemService,
    private typeaheadConfig: NgbTypeaheadConfig,
    private translate: TranslateService
  ) {
    // customize default values of typeahead used by this component tree
    typeaheadConfig.showHint = true;
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit(): void {

    this.hasInfoMessage = this.translate.get(this.searchMessageInfoKey).pipe(
      map((message: string) => isNotEmpty(message) && this.searchMessageInfoKey !== message)
    );

    this.defaultSearchFilters = this.excludeListId.map((excludeId) => {
      return new SearchFilter(`f.${this.excludeFilterName}`, [excludeId], 'notequals');
    });
    this.entityTypeSearchFilter = Object.assign(new SearchFilterConfig(), {
      name: 'entityTaskType',
      type: 'authority',
      pageSize: 20,
    });
    this.buildSearchQuery([]);
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
    this.paginationService.clearPagination(this.paginationOptions.id);
    this.search();
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
  }

  /**
   * Update the filter list on remove and dispatch a new search
   * @param removedFilter
   */
  onRemoveFilter(removedFilter: FilterBox) {
    this.updateFilterList(removedFilter);
  }

  /**
   * Update the filter list on search and dispatch a new search
   * @param searchbox
   */
  onSearchChange(searchbox: FilterBox) {
    this.updateFilterList(searchbox);
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
    if (!this.isAlreadySelected(item)) {
      this.selectedTasks.push(item);
    }
  }

  private buildSearchQuery(filters: SearchFilter[]) {
    const queries = isNotEmpty(this.query) ? [this.query] : [];
    filters.forEach((filter) => {
      if (isNotEmpty(filter) && isNotEmpty(filter.values)) {
        queries.push(filter.key + ':(' + filter.values.join(' OR ') + ')');
      }
    });

    this.defaultSearchQuery.next(encodeURIComponent(queries.join(' AND ')));
  }

  private getFilterEntries(page: number = 1) {
    this.searchTaskService.getAvailableFilterEntriesByStepType(
      this.searchConfiguration,
      this.vocabularyName,
      this.defaultSearchQuery.value,
      this.defaultSearchFilters,
      page,
      this.entityTypeSearchFilter,
      this.scope)
      .subscribe((resultPaginatedList: FacetValue[]) => {
        this.filterBoxEntries$.next(resultPaginatedList);

        const appliedFilterBoxEntries = [...this.entityTypeFilterBox.appliedFilterBoxEntries]
          .filter((entry: FilterBoxEntry) => {
            return findIndex(resultPaginatedList, { label: entry.label }) !== -1;
          });

        this.entityTypeFilterBox = Object.assign(this.entityTypeFilterBox, {
          filterFacetValues: resultPaginatedList,
          appliedFilterBoxEntries: appliedFilterBoxEntries
        });
        this.filterBoxList$.next([this.entityTypeFilterBox, this.titleFilterBox]);
      });
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

  private search() {
    const pagination$ = this.paginationService.getCurrentPagination(this.paginationOptions.id, this.paginationOptions);
    const sort$ = this.paginationService.getCurrentSort(this.paginationOptions.id, this.sortOptions);
    this.subs.push(
      combineLatest([pagination$, sort$, this.defaultSearchQuery.asObservable()]).pipe(
        tap(() => {
          this.getFilterEntries();
          this.searching$.next(true);
          this.availableTaskList$.next([]);
          this.availableTaskList$.next([]);
        }),
        debounceTime(100),
        switchMap(([paginationOptions, sortOptions, defaultSearchQuery]: [PaginationComponentOptions, SortOptions, string]) => this.searchTaskService.searchAvailableImpactPathwayTasksByStepType(
          this.searchConfiguration,
          defaultSearchQuery,
          this.defaultSearchFilters,
          paginationOptions,
          sortOptions,
          this.scope)
        )
      ).subscribe((resultPaginatedList: PaginatedList<Observable<SimpleItem>>) => {
        this.pageInfoState = resultPaginatedList.pageInfo;
        this.updateResultList(resultPaginatedList.page);
      })
    );
  }

  private updateFilterList(filterUpdate: FilterBox) {
    const filterIndex = findIndex(this.filterBoxList$.value, (filter) => {
      return filter.filterConfig.name === filterUpdate.filterConfig.name;
    });

    const newFilterList = [...this.filterBoxList$.value];
    newFilterList[filterIndex] = filterUpdate;

    this.filterBoxList$.next(newFilterList);
    this.buildSearchQuery([...this.getSearchFiltersFromFilterBoxes(this.filterBoxList$.value)]);
  }

  private updateResultList(resultList: Observable<SimpleItem>[]) {
    if (isEmpty(resultList)) {
      this.availableTaskList$.next([]);
      this.searching$.next(false);
    } else {
      this.subs.push(observableFrom(resultList).pipe(
        concatMap((list: Observable<SimpleItem>) => list),
        scan((acc: any, value: any) => [...acc, value], [])
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

  isAlreadySelected(item: SimpleItem): boolean {
    return findIndex(this.selectedTasks, { id: item.id }) !== -1;
  }
}
