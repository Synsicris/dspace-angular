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

  /**
   * The vocabulary name to use retrieve search filter labels
   * @type {string}
   */
  @Input() vocabularyName: string;

  /**
   * The list of id to exclude from search results
   * @type {string[]}
   */
  @Input() excludeListId: string[];

  /**
   * The name of the filter used to exclude results from a search
   * @type {string[]}
   */
  @Input() excludeFilterName: string;

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  @Input() formConfig: Observable<SubmissionFormModel>;

  /**
   * The form config name
   * @type {string}
   */
  @Input() formHeader: string;

  /**
   * A boolean representing if an operation is processing
   * @type {Observable<boolean>}
   */
  @Input() processing: Observable<boolean>;

  /**
   * The search config name
   * @type {string}
   */
  @Input() searchConfiguration: string;

  /**
   * A boolean representing if to show the search tab
   * @type {boolean}
   */
  @Input() hasSearch = true;

  /**
   * The search scope
   * @type {string}
   */
  @Input() scope: string;

  /**
   * EventEmitter that will emit a SimpleItem object created
   */
  @Output() createItem: EventEmitter<SimpleItem> = new EventEmitter<SimpleItem>();

  /**
   * EventEmitter that will emit an array of SimpleItem object to add
   */
  @Output() addItems: EventEmitter<SimpleItem[]> = new EventEmitter<SimpleItem[]>();

  constructor(public activeModal: NgbActiveModal) {
  }

  /**
   * Close modal
   */
  closeModal() {
    this.activeModal.dismiss(false);
  }
}
