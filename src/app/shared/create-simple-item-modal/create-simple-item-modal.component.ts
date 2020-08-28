import { Component, EventEmitter, Input, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { SimpleItem } from './models/simple-item.model';

@Component({
  selector: 'ds-reate-simple-item-modal',
  styleUrls: ['./create-simple-item-modal.component.scss'],
  templateUrl: './create-simple-item-modal.component.html'
})
export class CreateSimpleItemModalComponent {

  @Input() vocabularyName: string;
  @Input() excludeListId: string[];
  @Input() excludeFilterName: string;
  @Input() formConfig: Observable<SubmissionFormModel>;
  @Input() processing: Observable<boolean>;
  @Input() searchConfiguration: string;
  @Input() hasSearch = true;
  @Input() scope: string;

  @Output() createItem: EventEmitter<SimpleItem> = new EventEmitter<SimpleItem>();
  @Output() addItems: EventEmitter<SimpleItem[]> = new EventEmitter<SimpleItem[]>();

  constructor(public activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.dismiss(false);
  }
}
