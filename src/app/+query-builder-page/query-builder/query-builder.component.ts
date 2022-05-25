import {
  SearchSimpleItemService
} from '../../shared/create-simple-item-modal/search-simple-item/search-simple-item.service';
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { isEqual } from 'lodash';
import { QueryConditionGroupComponent } from '../query-condition-group/query-condition-group.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ds-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
  providers: [SearchSimpleItemService]
})
export class QueryBuilderComponent implements OnInit {

  /**
   * List of children components
   *
   * @type {QueryList<QueryConditionGroupComponent>}
   * @memberof QueryBuilderComponent
   */
  @ViewChildren('queryGroup') queryGroups: QueryList<QueryConditionGroupComponent>;

  /**
   * Default filter name
   *
   * @memberof QueryBuilderComponent
   */
  @Input() firstDefaultFilter = environment.projects.projectsFunder.entityTypeFilterName;

  /**
   * Emits the value of the query to upper level
   *
   * @type {EventEmitter<string>}
   * @memberof QueryBuilderComponent
   */
  @Output() onQueryCompose: EventEmitter<string> = new EventEmitter();

  /**
   * Configuration name
   * @type {string}
   * @memberof QueryBuilderComponent
   */
  @Input() configurationName = 'default';

  /**
   * Flag to check form validity
   */
  isFormValid: boolean;

  /**
   * Logical conditional operator array
   *
   * @type {string[]}
   * @memberof QueryBuilderComponent
   */
  logicalOperators: string[] = ['AND', 'OR'];

  /**
   * Initialization of the main form
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

  constructor( private formBuilder: FormBuilder ) {}

  ngOnInit(): void {}

  /**
   * Get the form array
   *
   * @readonly
   * @memberof QueryBuilderComponent
   */
  get queryArray() {
    return this.searchForm.controls.queryArray as FormArray;
  }

  /**
   * Check form validity
   * Compose the full query and emits the query value
   */
  onFormSubmit() {
    if (this.searchForm.getRawValue().queryArray.length > 0) {
      this.searchForm.markAllAsTouched();
      if (this.searchForm.valid || this.searchForm.disabled) {
        this.isFormValid = true;
        const fullQuery = this.composeQuery();
        if (fullQuery) {
          this.onQueryCompose.emit(fullQuery);
        }
      } else {
        this.isFormValid = false;
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
        if (searchOptQuery) {
          const operatorIdx = 2 * index + 1;
          const operator =
            this.searchForm.getRawValue().queryArray[operatorIdx];
          fullQuery = `${fullQuery}(${searchOptQuery})`;
          if (operator && typeof operator === 'string') {
            fullQuery = `${fullQuery} ${operator} `;
          }
        }
      }

      return encodeURIComponent(fullQuery);
    }
    return fullQuery;
  }

  /**
   * @returns the form array with default values
   */
  protected initFormArray(): FormGroup {
    return this.formBuilder.group({
      filter: this.formBuilder.control(
        { value: null, disabled: true },
        Validators.required
      ),
      value: this.formBuilder.control(
        { value: null, disabled: true },
        Validators.required
      ),
    });
  }

  /**
   * Add new query group
   */
  addGroup() {
    this.queryArray.push(new FormControl('OR'));
    this.queryArray.push(
      new FormGroup({
        defaultFilter: new FormControl(null, Validators.required),
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
   * Reset the form
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
