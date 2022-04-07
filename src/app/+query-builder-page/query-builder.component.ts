import {
  SearchConfig,
  FilterConfig,
} from './../core/shared/search/search-filters/search-config.model';

import { getRemoteDataPayload } from './../core/shared/operators';
import { SearchService } from './../core/shared/search/search.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { hasValue } from '../shared/empty.util';
import { SearchFilterConfig } from '../shared/search/models/search-filter-config.model';
import { Router } from '@angular/router';

@Component({
  selector: 'ds-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
})
export class QueryBuilderComponent implements OnInit {
  /**
   * data for the filter dropdowns
   */
  searchFilterData: SearchConfig;

  configurationName = 'default';

  /**
   * logical conditional operator list
   *
   * @type {string[]}
   * @memberof QueryBuilderComponent
   */
  logicalOperators: string[] = ['AND', 'OR'];

  /**
   * initialization of the main form
   *
   * @type {FormGroup}
   * @memberof QueryBuilderComponent
   */
  searchForm: FormGroup = new FormGroup({
    queryArray: new FormArray([
      new FormGroup({
        queryGroup: new FormArray([this.initFormArray()]),
      }),
    ]),
  });

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.getSearchData();
  }

  ngOnInit(): void {}

  /**
   * get the search configuration data
   */
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

  /**
   * get the form array
   *
   * @readonly
   * @memberof QueryBuilderComponent
   */
  get queryArray() {
    return this.searchForm.controls['queryArray'] as FormArray;
  }

  /**
   * redirect to search page
   */
  filter() {
    if (this.searchForm.value.queryArray.length > 0) {
      let fullQuery = this.composeQuery();
      if (fullQuery) {
        this.router.navigate([this.searchService.getSearchLink()], {
          queryParams: {
            page: 1,
            configuration: this.configurationName,
            query: fullQuery,
          },
        });
      }
    }
  }

  /**
   * Compose the query string based on given conditions
   * @returns the full query string
   */
  protected composeQuery(): string {
    let fullQuery = '';
    for (const query of this.searchForm.controls['queryArray'].value) {
      if (query.queryGroup && query.queryGroup.length > 0) {
        for (const group of query['queryGroup']) {
          if (group.filter && group.operator && group.value) {
            fullQuery =
              fullQuery + `${group.filter}:(${group.value})${group.operator} `;
          } else if (hasValue(group) && typeof group === 'string') {
            fullQuery = fullQuery + `${group} `;
          }
        }
      } else if (hasValue(query) && typeof query === 'string') {
        fullQuery = fullQuery + `${query} `;
      }
    }
    console.log('fullQuery', fullQuery);
    return fullQuery;
  }

  /**
   * @returns the form array with default values
   */
  protected initFormArray(): FormGroup {
    return this.formBuilder.group({
      filter: this.formBuilder.control(''),
      operator: this.formBuilder.control(''),
      value: this.formBuilder.control(''),
    });
  }

  /**
   * add new query group
   */
  addGroup() {
    this.queryArray.push(new FormControl(''));
    this.queryArray.push(
      new FormGroup({
        queryGroup: new FormArray([this.initFormArray()]),
      })
    );
  }

  /**
   * @param index of intended group to be deleted
   */
  deleteGroup(index: number) {
    if (index > -1) {
      // remove the query statement
      this.queryArray.removeAt(index);
      // remove logical operator
      this.queryArray.removeAt(index - 1);
      this.queryArray.updateValueAndValidity();
    }
  }

  /**
   * reset the form
   */
  resetForm() {
    this.searchForm = new FormGroup({
      queryArray: new FormArray([
        new FormGroup({
          queryGroup: new FormArray([this.initFormArray()]),
        }),
      ]),
    });
  }
}
