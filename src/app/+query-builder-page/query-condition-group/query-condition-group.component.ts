import { SearchConfig } from './../../core/shared/search/search-filters/search-config.model';
import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';

export interface FilterOptions {
  disabled: boolean;
  filter: string
}

@Component({
  selector: 'ds-query-condition-group',
  templateUrl: './query-condition-group.component.html',
  styleUrls: ['./query-condition-group.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class QueryConditionGroupComponent implements OnInit {

  /**
   * search config object for the current filter
   *
   * @type {SearchConfig}
   * @memberof QueryConditionGroupComponent
   */
  @Input() searchConfig: SearchConfig;

  /**
   * form group name for the current query group
   *
   * @type {string}
   * @memberof QueryConditionGroupComponent
   */
  @Input() formGroupName: string;

  formGroup: FormGroup;

  /**
   * get the operators list for a selected filter
   *
   * @type {Map<string, string[]>}
   * @memberof QueryConditionGroupComponent
   */
  conditionObj: Map<string, string[]> = new Map();

  logicalOperators: string[] = ['and', 'or'];

  /**
   * get filter list
   *
   * @type {FilterOptions[]}
   * @memberof QueryConditionGroupComponent
   */
  filterList: FilterOptions[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private rootFormGroup: FormGroupDirective
  ) { }

  ngOnInit(): void {
    this.formGroup = (
      this.rootFormGroup.control.get('queryArray') as FormArray
    ).controls[this.formGroupName];

    this.filterList = this.searchConfig.filters.map((x) => { return { disabled: false, filter: x.filter } });
  }

  /**
   * on filter change event get operation list
   * and disable the filter option
   * @param event select / change event
   */
  onFilterChange(event) {
    let filterValue = event.target.value;
    if (filterValue) {
      let operatorsConfig = this.searchConfig.filters.find(
        (x) => x.filter == filterValue
      ).operators;
      const operators = operatorsConfig.map((x) => x.operator);
      this.conditionObj.set(filterValue, operators);
      this.filterList.find((x) => x.filter === filterValue).disabled = true;
    }
  }

  /**
   * add a new query statement
   */
  addQueryStatement(): void {
    this.queryGroup.push(this.initFormArray());
  }

  /**
   * get the query group
   *
   * @readonly
   * @type {FormArray}
   * @memberof QueryConditionGroupComponent
   */
  get queryGroup(): FormArray {
    return this.formGroup.get('queryGroup') as FormArray;
  }

  /**
   * initializes a new form group for a query statement
   * @returns {FormGroup}
   */
  initFormArray(): FormGroup {
    return this.formBuilder.group({
      filter: this.formBuilder.control(''),
      operator: this.formBuilder.control(''),
      value: this.formBuilder.control(''),
    });
  }

  /**
   * delete a query statement and enable the filter option
   * @param index qyery statement index
   */
  deleteCondition(index: number) {
    if (index > -1) {
      // when a condition is deleted, the filter is enabled again
      this.filterList.find((x) => x.filter === this.queryGroup.controls[index].get('filter').value).disabled = false;
      this.queryGroup.removeAt(index);
    }
  }
}
