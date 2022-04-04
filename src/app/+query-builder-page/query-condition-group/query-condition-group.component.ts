import { Observable } from 'rxjs/internal/Observable';
import {
  FilterConfig,
  SearchConfig,
} from './../../core/shared/search/search-filters/search-config.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'ds-query-condition-group',
  templateUrl: './query-condition-group.component.html',
  styleUrls: ['./query-condition-group.component.scss'],
})
export class QueryConditionGroupComponent implements OnInit {

  @Input() searchConfig: SearchConfig;
  searchForm: FormGroup;
  operations: string[] = [];
  filterList: string[] = [];

  conditionObj : Map<string, string[]> = new Map();

  logicalOperators:string[]=['and', 'or']


  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      queryArray: this.formBuilder.array([this.initFormArray()]),

    });

    this.filterList = this.searchConfig.filters.map((x) => x.filter);
  }

  onSubmit(data: {}) {
    // const query = this.composeQuery(data.queryArray);
    // const configurationName = this.searchSection.discoveryConfigurationName;
    // this.router.navigate([this.searchService.getSearchLink()], {
    //   queryParams: {
    //     page: 1,
    //     configuration: configurationName,
    //     query: query
    //   }
    // });
  }

  onFilterChange(event){
    let filterValue=event.target.value
    // get operations
    if (filterValue) {
      let operatorsConfig =  this.searchConfig.filters.find(x=>x.filter== filterValue).operators;
      const operators = operatorsConfig.map(x=> x.operator);
      this.conditionObj.set(filterValue, operators)
    }
  }

  addQueryStatement(): void {
    this.queryArray.push(this.initFormArray());
  }

  get queryArray(): FormArray {
    return this.searchForm.get('queryArray') as FormArray;
  }

  initFormArray(): FormGroup {
      return this.formBuilder.group({
        filter: this.formBuilder.control(''),
        operator: this.formBuilder.control(''),
        value: this.formBuilder.control(''),
      });
  }

}
