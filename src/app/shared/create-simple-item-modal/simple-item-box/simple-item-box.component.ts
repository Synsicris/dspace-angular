import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, map } from 'rxjs/operators';

import { hasValue, isNull } from '../../empty.util';
import { SimpleItem } from '../models/simple-item.model';
import { Metadata } from '../../../core/shared/metadata.utils';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntry } from '../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyService } from '../../../core/submission/vocabularies/vocabulary.service';

@Component({
  selector: 'ds-simple-item-box',
  styleUrls: ['./simple-item-box.component.scss'],
  templateUrl: './simple-item-box.component.html'
})
export class SimpleItemBoxComponent implements OnInit, OnDestroy {

  @Input() public vocabularyName: string;
  @Input() public data: SimpleItem;

  public hasFocus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public selectStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public title: string;
  public type$: Observable<string>;
  public vocabularyOptions: VocabularyOptions;

  private subs: Subscription[] = [];

  @Output() public selected: EventEmitter<SimpleItem> = new EventEmitter();
  @Output() public deselected: EventEmitter<SimpleItem> = new EventEmitter();

  constructor(private vocabularyService: VocabularyService) {

  }

  ngOnInit(): void {
    this.title = Metadata.firstValue(this.data.metadata, 'dc.title');
    this.vocabularyOptions = new VocabularyOptions(this.vocabularyName);
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

    return this.vocabularyService.getVocabularyEntryByValue(itemType, this.vocabularyOptions).pipe(
      map((result: VocabularyEntry) => {
        if (isNull(result)) {
          throw new Error(`No task type found for ${itemType}`);
        }

        return result.display;
      }),
      catchError((error: Error) => observableOf(''))
    )
  }
}
