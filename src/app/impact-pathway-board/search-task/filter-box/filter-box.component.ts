import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { uniqueId } from 'lodash';

import { SearchTaskService } from '../search-task.service';
import { isNotUndefined } from '../../../shared/empty.util';

export interface FilterBoxEntry {
  value: string;
  label: string;
}

export interface FilterBox {
  filterType: string;
  filterValue: any[];
}

@Component({
  selector: 'ipw-search-filter-box',
  styleUrls: ['./filter-box.component.scss'],
  templateUrl: './filter-box.component.html'
})
export class FilterBoxComponent implements OnInit {

  /**
   * Emits the currently active filters
   */
  @Input() appliedFilters: BehaviorSubject<Map<string, any[]>>;
  @Input() filterType: string;
  @Input() filterBoxEntries: FilterBoxEntry[];

  /**
   * Emits FilterBoxValue when the form is submitted
   * @type {EventEmitter<FilterBox>}
   */
  @Output() submitForm: EventEmitter<string> = new EventEmitter();

  public innerFilterBoxEntries: FilterBoxEntry[];
  public filterId: string = uniqueId();

  private selectedCheckbox: any[] = [];

  constructor(private dropdownConfig: NgbDropdownConfig, private searchTaskService: SearchTaskService) {
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  ngOnInit(): void {
    this.innerFilterBoxEntries = this.filterBoxEntries;
  }

  isChecked(filterValue): Observable<boolean> {
    return this.appliedFilters.pipe(
      map((appliedFilters: Map<string, any[]>) => appliedFilters.get(this.filterType)),
      filter((filterValues: any[]) => isNotUndefined(filterValues)),
      map((filterValues: any[]) => filterValues.includes(filterValue)),
      startWith(false),
      distinctUntilChanged()
    )
  }

  onChecked(event: Event) {
    const checkbox: any = event.target;
    if (checkbox.checked) {
      this.selectedCheckbox.push(checkbox.value);
    } else {
      const index: number = this.selectedCheckbox.indexOf(checkbox.value);
      if (index !== -1) {
        this.selectedCheckbox.splice(index, 1);
      }
    }
  }

  onSubmit(dropdown: NgbDropdown) {
    dropdown.close();
    this.searchTaskService.addFilterValue(this.appliedFilters, this.filterType, this.selectedCheckbox);
    this.submitForm.emit(this.filterType);
  }

  onOpenChange(isOpen) {
    if (isOpen) {
      this.selectedCheckbox = Array.from([]);
    }
  }
}
