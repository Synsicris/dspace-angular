import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SearchService } from '../../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../search/paginated-search-options.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchResult } from '../search/search-result.model';
import { Context } from '../../core/shared/context.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';

@Component({
  selector: 'ds-browse-most-elements',
  styleUrls: ['./browse-most-elements.component.scss'],
  templateUrl: './browse-most-elements.component.html',
})

export class BrowseMostElementsComponent implements OnInit {

  /**
   * The search page options
   */
  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  /**
   * The search result context
   */
  @Input() context: Context = Context.BrowseMostElements;

  /**
   * The number of subprojects to show per page
   */
  @Input() elementsPerPage = 5;

  /**
   * A boolean representing if show the pagination buttons
   */
  @Input() showPagination = false;

  /**
   * The remote data containing the result list
   */
  searchResults$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>(null);

  /**
   * A boolean representing if result list is loading
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.retrieveResultList(0);
  }

  /**
   * Retrieve the paginated list
   *
   * @param page The current page of the paginated list to retrieve
   */
  retrieveResultList(page: number = 0): void {
    this.loading$.next(true);
    const paginatedSearchOptions = Object.assign(new PaginatedSearchOptions({}), this.paginatedSearchOptions, {
      pagination: {
        currentPage: page,
        pageSize: this.elementsPerPage
      }
    });

    this.searchService.search(paginatedSearchOptions).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => {
      this.searchResults$.next(response);
      this.loading$.next(false);
    });
  }

  /**
   * Retrieve previous page of the paginated list
   */
  retrievePrevResultList() {
    this.retrieveResultList(this.searchResults$.value.payload.currentPage - 1);
  }

  /**
   * Retrieve next page of the paginated list
   */
  retrieveNextResultList() {
    this.retrieveResultList(this.searchResults$.value.payload.currentPage + 1);
  }

}
