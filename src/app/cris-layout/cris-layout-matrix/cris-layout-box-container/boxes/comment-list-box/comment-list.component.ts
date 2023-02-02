import { SortDirection, SortOptions } from './../../../../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from './../../../../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from './../../../../../shared/search/models/paginated-search-options.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ds-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  @Input() itemUUID: string;

  @Input() boxType: string;

  /**
  * The PaginatedSearchOptions
  */
  paginatedSearchOptions: PaginatedSearchOptions;

  configuration = '';

  constructor() {
  }

  ngOnInit(): void {
    const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'cl',
      pageSize: 5,
      currentPage: 1
    });

    this.paginatedSearchOptions = new PaginatedSearchOptions({
      configuration: this.configuration,
      pagination: pagination,
      scope: this.itemUUID,
      sort: new SortOptions('lastModified', SortDirection.DESC)
    });
  }
}
