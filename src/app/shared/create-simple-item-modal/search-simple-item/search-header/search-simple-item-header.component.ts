import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImpactPathwayTask } from '../../../../core/impact-pathway/models/impact-pathway-task.model';
import { SearchFilterConfig } from '../../../search/search-filter-config.model';
import { FacetValue } from '../../../search/facet-value.model';
import { FilterBox } from './filter-box/search-simple-item-filter-box.component';
import { SimpleItem } from '../../models/simple-item.model';

@Component({
  selector: 'ds-search-simple-item-header',
  styleUrls: ['./search-simple-item-header.component.scss'],
  templateUrl: './search-simple-item-header.component.html'
})
export class SearchSimpleItemHeaderComponent {

  /**
   * The vocabulary name used for authority filter
   */
  @Input() vocabularyName: string;

  /**
   * Emits the currently active filters
   */
  @Input() filterBoxList: Observable<FilterBox[]>;

  /**
   * Emits the currently active filters
   */
  @Input() availableTaskList: Observable<SimpleItem[]>;

  /**
   * The list of filter entries value
   */
  @Input() filterBoxEntries: FacetValue[];

  /**
   * The filter configuration object
   */
  @Input() filterConfig: SearchFilterConfig;

  /**
   * Emits FilterBoxValue when the form is submitted
   * @type {EventEmitter<FilterBox>}
   */
  @Output() filterChange: EventEmitter<FilterBox> = new EventEmitter();

  /**
   * Emits FilterBox
   * @type {EventEmitter<string>}
   */
  @Output() removeFilter: EventEmitter<FilterBox> = new EventEmitter();

  /**
   * Emits term when a search is triggered
   * @type {EventEmitter<FilterBox>}
   */
  @Output() searchChange: EventEmitter<FilterBox> = new EventEmitter<FilterBox>();

  getFilterBoxListByType(type: any): Observable<FilterBox[]> {
    return this.filterBoxList.pipe(
      map((list: FilterBox[]) => list
        .filter((filterBox: FilterBox) => filterBox.filterType === type))
    )
  }

  onFilterChange(value: FilterBox) {
    this.filterChange.emit(value);
  }

  onRemoveFilter(value: FilterBox) {
    this.removeFilter.emit(value);
  }

  onSearchChange(event: FilterBox) {
    this.searchChange.emit(event);
  }
}
