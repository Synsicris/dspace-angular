import { PaginatedSearchOptions } from './../../shared/search/models/paginated-search-options.model';
import { SearchService } from './../../core/shared/search/search.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';

@Component({
  selector: 'ds-selected-project-list',
  templateUrl: './selected-project-list.component.html',
  styleUrls: ['./selected-project-list.component.scss'],
})
export class SelectedProjectListComponent implements OnInit, OnChanges {

  @Input() query: string;

  @Input() configuration: string;

  constructor(private searchService: SearchService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getResults();
  }

  ngOnInit(): void {}

  getResults() {
    let searchOpt: PaginatedSearchOptions = new PaginatedSearchOptions({
      configuration: this.configuration,
      query: this.query,
      pagination: new PaginationComponentOptions()
    });
  }
}
