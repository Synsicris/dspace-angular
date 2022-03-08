import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'ds-item-versions-summary-modal',
  templateUrl: './item-versions-summary-modal.component.html',
  styleUrls: ['./item-versions-summary-modal.component.scss']
})
export class ItemVersionsSummaryModalComponent {

  versionNumber: number;
  newVersionSummary: string;
  firstVersion = true;

  processing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() createVersionEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    protected activeModal: NgbActiveModal,
  ) {
  }

  onModalClose() {
    this.activeModal.dismiss();
  }

  onModalSubmit() {
    this.processing$.next(true);
    this.createVersionEvent.emit(this.newVersionSummary);
  }

}
