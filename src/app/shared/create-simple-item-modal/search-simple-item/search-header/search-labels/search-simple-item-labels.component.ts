import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { FilterBox } from '../filter-box/search-simple-item-filter-box.component';

@Component({
  selector: 'ds-search-simple-item-labels',
  styleUrls: ['./search-simple-item-labels.component.scss'],
  templateUrl: './search-simple-item-labels.component.html',
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchSimpleItemLabelsComponent {

  /**
   * Emits the currently active filters
   */
  @Input() filterBoxList: Observable<FilterBox[]>;

  /**
   * A map to keep track of the label retrieved by vocabulary
   */
  public facetLabelMap: Map<string, string> = new Map<string, string>();

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

  /**
   * Prevent unnecessary rendering
   */
  trackUpdate(index, item: any) {
    return item
  }
}
