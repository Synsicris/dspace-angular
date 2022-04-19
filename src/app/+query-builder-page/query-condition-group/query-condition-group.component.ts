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
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { isEqual } from 'lodash';
import { isNotNull, isNotUndefined } from 'src/app/shared/empty.util';

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

  @Input() configurationName: string = 'default';

  formGroup: FormGroup;

  searchFilterConfigs: SearchFilterConfig[] = [];

  firstDefaultFilter = 'itemtype';

  firstDefaultValues: FacetValue[] = [];

  secondColumnFilters: SearchFilterConfig[] = [];

  filterValuesMap: Map<string, FacetValue[]> = new Map<string, FacetValue[]>();

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
      .getConfig(null, this.configurationName)
      .pipe(getRemoteDataPayload())
      .subscribe((res: SearchFilterConfig[]) => {
        if (res) {
          this.searchFilterConfigs = res;
          this.getFacetValues(SearchValueMode.Default, this.firstDefaultFilter, 1);
        }
      });
  }

  /**
   * On value selection of first dropdown
   * @param selectedValue
   */
  onDefaultValueSelect(selectedValue) {
    // get facet values for each configuration,
    // in order not to display the ones with no data
    this.searchFilterConfigs.forEach((config) => {
      this.searchService
        .getFacetValuesFor(config, 1)
        .pipe(
          getRemoteDataPayload(),
          map((c: FacetValues) => {
            if (c && c.page.length > 0) {
              this.secondColumnFilters.push(config);
              // enable the filter dropdown on the first selection
              this.enableFormControlOnSelectionChange(0, 'filter');
              // disable the selected value
              (this.filterValuesMap
                  .get(this.firstDefaultFilter)
                  .find((x) => isEqual(x.value, selectedValue)) as any ).disable = true;
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
    this.getFacetValues(SearchValueMode.Select, searchFilter, 1, idx);
  }

  /**
   * disable the last selected value
   * @param selectedValue
   * @param parentFilter
   */
  onValueSelect(selectedValue: string, parentFilter: string) {
    (
      this.filterValuesMap
        .get(parentFilter)
        .find((x) => x.value == selectedValue) as any
    ).disable = true;
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
  deleteCondition(index: number, selectedValue: AbstractControl) {
    if (index > -1) {
      // when a condition is deleted, the filter's selected value is enabled again
      (
        this.filterValuesMap
          .get(this.queryGroup.value[index].filter)
          .find((x) => x.value == selectedValue.value) as any
      ).disable = false;

      // remove the query statement
      this.queryGroup.removeAt(index);
    }
  }

  onFirstDropdownOpen(filterLabel: string, defaultOpeningMode: string) {
    this.calculateSearchValuesSelection(filterLabel, defaultOpeningMode);
  }

  /**
   * on open facet values dropdown ,
   * calculate the values selection (enable & disable)
   * @param filterLabel
   * @param defaultOpeningMode
   */
  calculateSearchValuesSelection(
    filterLabel: string,
    defaultOpeningMode?: string
  ) {
    // calc disabled fields for first default values
    let disabledValues = this.filterValuesMap
      .get(this.firstDefaultFilter)
      .filter((x: any) => x.disable);

    if (
      isEqual(defaultOpeningMode, SearchValueMode.Default) &&
      this.formGroup.get(filterLabel).value
    ) {
      this.firstDefaultValues.forEach((x) => {
        if (disabledValues.some((v) => v.value == x.value)) {
          (x as any).disable = true;
        }
      });
    } else if (!defaultOpeningMode) {
      disabledValues.forEach((x) => {
        if (
          !this.queryGroup.value.find((f) => f.value == x.value) &&
          !isEqual(x.value, this.formGroup.get('defaultFilter').value)
        ) {
          (
            this.filterValuesMap
              .get(filterLabel)
              .find((v) => v.value == x.value) as any
          ).disable = false;
        }
      });
    }
  }

  onValuesScroll(searchFilter: string, idx: number) {
    this.getFacetValues(SearchValueMode.Scroll, searchFilter, idx);
  }

  searchValue(event: NgSearchEvent, filter: string, idx: number) {
    console.log(event);
    const searchOptions: SearchOptions = new SearchOptions({
      configuration: this.configurationName,
      filters: [
        {
          values: [event.term], // searched value
          key: `f.${filter}`, // filter name
          operator: 'contains',
        },
      ],
    });

    this.getFacetValues(SearchValueMode.Search, filter, 1, idx, searchOptions);
  }

  private getFacetValues(
    mode: SearchValueMode,
    searchFilter: string,
    page: number = 1,
    idx?: number,
    searchOptions?: SearchOptions
  ) {
    let calPage: number = page;
    if (
      isEqual(mode, SearchValueMode.Scroll) &&
      this.filterValuesMap.get(searchFilter).length > 0
    ) {
      // calculate page
      calPage = this.filterValuesMap.get(searchFilter).length / 10 + 1;
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
              // in order not to change reference of the key to filterValuesMap
              this.filterValuesMap.set(searchFilter, filterValues);
              if (mode == SearchValueMode.Default) {
                // fill the first values dropdown with data
                this.firstDefaultValues = filterValues;
              }
            } else if (calPage > 1 && this.filterValuesMap.has(searchFilter)) {
              // concat data from the next page, if there are any data
              let existingValues = this.filterValuesMap.get(searchFilter);
              this.filterValuesMap.set(searchFilter, [
                ...filterValues,
                ...existingValues,
              ]);
            }

            if (isNotNull(idx) && isNotUndefined(idx)) {
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
    if (this.queryGroup.get(`${idx}.${name}`).value) {
      this.queryGroup.get(`${idx}.${name}`).setValue(null);
    } else {
      this.queryGroup.get(`${idx}.${name}`).enable();
    }
    this.queryGroup.updateValueAndValidity();
  }
}

export enum SearchValueMode {
  Default = 'Default',
  Scroll = 'Scroll',
  Search = 'Search',
  Select = 'Select'
}

export interface NgSearchEvent {
  term: string;
  items: any[];
}
