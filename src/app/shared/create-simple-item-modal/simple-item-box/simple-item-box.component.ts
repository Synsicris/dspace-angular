import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, map, take } from 'rxjs/operators';

import { hasValue } from '../../empty.util';
import { SimpleItem } from '../models/simple-item.model';
import { Metadata } from '../../../core/shared/metadata.utils';
import { Observable } from 'rxjs/internal/Observable';
import { IntegrationSearchOptions } from '../../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../../core/integration/integration-data';
import { AuthorityEntry } from '../../../core/integration/models/authority-entry.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { AuthorityService } from '../../../core/integration/authority.service';

@Component({
  selector: 'ds-simple-item-box',
  styleUrls: ['./simple-item-box.component.scss'],
  templateUrl: './simple-item-box.component.html'
})
export class SimpleItemBoxComponent implements OnInit, OnDestroy {

  @Input() public authorityName: string;
  @Input() public data: SimpleItem;

  public hasFocus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public selectStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public title: string;
  public type$: Observable<string>;

  private subs: Subscription[] = [];

  @Output() public selected: EventEmitter<SimpleItem> = new EventEmitter();
  @Output() public deselected: EventEmitter<SimpleItem> = new EventEmitter();

  constructor(private authorityService: AuthorityService) {

  }

  ngOnInit(): void {
    this.title = Metadata.firstValue(this.data.metadata, 'dc.title');
    this.type$ = this.getItemType();

    this.subs.push(this.selectStatus.pipe(
      distinctUntilChanged())
      .subscribe((status: boolean) => {
        if (status) {
          this.selected.emit(this.data);
          this.hasFocus$.next(true);
        } else {
          this.deselected.emit(this.data);
          this.hasFocus$.next(false);
        }
      })
    );
  }

  public setFocus(event): void {
    if (this.selectStatus.value) {
      this.selectStatus.next(false);
    } else {
      this.selectStatus.next(true);
    }
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  getItemType(): Observable<string> {
    const itemType = this.data.type.value;
    const searchOptions: IntegrationSearchOptions = new IntegrationSearchOptions(
      '',
      this.authorityName,
      'relationship.type',
      itemType,
      1,
      1);

    return this.authorityService.getEntryByValue(searchOptions).pipe(
      take(1),
      map((result: IntegrationData) => {
        if (result.pageInfo.totalElements !== 1) {
          throw new Error(`No task type found for ${itemType}`);
        }

        return (result.payload[0] as AuthorityEntry).display;
      }),
      catchError((error: Error) => observableOf(''))
    )
  }
}
