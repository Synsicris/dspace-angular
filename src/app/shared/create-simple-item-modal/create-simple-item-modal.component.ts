import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { SimpleItem } from './models/simple-item.model';

@Component({
  selector: 'ds-reate-simple-item-modal',
  styleUrls: ['./create-simple-item-modal.component.scss'],
  templateUrl: './create-simple-item-modal.component.html'
})
export class CreateSimpleItemModalComponent implements OnInit {

  /**
   * The vocabulary name to use retrieve search filter labels
   * @type {string}
   */
  @Input() vocabularyName: string;

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

  constructor(public activeModal: NgbActiveModal, private route: ActivatedRoute, private router: Router) {
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
    const queryParams = {};

    this.router.navigate([], { queryParams, replaceUrl: true, relativeTo: this.route });
  }
}
