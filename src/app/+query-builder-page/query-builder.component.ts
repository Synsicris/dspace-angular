import {
  SearchConfig,
  FilterConfig,
} from './../core/shared/search/search-filters/search-config.model';

import { getRemoteDataPayload } from './../core/shared/operators';
import { SearchService } from './../core/shared/search/search.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'ds-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
})
export class QueryBuilderComponent implements OnInit {

  searchFilterData: SearchConfig;
  facetValues: FilterConfig[];
  logicalOperators: string[] = ['and', 'or'];

  searchForm: FormGroup = new FormGroup({
    queryArray: new FormArray([
     new FormGroup({
        queryGroup: new FormArray([this.initFormArray()]),
      }),
    ]),
  });

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder
  ) {
    this.getSearchData();
  }

  ngOnInit(): void { }

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

  get queryArray() {
    return this.searchForm.controls['queryArray'] as FormArray;
  }

  filter() {
    console.log(this.searchForm.value, 'formValue');

    if (this.searchForm.value.queryArray.length > 0) {
      this.composeQuery();
    }
  }

  composeQuery() {
    let fullQuery = '';
    for (const query of this.searchForm.controls['queryArray'].value) {
      if (query.queryGroup.length > 0) {
        for (const group of query['queryGroup']) {
          if (group.filter && group.operator && group.value) {
            fullQuery =
              fullQuery + `${group.filter}(${group.value})${group.operator}`;
          }
        }
      }
    }
    // TODO: call the search service to get the data
  }

  initFormArray(): FormGroup {
    return this.formBuilder.group({
      filter: this.formBuilder.control(''),
      operator: this.formBuilder.control(''),
      value: this.formBuilder.control(''),
    });
  }

  addGroup() {
    this.queryArray.push(
      new FormGroup({
        queryGroup: new FormArray([this.initFormArray()]),
      })
    );
  }

  deleteGroup(index: number) {
    if (index > -1) {
      this.queryArray.removeAt(index);
    }
  }

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
