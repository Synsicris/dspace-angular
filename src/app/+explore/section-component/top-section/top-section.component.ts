import { Component, Input, OnInit } from '@angular/core';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { TopSection } from '../../../core/layout/models/section.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../shared/search/paginated-search-options.model';
import { Context } from '../../../core/shared/context.model';

/**
 * Component representing the Top component section.
 */
@Component({
  selector: 'ds-top-section',
  templateUrl: './top-section.component.html'
})
export class TopSectionComponent implements OnInit {

  @Input()
  sectionId: string;

  @Input()
  topSection: TopSection;

  @Input()
  context: Context = Context.BrowseMostElements;

  paginatedSearchOptions: PaginatedSearchOptions;

  ngOnInit() {

    const order = this.topSection.order;
    const sortDirection = order && order.toUpperCase() === 'ASC' ? SortDirection.ASC : SortDirection.DESC;
    const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'search-object-pagination',
      pageSize: 5,
      currentPage: 1
    });

    this.paginatedSearchOptions = new PaginatedSearchOptions({
      configuration: this.topSection.discoveryConfigurationName,
      pagination: pagination,
      sort: new SortOptions(this.topSection.sortField, sortDirection)
    });
  }

}
