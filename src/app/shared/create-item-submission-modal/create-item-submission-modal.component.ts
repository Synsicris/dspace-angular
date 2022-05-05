import { CollectionDataService } from './../../core/data/collection-data.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { filter, mergeMap, take } from 'rxjs/operators';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import { FormService } from '../form/form.service';
import { FormBuilderService } from '../form/builder/form-builder.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { Item } from '../../core/shared/item.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { SubmissionFormsModel } from '../../core/config/models/config-submission-forms.model';
import { MetadataMap } from '../../core/shared/metadata.models';

@Component({
  selector: 'ds-create-item-submission-modal',
  templateUrl: './create-item-submission-modal.component.html',
  styleUrls: ['./create-item-submission-modal.component.scss']
})
export class CreateItemSubmissionModalComponent implements OnInit {

  /**
   * The item edit mode
   */
  @Input() entityType: string;

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  formConfig: Observable<SubmissionFormModel>;

  /**
   * A boolean that indicate if to display form's submit and cancel buttons
   */
  public displaySubmit = true;

  /**
   * The form id
   */
  public formId: string;

  /**
   * The form layout
   */
  public formLayout;

  /**
   * The form model
   */
  public formModel: DynamicFormControlModel[];

  /**
   * A boolean representing if an operation is processing
   * @type {BehaviorSubject<boolean>}
   */
  processing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilderService: FormBuilderService,
    private formService: FormService,
    private itemService: ItemDataService,
    private collectionDataService: CollectionDataService
  ) {
  }

  /**
   * Initialize all instance variables and init form
   */
  ngOnInit(): void {
    // this.formId = this.formService.getUniqueId('create-item-submission');
    // this.initFormModel();
    this.getInfo();
  }

  getInfo() {
    this.collectionDataService.getAuthorizedCollectionByEntityType('', this.entityType).subscribe((res) => {
      console.log(res);
    });
  }

  /**
   * Close modal
   */
  closeModal() {
    this.activeModal.dismiss(false);
  }

  /**
   * Patch item with data retrieved from the form
   */
  editTask(): void {
    this.processing.next(true);
    // this.subs.push(this.formService.isValid(this.formId).pipe(
    //   take(1),
    //   filter((isValid) => isValid),
    //   mergeMap(() => this.formService.getFormData(this.formId)),
    //   take(1),
    //   mergeMap((formData: MetadataMap) => {
    //     return this.itemService.updateMultipleItemMetadata(this.itemId, this.editMode, this.formSectionName, formData).pipe(
    //       getFirstSucceededRemoteDataPayload()
    //     );
    //   })
    // ).subscribe((item: Item) => {
    //   this.itemUpdate.emit(item);
    // })
    // );
  }

  /**
   * Retrieve form configuration and build form model
   */
  private initFormModel() {
    //   const item$: Observable<Item> = this.itemService.findById(this.itemId).pipe(
    //     getFirstSucceededRemoteDataPayload()
    //   );
    //   observableCombineLatest([item$, this.formConfig])
    //     .subscribe(([item, formConfig]: [Item, SubmissionFormsModel]) => {
    //       this.formModel = this.formBuilderService.modelFromConfiguration(
    //         null,
    //         formConfig,
    //         '',
    //         item.metadata,
    //         SubmissionScopeType.WorkspaceItem
    //       );
    //     });
  }
}
