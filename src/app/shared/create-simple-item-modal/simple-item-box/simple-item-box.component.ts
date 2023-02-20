import { ItemDetailPageModalComponent } from '../../../item-detail-page-modal/item-detail-page-modal.component';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { hasValue, isNotEmpty } from '../../empty.util';
import { SimpleItem } from '../models/simple-item.model';
import { Metadata } from '../../../core/shared/metadata.utils';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-simple-item-box',
  styleUrls: ['./simple-item-box.component.scss'],
  templateUrl: './simple-item-box.component.html'
})
export class SimpleItemBoxComponent implements OnInit, OnDestroy {

  @Input() public vocabularyName: string;
  @Input() public data: SimpleItem;
  @Input() public selectedStatus: boolean;

  public hasFocus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public selectStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public title: string;
  public vocabularyOptions: VocabularyOptions;

  private subs: Subscription[] = [];

  @Output() public selected: EventEmitter<SimpleItem> = new EventEmitter();
  @Output() public deselected: EventEmitter<SimpleItem> = new EventEmitter();

  constructor(
    private modalService: NgbModal) {

  }

  ngAfterContentInit() {
    if (isNotEmpty(this.selectedStatus)) {
      this.selectStatus.next(this.selectedStatus);
    }
  }

  ngOnInit(): void {
    this.title = Metadata.firstValue(this.data.metadata, 'dc.title');
    this.vocabularyOptions = new VocabularyOptions(this.vocabularyName);

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

  openItemModal() {
    const modalRef = this.modalService.open(ItemDetailPageModalComponent, { size: 'xl' });
    (modalRef.componentInstance as any).uuid = this.data.id;
    (modalRef.componentInstance as any).modalRef = modalRef;
  }

}
