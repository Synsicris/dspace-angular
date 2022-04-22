import { QueryConditionGroupComponent } from './query-condition-group/query-condition-group.component';
import { SearchService } from './../core/shared/search/search.service';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { isEqual } from 'lodash';

@Component({
  selector: 'ds-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
})
export class QueryBuilderComponent implements OnInit {


  @ViewChildren('queryGroup') queryGroups: QueryList<QueryConditionGroupComponent>;

  configurationName = 'default';

  firstDefaultFilter = 'entityType';

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
        defaultFilter: new FormControl(null),
        queryGroup: new FormArray([this.initFormArray()]),
      }),
    ]),
  });

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {}

  /**
   * get the form array
   *
   * @readonly
   * @memberof QueryBuilderComponent
   */
  get queryArray() {
    return this.searchForm.controls.queryArray as FormArray;
  }

  /**
   * redirect to search page
   */
  filter() {
    if (this.searchForm.getRawValue().queryArray.length > 0) {
      const fullQuery = this.composeQuery();
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
  composeQuery(): string {
    let fullQuery = '';

    if (this.queryGroups && this.queryGroups.toArray().length > 0) {
      for (let index = 0; index < this.queryGroups.toArray().length; index++) {
        const searchOptQuery = this.queryGroups.toArray()[index].searchOptQuery;
        const operatorIdx = 2 * index + 1;
        const operator = this.searchForm.getRawValue().queryArray[operatorIdx];
        fullQuery = fullQuery + searchOptQuery;
        if (operator && typeof operator === 'string') {
          fullQuery = fullQuery + ` ${operator} `;
        }
      }
      return fullQuery;
    }

    // for (const query of this.searchForm.getRawValue().queryArray) {
    //   if (query.queryGroup && query.queryGroup.length > 0) {
    //     for (const group of query.queryGroup) {
    //       if (group.filter && group.value) {
    //         if (query.queryGroup[query.queryGroup - 1]) {
    //           fullQuery =
    //           fullQuery + `${group.filter}:(${group.value})${group.operator} `;
    //         } else {
    //           fullQuery =
    //           fullQuery + `${group.filter}:(${group.value})${group.operator} AND`;
    //         }
    //       }
    //     }
    //   } else if (hasValue(query) && typeof query === 'string') {
    //     fullQuery = fullQuery + `${query} `;
    //   }
    // }
    return fullQuery;
  }

  /**
   * @returns the form array with default values
   */
  protected initFormArray(): FormGroup {
    return this.formBuilder.group({
      filter: this.formBuilder.control({value: null , disabled: true}),
      value: this.formBuilder.control({value: null , disabled: true}),
    });
  }

  /**
   * add new query group
   */
  addGroup() {
    this.queryArray.push(new FormControl('OR'));
    this.queryArray.push(
      new FormGroup({
        defaultFilter: new FormControl(null),
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
      if (isEqual(index, 0)) {
        // remove logical operator
        this.queryArray.removeAt(index);
      } else {
        // remove logical operator
        this.queryArray.removeAt(index - 1);
      }
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
          defaultFilter: new FormControl(null),
          queryGroup: new FormArray([this.initFormArray()]),
        }),
      ]),
    });
  }
}
