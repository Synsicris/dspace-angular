import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { findIndex, uniqueId } from 'lodash';

import { FacetValue } from '../../../../search/facet-value.model';
import { SearchFilterConfig } from '../../../../search/search-filter-config.model';

/**
 * Enumeration containing all possible types for filters
 */
export enum FilterBoxType {
  /**
   * Represents authority facets
   */
  search = 'search',

  /**
   * Represents simple text facets
   */
  filter = 'filter',
}

export interface FilterBoxEntry {
  value: string;
  label: string;
}

export interface FilterBox {
  filterName: string;
  filterType: FilterBoxType;
  filterConfig: SearchFilterConfig;
  filterFacetValues: FacetValue[]
  appliedFilterBoxEntries: FilterBoxEntry[];
}

@Component({
  selector: 'ds-search-simple-item-filter-box',
  styleUrls: ['./search-simple-item-filter-box.component.scss'],
  templateUrl: './search-simple-item-filter-box.component.html'
})
export class SearchSimpleItemFilterBoxComponent implements OnChanges, OnInit {

  @Input() filterBox: FilterBox;
  @Input() filterFacetValues: FacetValue[];
  @Input() appliedFilterBoxEntries: FilterBoxEntry[];

  /**
   * Emits FilterBox when the form is submitted
   * @type {EventEmitter<FilterBox>}
   */
  @Output() filterChange: EventEmitter<FilterBox> = new EventEmitter();

  public filterId: string = uniqueId();
  public filterName: string;
  public innerFilterFacetValues: FacetValue[];

  private selectedFilterBoxEntries: FilterBoxEntry[] = [];

  constructor(private dropdownConfig: NgbDropdownConfig) {
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appliedFilterBoxEntries && (changes.appliedFilterBoxEntries.isFirstChange() ||
      (changes.appliedFilterBoxEntries.currentValue !== changes.appliedFilterBoxEntries.previousValue))) {
      this.selectedFilterBoxEntries = [...this.appliedFilterBoxEntries];
    }
    if (changes.filterFacetValues && (changes.filterFacetValues.isFirstChange() ||
      (changes.filterFacetValues.currentValue !== changes.filterFacetValues.previousValue))) {
      this.innerFilterFacetValues = [...this.filterFacetValues];
    }
  }

  ngOnInit(): void {
    this.filterName = this.filterBox.filterName;
  }

  isChecked(filterValue: string): boolean {
    const index: number = findIndex(this.appliedFilterBoxEntries, { value: filterValue });
    return index !== -1;
  }

  onChecked(event: Event, selected: FacetValue) {
    const checkbox: any = event.target;
    if (checkbox.checked) {
      this.selectedFilterBoxEntries.push({ label: selected.label, value: this.getFacetValue(selected) });
    } else {
      const index: number = findIndex(this.selectedFilterBoxEntries, { value: this.getFacetValue(selected) });
      if (index !== -1) {
        this.selectedFilterBoxEntries.splice(index, 1);
      }
    }
  }

  onSubmit(dropdown: NgbDropdown) {
    dropdown.close();
    const filterBox = Object.assign(this.filterBox, {
      appliedFilterBoxEntries: this.selectedFilterBoxEntries
    });

    this.filterChange.emit(filterBox);
  }

  protected getFacetValue(facet: FacetValue): string {
    const search = facet._links.search.href;
    const hashes = search.slice(search.indexOf('?') + 1).split('&');
    const params = {};
    hashes.map((hash) => {
      const [key, val] = hash.split('=');
      params[key] = decodeURIComponent(val).replace(/(,.*)/, '');
    });

    return params[this.filterBox.filterConfig.paramName];
  }

}
