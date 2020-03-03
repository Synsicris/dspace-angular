import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, merge, switchMap, tap } from 'rxjs/operators';
import { NgbDropdownConfig, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayStep } from '../../../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../../../../core/impact-pathway/impact-pathway.service';
import { ImpactPathwayTask } from '../../../../../core/impact-pathway/models/impact-pathway-task.model';
import { isNotNull } from '../../../../empty.util';
import { FilterBox } from '../filter-box/search-simple-item-filter-box.component';

@Component({
  selector: 'ds-search-simple-item-box',
  styleUrls: ['./search-simple-item-box.component.scss'],
  templateUrl: './search-simple-item-box.component.html'
})
export class SearchSimpleItemBoxComponent {

  /**
   * Emits the available tasks
   */
  @Input() availableTaskList: Observable<ImpactPathwayTask[]>;

  @Input() filterBox: FilterBox;

  /**
   * The related impact pathway step
   */
  @Input() step: ImpactPathwayStep;

  public searchModel: string;
  public searching: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private hideSearchingWhenUnsubscribed$ = new Observable(() => () => this.searching.next(false));

  /**
   * Emits term when a search is triggered
   * @type {EventEmitter<FilterBox>}
   */
  @Output() searchChange: EventEmitter<FilterBox> = new EventEmitter<FilterBox>();

  constructor(
    private service: ImpactPathwayService,
    private typeaheadConfig: NgbTypeaheadConfig,
    private dropdownConfig: NgbDropdownConfig
  ) {

    // customize default values of typeaheads used by this component tree
    typeaheadConfig.showHint = true;
    // customize default values of dropdowns used by this component tree
    dropdownConfig.autoClose = false;
  }

  formatter = (x: ImpactPathwayTask) => {
    return (typeof x === 'object') ? x.title : x
  };

  search = (text$: Observable<string>) =>
    text$.pipe(
      tap(() => this.searching.next(true)),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.length < 3) {
          return observableOf([]);
        } else {
          return this.availableTaskList.pipe(
            map((list) => list
              .filter((task: ImpactPathwayTask) => {
                const regex = new RegExp('(?:^|\\W)' + term.toLocaleLowerCase() + '(?:$|\\W)', 'g');
                return isNotNull(task.title.toLowerCase().match(regex))
              })
            ),
          )
        }
      }),
      tap(() => this.searching.next(false)),
      merge(this.hideSearchingWhenUnsubscribed$)
    );

  onSearchChange(event: any) {
    event.stopImmediatePropagation();
    if (event.target && event.target.value) {
      const filterBox = Object.assign(this.filterBox, {
        appliedFilterBoxEntries: [{ label: event.target.value, value: event.target.value }]
      });
      this.searchChange.emit(filterBox);
    }

    this.searchModel = '';
  }

}
