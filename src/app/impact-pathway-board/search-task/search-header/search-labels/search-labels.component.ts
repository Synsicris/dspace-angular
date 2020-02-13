import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FilterBox } from '../filter-box/filter-box.component';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'ipw-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent {

  /**
   * Emits the currently active filters
   */
  @Input() filterBoxList: Observable<FilterBox[]>;

  /**
   * Emits FilterBox
   * @type {EventEmitter<string>}
   */
  @Output() removeFilter: EventEmitter<FilterBox> = new EventEmitter();

  remove(filterBox: FilterBox, index: number) {
    const appliedFilterBoxEntries = [...filterBox.appliedFilterBoxEntries];
    appliedFilterBoxEntries.splice(index, 1);
    const removeFilterBox = Object.assign(filterBox, {
      appliedFilterBoxEntries: appliedFilterBoxEntries
    });
    this.removeFilter.emit(removeFilterBox);
  }
}
