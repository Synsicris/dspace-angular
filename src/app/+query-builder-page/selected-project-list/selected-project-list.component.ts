import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { SearchService } from '../../core/shared/search/search.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { switchMap } from 'rxjs/operators';
import { toDSpaceObjectListRD } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Item } from '../../core/shared/item.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';

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

  resultListRD$: Observable<RemoteData<PaginatedList<Item>>>;

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
    this.getResults();
  }

  ngOnInit(): void {

    this.paginationChanges$ = new BehaviorSubject({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });

  }

  getResults() {
    const currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    const currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, this.sortConfig);

    this.resultListRD$ = combineLatest([currentPagination$, currentSort$]).pipe(
      switchMap(([currentPagination, currentSort]) => this.searchService.search(
        new PaginatedSearchOptions({
          configuration: this.configuration,
          query: this.query,
          pagination: currentPagination,
          sort: currentSort,
          forcedEmbeddedKeys: ['metrics']
        })).pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>
      )
    );
  }
}
