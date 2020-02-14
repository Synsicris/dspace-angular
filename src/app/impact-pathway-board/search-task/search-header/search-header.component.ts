import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImpactPathwayStep } from '../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayTask } from '../../../core/impact-pathway/models/impact-pathway-task.model';
import { SearchFilterConfig } from '../../../shared/search/search-filter-config.model';
import { FacetValue } from '../../../shared/search/facet-value.model';
import { FilterBox } from './filter-box/filter-box.component';

@Component({
  selector: 'ipw-search-header',
  styleUrls: ['./search-header.component.scss'],
  templateUrl: './search-header.component.html'
})
export class SearchHeaderComponent {

  /**
   * Emits the currently active filters
   */
  @Input() filterBoxList: Observable<FilterBox[]>;

  /**
   * Emits the currently active filters
   */
  @Input() availableTaskList: Observable<ImpactPathwayTask[]>;
  @Input() filterBoxEntries: FacetValue[];
  @Input() filterConfig: SearchFilterConfig;
  @Input() step: ImpactPathwayStep;

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
