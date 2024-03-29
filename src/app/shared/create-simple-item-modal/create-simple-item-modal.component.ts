import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';

import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { SimpleItem } from './models/simple-item.model';

@Component({
  selector: 'ds-reate-simple-item-modal',
  styleUrls: ['./create-simple-item-modal.component.scss'],
  templateUrl: './create-simple-item-modal.component.html'
})
export class CreateSimpleItemModalComponent implements OnInit {

  /**
   * The list of id to exclude from search results
   * @type {string[]}
   */
  @Input() excludeListId: string[] = [];

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
   * Additional search query
   * @type {string}
   */
  @Input() query: string;

  /**
   * The collection scope used for authority
   * @type {string}
   */
  @Input() authorityScope: string;

  /**
   * The search scope
   * @type {string}
   */
  @Input() scope: string;

  /**
   * The i18n key of the info message to display
   */
  @Input() searchMessageInfoKey;

  /**
   * A boolean representing if start with search tab active
   * @type {boolean}
   */
  startWithSearch$ = new BehaviorSubject<boolean>(false);

  @Input()
  set startWithSearch(startWithSearch: boolean) {
    this.startWithSearch$.next(startWithSearch);
  }

  get startWithSearch(): boolean {
    return this.startWithSearch$.value;
  }

  /**
   * EventEmitter that will emit a SimpleItem object created
   */
  @Output() createItem: EventEmitter<SimpleItem> = new EventEmitter<SimpleItem>();

  /**
   * EventEmitter that will emit an array of SimpleItem object to add
   */
  @Output() addItems: EventEmitter<SimpleItem[]> = new EventEmitter<SimpleItem[]>();

  constructor(public activeModal: NgbActiveModal, private readonly location: Location) {
  }

  ngOnInit(): void {
    this.removeParamFromUrl();
  }

  /**
   * Close modal
   */
  closeModal() {
    this.removeParamFromUrl();
    this.activeModal.dismiss(false);
  }

  private removeParamFromUrl() {
    this.location.go(this.location.path().split('?')[0]);
  }
}
