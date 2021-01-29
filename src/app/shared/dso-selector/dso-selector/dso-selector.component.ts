import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
  Subscription
} from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';

import { SearchService } from '../../../core/shared/search/search.service';
import { CollectionElementLinkType } from '../../object-collection/collection-element-link.type';
import { PaginatedSearchOptions } from '../../search/paginated-search-options.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { Context } from '../../../core/shared/context.model';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { hasValue, isEmpty, isNotEmpty } from '../../empty.util';
import { PaginatedList, buildPaginatedList } from '../../../core/data/paginated-list.model';
import { SearchResult } from '../../search/search-result.model';

@Component({
  selector: 'ds-dso-selector',
  styleUrls: ['./dso-selector.component.scss'],
  templateUrl: './dso-selector.component.html'
})

/**
 * Component to render a list of DSO's of which one can be selected
 * The user can search the list by using the input field
 */
export class DSOSelectorComponent implements OnInit, OnDestroy {
  /**
   * The view mode of the listed objects
   */
  viewMode = ViewMode.ListElement;
  /**
   * The initially selected DSO's uuid
   */
  @Input() currentDSOId: string;

  /**
   * The types of DSpace objects this components shows a list of
   */
  @Input() types: DSpaceObjectType[];

  // list of allowed selectable dsoTypes
  typesString: string;

  /**
   * Emits the selected Object when a user selects it in the list
   */
  @Output() onSelect: EventEmitter<DSpaceObject> = new EventEmitter();

  /**
   * Input form control to query the list
   */
  public input: FormControl = new FormControl();

  /**
   * Default pagination for this feature
   */
  defaultPagination = { id: 'dso-selector', currentPage: 1, pageSize: 10 } as any;

  /**
   * List with search results of DSpace objects for the current query
   */
  listEntries: SearchResult<DSpaceObject>[] = [];

  /**
   * The current page to load
   * Dynamically goes up as the user scrolls down until it reaches the last page possible
   */
  currentPage$ = new BehaviorSubject(1);

  /**
   * Whether or not the list contains a next page to load
   * This allows us to avoid next pages from trying to load when there are none
   */
  hasNextPage = false;

  /**
   * Whether or not the list should be reset next time it receives a page to load
   */
  resetList = false;

  /**
   * List of element references to all elements
   */
  @ViewChildren('listEntryElement') listElements: QueryList<ElementRef>;

  /**
   * Time to wait before sending a search request to the server when a user types something
   */
  debounceTime = 500;

  /**
   * The available link types
   */
  linkTypes = CollectionElementLinkType;

  /**
   * Track whether the element has the mouse over it
   */
  isMouseOver = false;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  public subs: Subscription[] = [];

  constructor(protected searchService: SearchService) {
  }

  /**
   * Fills the listEntries variable with search results based on the input field's current value and the current page
   * The search will always start with the initial currentDSOId value
   */
  ngOnInit(): void {
    this.typesString = this.types.map((type: string) => type.toString().toLowerCase()).join(', ');

    // Create an observable searching for the current DSO (return empty list if there's no current DSO)
    let currentDSOResult$;
    if (isNotEmpty(this.currentDSOId)) {
      currentDSOResult$ = this.search(this.getCurrentDSOQuery(), 1);
    } else {
      currentDSOResult$ = observableOf(buildPaginatedList(undefined, []));
    }

    // Combine current DSO, query and page
    this.subs.push(observableCombineLatest(
      currentDSOResult$,
      this.input.valueChanges.pipe(
        debounceTime(this.debounceTime),
        startWith(''),
        tap(() => this.currentPage$.next(1))
      ),
      this.currentPage$
    ).pipe(
      switchMap(([currentDSOResult, query, page]: [PaginatedList<SearchResult<DSpaceObject>>, string, number]) => {
        if (page === 1) {
          // The first page is loading, this means we should reset the list instead of adding to it
          this.resetList = true;
        }
        return this.search(query, page).pipe(
          map((list) => {
            // If it's the first page and no query is entered, add the current DSO to the start of the list
            // If no query is entered, filter out the current DSO from the results, as it'll be displayed at the start of the list already
            list.page = [
              ...((isEmpty(query) && page === 1) ? currentDSOResult.page : []),
              ...list.page.filter((result) => isNotEmpty(query) || result.indexableObject.id !== this.currentDSOId)
            ];
            return list;
          })
        );
      })
    ).subscribe((list) => {
      if (this.resetList) {
        this.listEntries = list.page;
        this.resetList = false;
      } else {
        this.listEntries.push(...list.page);
      }
      // Check if there are more pages available after the current one
      this.hasNextPage = list.totalElements > this.listEntries.length;
    }));
  }

  /**
   * Get a query to send for retrieving the current DSO
   */
  getCurrentDSOQuery(): string {
    return `search.resourceid:${this.currentDSOId}`;
  }

  /**
   * Perform a search for the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   */
  search(query: string, page: number): Observable<PaginatedList<SearchResult<DSpaceObject>>> {
    return this.searchService.search(
      new PaginatedSearchOptions({
        query: query,
        dsoTypes: this.types,
        pagination: Object.assign({}, this.defaultPagination, {
          currentPage: page
        })
      })
    ).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }

  /**
   * When the user reaches the bottom of the page (or almost) and there's a next page available, increase the current page
   */
  onScrollDown() {
    if (this.hasNextPage) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }
  }

  /**
   * Set focus on the first list element when there is only one result
   */
  selectSingleResult(): void {
    if (this.listElements.length > 0) {
      this.listElements.first.nativeElement.click();
    }
  }

  /**
   * Get the context for element with the given id
   */
  getContext(id: string) {
    if (id === this.currentDSOId) {
      return Context.SideBarSearchModalCurrent;
    } else {
      return Context.SideBarSearchModal;
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
