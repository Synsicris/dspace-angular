import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { isEqual, isNil, isNull } from 'lodash';

import { SearchOptions } from '../../shared/search/models/search-options.model';
import { SearchService } from '../../core/shared/search/search.service';
import { FacetValues } from '../../shared/search/models/facet-values.model';
import { getRemoteDataPayload } from '../../core/shared/operators';
import { FacetValue } from '../../shared/search/models/facet-value.model';
import { SearchFilterConfig } from '../../shared/search/models/search-filter-config.model';
import { isNotEmpty } from '../../shared/empty.util';
import { LocaleService } from '../../core/locale/locale.service';

export interface QueryBuilderSearchFilter {
  key: string;
  values: FacetValue[];
  operator: string;
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
   * form group name for the current query group
   *
   * @type {string}
   * @memberof QueryConditionGroupComponent
   */
  @Input() formGroupName: string;

  /**
   * Configuration name
   * @type {string}
   * @memberof QueryConditionGroupComponent
   */
  @Input() configurationName = 'default';

  /**
   * Filter name selected to fill the first dropdown
   *
   * @type {string}
   * @memberof QueryConditionGroupComponent
   */
  @Input() firstDefaultFilter: string;

  /**
   * Get the reference of the current form group name
   *
   * @type {FormGroup}
   * @memberof QueryConditionGroupComponent
   */
  formGroup: FormGroup;

  /**
   * All search filter configurations
   * @protected
   * @type {SearchFilterConfig[]}
   * @memberof QueryConditionGroupComponent
   */
  protected searchFilterConfigs: SearchFilterConfig[] = [];

  /**
   * Stores values of the selected default filter
   * in the first dropdown
   * @type {FacetValue[]}
   * @memberof QueryConditionGroupComponent
   */
  firstDefaultValues: FacetValue[] = [];

  /**
   * Search filter configurations that do have values
   * @type {SearchFilterConfig[]}
   * @memberof QueryConditionGroupComponent
   */
  secondColumnFilters: SearchFilterConfig[] = [];

  /**
   * Stores all the filters as key and
   * facet values of a filter as value
   * @type {Map<string, FacetValue[]>[]}
   */
  filterValuesMapArray: Map<string, FacetValue[]>[] = [];

  /**
   * Composed query for the group
   * Used to get the value of query in the parent level
   * @memberof QueryConditionGroupComponent
   */
  public searchOptQuery = '';

  isValueListLoading = false;

  isFilterListLoading = false;

  constructor(
    private locale: LocaleService,
    private formBuilder: FormBuilder,
    private rootFormGroup: FormGroupDirective,
    private searchService: SearchService,
    private chd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formGroup = (
      this.rootFormGroup.control.get('queryArray') as FormArray
    ).controls[this.formGroupName];
    this.getSearchFilterConfigs();
  }

  /**
   * The value for the current query group
   *
   * @readonly
   * @type {FormArray}
   * @memberof QueryConditionGroupComponent
   */
  get queryGroup(): FormArray {
    return this.formGroup.get('queryGroup') as FormArray;
  }

  filterFacetValues(idx: number): FacetValue[] {
    if (this.filterValuesMapArray[idx]) {
      return this.filterValuesMapArray[idx].get(
        this.queryGroup.get(idx + '.filter')?.value
      );
    } else {
      return [];
    }
  }

  /**
   * The aggregate value of the current query group,
   * including the disabled controls.
   *
   * @readonly
   * @protected
   * @type {FilterValue[]}
   * @memberof QueryConditionGroupComponent
   */
  protected get queryGroupValue(): FilterValue[] {
    return this.queryGroup.getRawValue();
  }

  /**
   * Gets the Facet Values for the default selected filter
   */
  getSearchFilterConfigs() {
    this.searchService
      .getConfig(null, this.configurationName)
      .pipe(getRemoteDataPayload())
      .subscribe((res: SearchFilterConfig[]) => {
        if (res) {
          this.searchFilterConfigs = res.map((entry) => {
            return Object.assign(entry, {
              pageSize: 10,
            });
          });
          const options: SearchOptions = new SearchOptions({
            configuration: this.configurationName,
          });
          let pageNr = 1;

          if (this.firstDefaultValues.length > 0) {
            pageNr = Math.ceil(this.firstDefaultValues.length / 10) + 1;
          }

          this.getFacetValues(
            this.firstDefaultFilter,
            pageNr,
            SearchValueMode.Default,
            null,
            options
          );
        }
      });
  }

  /**
   * On value selection of first dropdown :
   * Compose the query for the applied filters till this moment,
   * Get Facets to fill the filter dropdown and enables the next in line control
   */
  onDefaultValueSelect(selectedValue: FacetValue) {
    const defaultSearchfilter = [
      {
        values: [selectedValue], // selected value
        key: this.firstDefaultFilter, // default filter name
        operator: 'equals',
      },
    ];
    this.buildSearchQuery(defaultSearchfilter);
    this.calcSearchFilterConfigs();
    // enable the filter dropdown on the first selection
    this.enableFormControlOnSelectionChange(0, 'filter');
    // In case of changing the first dropdown value
    // filter and value of first row must be reset
    this.queryGroup.get(`0.filter`).setValue(null);
    this.queryGroup.get(`0.value`).setValue(null);
  }

  /**
   * Get facet values for the selected filter
   * @param searchFilter
   * @param idx
   */
  onFilterSelect(searchFilter: string, idx: number) {
    // set value of last dropdown to null, in case it has value
    // when the filter is changed also the value field should be emptied
    this.queryGroup.get(`${idx}.value`).setValue(null);
    const options: SearchOptions = new SearchOptions({
      configuration: this.configurationName,
      query: encodeURIComponent(this.searchOptQuery),
    });
    // get values for the selected filter
    this.getFacetValues(searchFilter, 1, SearchValueMode.Select, idx, options);
  }

  /**
   * Disable the last selected value
   * Compose the query for the applied filters till this moment
   * @param selectedValue
   * @param parentFilter
   * @param idx
   */
  onValueSelect(selectedValue: FacetValue, parentFilter: string, idx: number) {
    console.log(selectedValue);
    // disable last selected value for each of the keys that might have that value
    const appliedFilters = this.filterValuesMapArray.filter((x) =>
      x.get(parentFilter)
    );

    appliedFilters.forEach((filterMap) => {
      (
        filterMap
          .get(parentFilter)
          .find((x) => isEqual(x.value, selectedValue.value)) as any
      ).disable = true;
    });

    this.buildQueryBasedOnAppliedFilterConfigs();
  }

  private buildQueryBasedOnAppliedFilterConfigs() {
    const searchFilter: QueryBuilderSearchFilter[] = [
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
      const filterValues: FilterValue[] = this.queryGroupValue;
      const values = filterValues
        .filter((filter: FilterValue) => isEqual(filter.filter, config.name))
        .map((filter: FilterValue) => filter?.value);

      searchFilter.push({
        values: values, // searched value
        key: config.name, // filter name
        operator: 'equals',
      });

      this.buildSearchQuery(searchFilter);
    });
  }

  /**
   * Disable the last selected filter and value pair
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
    // calc filters for the upcoming row
    this.calcSearchFilterConfigs();
  }

  /**
   * initializes a new form group for a query statement
   * @returns {FormGroup}
   */
  private initFormArray(): FormGroup {
    return this.formBuilder.group({
      filter: this.formBuilder.control(
        { value: null, disabled: false },
        Validators.required
      ),
      value: this.formBuilder.control(
        { value: null, disabled: true },
        Validators.required
      ),
    });
  }

  /**
   * Delete a query statement and enable the filter option
   * @param index qyery statement index
   * @param selectedValue selected field control
   */
  deleteCondition(index: number, selectedValue: AbstractControl) {
    if (index > -1) {
      // remove the query statement
      this.queryGroup.removeAt(index);
      this.filterValuesMapArray.splice(index, 1);

      // enable controls if only one row is left
      if (isEqual(this.queryGroup.controls.length, 1)) {
        this.enableFormControlOnSelectionChange(0, 'filter');
        this.enableFormControlOnSelectionChange(0, 'value');
        this.calcSearchFilterConfigs();
      }

      this.buildQueryBasedOnAppliedFilterConfigs();
      // when a condition is deleted, the filter's selected value is enabled again
      this.calcValueSelection(selectedValue.value);
    }
  }

  /**
   * Increase the page and get more values if there are any
   * @param searchFilter
   * @param idx
   */
  onValuesScroll(searchFilter: string, idx: number) {
    const options: SearchOptions = new SearchOptions({
      configuration: this.configurationName,
    });

    this.getFacetValues(
      searchFilter,
      null,
      SearchValueMode.Scroll,
      idx,
      options
    );
  }

  /**
   * Get facet values for each configuration,
   * in order to display only the ones with data
   */
  private calcSearchFilterConfigs() {
    this.isFilterListLoading = true;
    this.secondColumnFilters = [];
    this.searchFilterConfigs.forEach((config: SearchFilterConfig) => {
      if (isEqual(config.name, this.firstDefaultFilter)) {
        return;
      }
      const searchOptions: SearchOptions = new SearchOptions({
        configuration: this.configurationName,
        query: encodeURIComponent(this.searchOptQuery),
      });

      this.searchService
        .getFacetValuesFor(config, 1, searchOptions)
        .pipe(getRemoteDataPayload())
        .subscribe((fv: FacetValues) => {
          if (fv && fv.page.length > 0) {
            if (this.secondColumnFilters.indexOf(config) < 0) {
              this.secondColumnFilters.push(config);
            }
          }

        });
    });
    this.isFilterListLoading = false;
    this.chd.detectChanges();
  }

  /**
   * Get facet values for given configs
   * @param searchFilter filter label applied per row
   * @param page page number
   * @param mode moment in which the data are needed
   * @param idx index of the row
   * @param searchOptions
   */
  private getFacetValues(
    searchFilter: string,
    page: number = 1,
    mode?: SearchValueMode,
    idx?: number,
    searchOptions?: SearchOptions
  ) {
    let calPage: number = page;
    this.isValueListLoading = true;
    if (
      mode &&
      isEqual(mode, SearchValueMode.Scroll) &&
      !isNull(idx) &&
      this.filterValuesMapArray[idx].get(searchFilter).length > 0
    ) {
      // calculate page
      calPage =
        Math.ceil(
          this.filterValuesMapArray[idx].get(searchFilter).length / 10
        ) + 1;
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

            if (isEqual(mode, SearchValueMode.Default)) {
              // fill the first values dropdown with data based on page number
              this.firstDefaultValues = this.firstDefaultValues.concat(
                ...filterValues
              );
            }

            if (this.filterValuesMapArray[idx] && !isNull(idx)) {
              // set data in the given index, if it exists
              this.filterValuesMapArray[idx].set(searchFilter, filterValues);
            } else if (!this.filterValuesMapArray[idx] && !isNull(idx)) {
              // push new data for selected filter
              const map = new Map<string, FacetValue[]>();
              this.filterValuesMapArray.push(
                map.set(searchFilter, filterValues)
              );
            } else if (
              calPage > 1 &&
              idx &&
              this.filterValuesMapArray[idx].has(searchFilter)
            ) {
              // concat data from the next page, if there are any data
              const existingValues =
                this.filterValuesMapArray[idx].get(searchFilter);

              if (isEqual(searchFilter, this.firstDefaultFilter)) {
                this.firstDefaultValues = [...existingValues, ...filterValues];
              }

              this.filterValuesMapArray[idx].set(searchFilter, [
                ...existingValues,
                ...filterValues,
              ]);
            }

            this.isValueListLoading = false;
          } else if (res && isEqual(res.page?.length, 0)) {
            this.isValueListLoading = false;
          }
          if (!isNil(idx)) {
            this.enableFormControlOnSelectionChange(idx, 'value');
          }
          this.chd.detectChanges();
        });
    }
  }

  /**
   * Enable the disabled dropdowns
   * @param idx
   * @param name
   */
  private enableFormControlOnSelectionChange(idx: number, name: string) {
    this.queryGroup.get(`${idx}.${name}`)?.enable();
    this.queryGroup.updateValueAndValidity();
  }

  private disableFormControlOnSelectionChange(idx: number, name: string) {
    this.queryGroup.get(`${idx}.${name}`).disable();
    this.queryGroup.updateValueAndValidity();
  }

  /**
   * Compose the query for the applied filters
   * @param filters applied filters
   * @returns
   */
  private buildSearchQuery(filters: QueryBuilderSearchFilter[]) {
    const queries = [];
    filters.forEach((filter) => {
      if (isNotEmpty(filter) && isNotEmpty(filter.values)) {
        filter.values.forEach((facetValue: FacetValue) => {
          const fieldWithLanguage = `${this.locale.getCurrentLanguageCode()}_${filter.key}`;
          const field = filter.key;
          const value = facetValue.value;
          let authorityQuery = '';
          if (facetValue.authorityKey) {
            // TODO use _authority when https://4science.atlassian.net/browse/DSC-625 it's fixed
            const authorityValue = facetValue.authorityKey;
            const valueWithAuthority = `${value}###${facetValue.authorityKey}`;
            authorityQuery = `${fieldWithLanguage}_keyword:"${valueWithAuthority}"` +
              ` OR ${field}_keyword:"${valueWithAuthority}"` +
              ` OR ${fieldWithLanguage}_authority:"${authorityValue}"` +
              ` OR ${field}_keyword:"${authorityValue}" OR `;
          }

          const query = `(${authorityQuery}${field}:"${value}" OR ${fieldWithLanguage}_keyword:"${value}" OR ${field}_keyword:"${value}")`;
          console.log(query);
          queries.push(query);
        });
      }
    });
    this.searchOptQuery = queries.join(' AND ');
    return encodeURIComponent(this.searchOptQuery);
  }

  /**
   * Calculate to enable/disable the values based on previous changes/selections
   * @param parentFilter selected filter in same row
   */
  calcValueSelection(parentFilter: string) {
    // calculate disabled previous selected values

    const appliedFilters = this.filterValuesMapArray.filter((x) =>
      x.get(parentFilter)
    );

    if (appliedFilters.length > 1) {
      for (const item of appliedFilters) {
        const element = item.get(parentFilter);
        element.forEach((val) => {
          // enable the ones that are not found in the form value
          (val as any).disable = this.queryGroupValue.find((f) => isEqual(val.value, f.value));
        });
      }
    }
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
  value: FacetValue;
}
