import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SearchTaskService } from '../search-task.service';

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
  @Input() appliedFilters: BehaviorSubject<Map<string, any[]>>;

  /**
   * Emits string when the form is submitted
   * @type {EventEmitter<string>}
   */
  @Output() removeFilter: EventEmitter<string> = new EventEmitter();

  /**
   * Initialize the instance variable
   */
  constructor(private searchTaskService: SearchTaskService) {
  }

  remove(key: string, value: any) {
    this.searchTaskService.removeFilterValue(this.appliedFilters, key, value);
    this.removeFilter.emit(key);
  }
}
