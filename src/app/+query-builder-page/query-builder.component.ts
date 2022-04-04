import { Observable } from 'rxjs';
import {
  SearchConfig,
  FilterConfig,
} from './../core/shared/search/search-filters/search-config.model';

import { getRemoteDataPayload } from './../core/shared/operators';
import { SearchService } from './../core/shared/search/search.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ds-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
})
export class QueryBuilderComponent implements OnInit {
  searchFilterData: SearchConfig;
  facetValues: FilterConfig[];

  constructor(private searchService: SearchService) {
    this.getSearchData();
    this.getFacets();
  }

  ngOnInit(): void {}

  getSearchData() {
    this.searchService
      .getSearchConfigurationFor()
      .pipe(getRemoteDataPayload())
      .subscribe((res: SearchConfig) => {
        if (res) {
          this.searchFilterData = res;
        }
      });
  }

  getFacets() {
    this.searchService
      .getConfig()
      .pipe(getRemoteDataPayload())
      .subscribe((res) => {});
  }
}
