import { SearchOptions } from './../../shared/search/models/search-options.model';
import { map } from 'rxjs/operators';
import { SearchService } from './../../core/shared/search/search.service';
import { FacetValues } from './../../shared/search/models/facet-values.model';
import { getRemoteDataPayload } from './../../core/shared/operators';
import { FacetValue } from './../../shared/search/models/facet-value.model';
import { SearchFilterConfig } from './../../shared/search/models/search-filter-config.model';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { isEqual, isNil } from 'lodash';
import { isNotEmpty } from 'src/app/shared/empty.util';
import { SearchFilter } from 'src/app/shared/search/models/search-filter.model';

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
   * form group name for the current query group
   *
   * @type {string}
   * @memberof QueryConditionGroupComponent
   */
  @Input() formGroupName: string;

  @Input() configurationName = 'default';

  formGroup: FormGroup;

  searchFilterConfigs: SearchFilterConfig[] = [];

  firstDefaultFilter = 'entityType';

  firstDefaultValues: FacetValue[] = [];

  secondColumnFilters: SearchFilterConfig[] = [];

  filterValuesMap: Map<string, FacetValue[]> = new Map<string, FacetValue[]>();

  searchOptQuery = '';

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

  getSearchFilterConfigs() {
    this.searchService
      .getConfig(null, this.configurationName)
      .pipe(getRemoteDataPayload())
      .subscribe((res: SearchFilterConfig[]) => {
        if (res) {
          this.searchFilterConfigs = res;
          this.getFacetValues(
            this.firstDefaultFilter,
            1,
            SearchValueMode.Default
          );
        }
      });
  }

  /**
   * On value selection of first dropdown
   */
  onDefaultValueSelect() {
    this.calcSearchFilterConfigs(SearchValueMode.Default);
    // enable the filter dropdown on the first selection
    this.enableFormControlOnSelectionChange(0, 'filter');
  }

  /**
   * get facet values for each configuration,
   * in order to display only the ones with data
   * @param mode
   */
  private calcSearchFilterConfigs(mode?: SearchValueMode) {
    const searchFilter: SearchFilter[] = [
      {
        values: [this.formGroup.get('defaultFilter').value], // selected value
        key: this.firstDefaultFilter, // default filter name
        operator: 'equals',
      },
    ];

    this.searchFilterConfigs.forEach((config: SearchFilterConfig) => {
      if (isEqual(config.name, this.firstDefaultFilter)) {
        return;
      }

      if (isNil(mode)) {
        const filterValues: FilterValue[] = this.queryGroup.getRawValue();
        const values = filterValues
          .filter((x) => isEqual(x.filter, config.name))
          .map((x) => x.value);

        searchFilter.push({
          values: values, // searched value
          key: config.name, // filter name
          operator: 'equals',
        });
      }

      const searchOptions: SearchOptions = new SearchOptions({
        configuration: this.configurationName,
        query: this.buildSearchQuery(searchFilter),
      });

      this.searchService
        .getFacetValuesFor(config, 1, searchOptions)
        .pipe(
          getRemoteDataPayload(),
          map((c: FacetValues) => {
            if (c && c.page.length > 0) {
              this.secondColumnFilters;
              if (
                !this.secondColumnFilters.some((x) =>
                  isEqual(x.name, config.name)
                )
              ) {
                this.secondColumnFilters.push(config);
              }
            }
          })
        )
        .subscribe();
    });
  }

  /**
   * Get facet values for the selected filter
   * @param searchFilter
   * @param idx
   */
  onFilterSelect(searchFilter: string, idx: number) {
    this.getFacetValues(searchFilter, 1, SearchValueMode.Select, idx);
  }

  /**
   * disable the last selected value
   * @param selectedValue
   * @param parentFilter
   */
  onValueSelect(selectedValue: string, parentFilter: string) {
    // disable last selected value
    (
      this.filterValuesMap
        .get(parentFilter)
        .find((x) => isEqual(x.value, selectedValue)) as any
    ).disable = true;

    let disabledValues = this.filterValuesMap
      .get(parentFilter)
      .filter((x: any) => x.disable);
    // calculate disabled previous selected values
    disabledValues.forEach((x) => {
      if (!this.queryGroup.getRawValue().find((f) => isEqual(f.value, x.value))) {
        (
          this.filterValuesMap
            .get(parentFilter)
            .find((v) => isEqual(v.value, x.value)) as any
        ).disable = false;
      }
    });
  }

  /**
   * disable the last selected filter and value pair
   * add a new query statement
   */
  addQueryStatement(index: number): void {
    if (isEqual(index, 0)) {
      // disable first dropdown
      this.formGroup.get('defaultFilter').disable();
    }
    this.disableFormControlOnSelectionChange(index, 'filter');
    this.disableFormControlOnSelectionChange(index, 'value');
    this.queryGroup.push(this.initFormArray());
    this.calcSearchFilterConfigs();
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
  deleteCondition(index: number, selectedValue: AbstractControl) {
    if (index > -1) {
      // when a condition is deleted, the filter's selected value is enabled again
      (
        this.filterValuesMap
          .get(this.queryGroup.getRawValue()[index].filter)
          .find((x) => isEqual(x.value, selectedValue.value)) as any
      ).disable = false;

      // remove the query statement
      this.queryGroup.removeAt(index);
    }
  }

  onValuesScroll(searchFilter: string, idx: number) {
    this.getFacetValues(searchFilter, null, SearchValueMode.Scroll, idx);
  }

  private getFacetValues(
    searchFilter: string,
    page: number = 1,
    mode?: SearchValueMode,
    idx?: number,
    searchOptions?: SearchOptions
  ) {
    let calPage: number = page;
    if (
      mode &&
      isEqual(mode, SearchValueMode.Scroll) &&
      this.filterValuesMap.get(searchFilter).length > 0
    ) {
      // calculate page
      calPage = this.filterValuesMap.get(searchFilter).length / 10 + 1;
    }

    const searchFilterConfig = this.searchFilterConfigs?.find((x) =>
      isEqual(x.name, searchFilter)
    );

    if (searchFilterConfig) {
      this.searchService
        .getFacetValuesFor(searchFilterConfig, calPage, searchOptions)
        .pipe(getRemoteDataPayload())
        .subscribe((res: FacetValues) => {
          if (res && res.page?.length > 0) {
            const filterValues = res.page.map((value) => {
              return {
                ...value,
                disable: false,
              };
            });

            if (!this.filterValuesMap.has(searchFilter)) {
              // in order not to change reference of the key to filterValuesMap
              this.filterValuesMap.set(searchFilter, filterValues);
              if (isEqual(mode, SearchValueMode.Default)) {
                // fill the first values dropdown with data
                this.firstDefaultValues = filterValues;
              }
            } else if (calPage > 1 && this.filterValuesMap.has(searchFilter)) {
              // concat data from the next page, if there are any data
              const existingValues = this.filterValuesMap.get(searchFilter);
              this.filterValuesMap.set(searchFilter, [
                ...filterValues,
                ...existingValues,
              ]);
            }

            if (!isNil(idx)) {
              this.enableFormControlOnSelectionChange(idx, 'value');
            }
          }
        });
    }
  }

  /**
   * enable the disabled dropdowns
   * @param idx
   * @param name
   */
  private enableFormControlOnSelectionChange(idx: number, name: string) {
    this.queryGroup.get(`${idx}.${name}`).enable();
    this.queryGroup.updateValueAndValidity();
  }

  private disableFormControlOnSelectionChange(idx: number, name: string) {
    this.queryGroup.get(`${idx}.${name}`).disable();
    this.queryGroup.updateValueAndValidity();
  }

  private buildSearchQuery(filters: SearchFilter[]) {
    const queries = isNotEmpty(this.searchOptQuery)
      ? [this.searchOptQuery]
      : [];
    filters.forEach((filter) => {
      if (isNotEmpty(filter) && isNotEmpty(filter.values)) {
        queries.push(filter.key + ':(' + filter.values.join(' AND ') + ')');
      }
    });

    return encodeURIComponent(queries.join(' AND '));
  }
}

export enum SearchValueMode {
  Default = 'Default',
  Scroll = 'Scroll',
  Search = 'Search',
  Select = 'Select',
}

export interface FilterValue {
  filter: string;
  value: string;
}
