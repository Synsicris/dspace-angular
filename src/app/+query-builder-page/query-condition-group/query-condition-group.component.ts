import { SearchOptions } from './../../shared/search/models/search-options.model';
import { map } from 'rxjs/operators';
import { SearchService } from './../../core/shared/search/search.service';
import { FacetValues } from './../../shared/search/models/facet-values.model';
import { getRemoteDataPayload } from './../../core/shared/operators';
import { FacetValue } from './../../shared/search/models/facet-value.model';
import { SearchFilterConfig } from './../../shared/search/models/search-filter-config.model';
import { SearchConfig } from './../../core/shared/search/search-filters/search-config.model';
import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { isEqual } from 'lodash';

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

  // -------------------------------------------------------------------------------------

  searchFilterConfigs: SearchFilterConfig[] = [];

  facetValues: FacetValue[] = [];

  firstDefaultFilter = 'itemtype';

  firstDefaultValues: FacetValue[] = [];

  secondColumnFilters: SearchFilterConfig[] = [];

  filterValuesMap: Map<string, FacetValue[]> = new Map<string, FacetValue[]>();

  selectedValuesPerFilter: Map<string, string[]> = new Map<string, string[]>();

  constructor(
    private formBuilder: FormBuilder,
    private rootFormGroup: FormGroupDirective,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.formGroup = (
      this.rootFormGroup.control.get('queryArray') as FormArray
    ).controls[this.formGroupName];

    this.getSearchFilterConfigs();
  }

  getSearchFilterConfigs() {
    this.searchService
      .getConfig(null, 'default')
      .pipe(getRemoteDataPayload())
      .subscribe((res: SearchFilterConfig[]) => {
        if (res) {
          this.searchFilterConfigs = res;

          this.getFirstdefaultValues(this.firstDefaultFilter);
        }
      });
  }

  getFirstdefaultValues(searchFilter: string, page: number = 1) {

    const searchFilterConfig = this.searchFilterConfigs?.find(
      (x) => x.name == searchFilter
    );
    if (searchFilterConfig) {
      this.searchService
        .getFacetValuesFor(searchFilterConfig, page)
        .pipe(getRemoteDataPayload())
        .subscribe((res: FacetValues) => {
          if (res) {
            let filterValues = res.page.map((value) => {
              return {
                ...value,
                disable: false,
              };
            });
            this.filterValuesMap.set(this.firstDefaultFilter, filterValues);
            this.firstDefaultValues = filterValues;
          }
        });
    }
  }

  onDefaultValueSelect(selectedValue) {
    this.searchFilterConfigs.forEach((config) => {
      this.searchService
        .getFacetValuesFor(config, 1)
        .pipe(
          getRemoteDataPayload(),
          map((c: FacetValues) => {
            if (c && c.page.length > 0) {
              this.secondColumnFilters.push(config);
              // TODO: disable filter option if no value available
              this.enableFormControl(0, 'filter');
              (
                this.filterValuesMap
                  .get(this.firstDefaultFilter)
                  .find((x) => x.value == selectedValue) as any
              ).disable = true;
            }
          })
        )
        .subscribe();
    });
  }

  onFilterSelect(searchFilter: string, page: number = 1, idx: number) {
    const searchFilterConfig = this.searchFilterConfigs?.find(
      (x) => x.name == searchFilter
    );
    if (searchFilterConfig) {
      this.searchService
        .getFacetValuesFor(searchFilterConfig, page)
        .pipe(getRemoteDataPayload())
        .subscribe((res: FacetValues) => {
          if (res.page) {
            if (!this.filterValuesMap.has(searchFilter)) {
              let filterValues = res.page.map((value) => {
                return {
                  ...value,
                  disable: false,
                };
              });
              this.filterValuesMap.set(searchFilter, filterValues);
            }
            this.enableFormControl(idx, 'value');
          }
        });
    }
  }

  onValueSelect(selectedValue: string, parentFilter: string) {
    (
      this.filterValuesMap
        .get(parentFilter)
        .find((x) => x.value == selectedValue) as any
    ).disable = true;
    let disabledValues = this.filterValuesMap
      .get(parentFilter)
      .filter((x: any) => x.disable);

    disabledValues.forEach((x) => {
      if (
        !this.queryGroup.value.find((f) => f.value == x.value) &&
        !isEqual(x.value, this.formGroup.get('defaultFilter').value)
      ) {
        (
          this.filterValuesMap
            .get(parentFilter)
            .find((v) => v.value == x.value) as any
        ).disable = false;
      }
    });
  }

  /**
   * and the logical opertor formControl and
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
      filter: this.formBuilder.control({ value: null, disabled: false }),
      value: this.formBuilder.control({ value: null, disabled: true }),
    });
  }

  /**
   * delete a query statement and enable the filter option
   * @param index qyery statement index
   */
  deleteCondition(index: number) {
    if (index > -1) {
      // when a condition is deleted, the filter is enabled again
      // remove the query statement
      this.queryGroup.removeAt(index);
    }
  }

  enableFormControl(idx: number, name: string) {
    if (this.queryGroup.get(`${idx}.${name}`).value) {
      this.queryGroup.get(`${idx}.${name}`).setValue(null);
    } else {
      this.queryGroup.get(`${idx}.${name}`).enable();
    }
    this.queryGroup.updateValueAndValidity();
  }

  onFirstDropdownOpen() {
    // calc disabled fields for first default values
    if (this.formGroup.get('defaultFilter').value) {
      let disabledValues = this.filterValuesMap
        .get(this.firstDefaultFilter)
        .filter((x: any) => x.disable);

      this.firstDefaultValues.forEach(x => {
        if (disabledValues.some(v => v.value == x.value)) {
          (x as any).disable = true;
        }
      })
    }
  }

  onValuesScroll(searchFilter: string, idx: number) {
    this.getFacetValues('scroll',searchFilter, idx);
  }

  private getFacetValues(mode : string, searchFilter: string, page : number = 1, idx?: number , searchOptions?: SearchOptions ) {

    let calPage:number = page;

    if (mode == 'scroll') {
      if (this.filterValuesMap
        .get(searchFilter).length > 0) {
        calPage = this.filterValuesMap
          .get(searchFilter).length / 10 + 1;
      }
    }


    const searchFilterConfig = this.searchFilterConfigs?.find(
      (x) => x.name == searchFilter
    );

    if (searchFilterConfig) {
      this.searchService
        .getFacetValuesFor(searchFilterConfig, calPage, searchOptions)
        .pipe(getRemoteDataPayload())
        .subscribe((res: FacetValues) => {
          if (res && res.page?.length > 0) {
            let filterValues = res.page.map((value) => {
              return {
                ...value,
                disable: false,
              };
            });

            if (!this.filterValuesMap.has(searchFilter)) {
              this.filterValuesMap.set(searchFilter, filterValues);
            } else if(calPage > 1 && this.filterValuesMap.has(searchFilter)) {
              let existingValues = this.filterValuesMap.get(searchFilter);
              this.filterValuesMap.set(searchFilter, [...filterValues, ...existingValues]);
            }

            if (idx) {
               this.enableFormControl(idx, 'value');
            }
          }
        });
    }
  }

  searchValue(event) {
    console.log(event);

    const searchOptions: SearchOptions = new SearchOptions({
      configuration: ' default',
      filters: [{
        values: [event.term],
        key: `f.${this.firstDefaultFilter}`,
        operator: 'contains'
      }]
    });

    // TODO: search value
    // https://dspacecris7.4science.cloud/server/api/discover/facets/itemtype?page=0&size=10&configuration=%20default&f.itemtype=other,equals

    // returns values {label , type }
    // get and bind with label

    this.getFacetValues('search' ,this.firstDefaultFilter, 1, null, searchOptions);
  }
}
