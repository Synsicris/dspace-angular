import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { SearchService } from '../../core/shared/search/search.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { getFirstCompletedRemoteData, toDSpaceObjectListRD } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Item } from '../../core/shared/item.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { PROJECT_RELATION_SOLR } from '../../core/project/project-data.service';

@Component({
  selector: 'ds-selected-project-list',
  templateUrl: './selected-project-list.component.html',
  styleUrls: ['./selected-project-list.component.scss'],
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class SelectedProjectListComponent implements OnInit, OnChanges {

  @Input() query: string;

  @Input() configuration: string;

  paginationConfig: PaginationComponentOptions;

  processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  resultListRD$: BehaviorSubject<RemoteData<PaginatedList<Item>>> = new BehaviorSubject<RemoteData<PaginatedList<Item>>>(null);

  sortConfig: SortOptions;

  private paginationChanges$: Subject<{
    paginationConfig: PaginationComponentOptions,
    sortConfig: SortOptions
  }>;

  constructor(
    private paginationService: PaginationService,
    private searchService: SearchService) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'fp';
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.query && !changes.query.isFirstChange()) {
      this.buildQuery(changes.query.currentValue);
      this.getResults(false);
    }

  }

  ngOnInit(): void {
    this.paginationChanges$ = new BehaviorSubject({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });
    this.buildQuery(this.query);
    this.getResults();

  }

  getResults(useCachedVersionIfAvailable = true) {
    this.processing$.next(true);
    const currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    const currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, this.sortConfig);

    combineLatest([currentPagination$, currentSort$]).pipe(
      switchMap(([currentPagination, currentSort]) => this.searchService.search(
        new PaginatedSearchOptions({
          configuration: this.configuration,
          query: this.query,
          pagination: currentPagination,
          sort: currentSort,
          forcedEmbeddedKeys: ['metrics']
        }), null, useCachedVersionIfAvailable)
        .pipe(
          toDSpaceObjectListRD(),
          getFirstCompletedRemoteData()
        ) as Observable<RemoteData<PaginatedList<Item>>>
      )
    ).subscribe((result: RemoteData<PaginatedList<Item>>) => {
      this.resultListRD$.next(result);
      this.processing$.next(false);
    });
  }

  private buildQuery(query: string) {
    if (query) {
      if (query.includes('entityType:"Project"')) {
        // if the query condition rely on the Project entity than make the join on search.resourceid

        this.query = `{!join from=search.resourceid to=search.resourceid}${query}`;
      } else {
        // if the query condition rely on any entity different from the Project than make the join on synsicris.relation.project
        this.query = `{!join from=${PROJECT_RELATION_SOLR} to=search.resourceid}${query}`;
      }
    } else {
      this.query = '';
    }
  }

}
