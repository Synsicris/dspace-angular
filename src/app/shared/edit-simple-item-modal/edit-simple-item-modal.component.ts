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
import { DynamicRowGroupModel } from '../form/builder/ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';

@Component({
  selector: 'ds-edit-simple-item-modal',
  templateUrl: './edit-simple-item-modal.component.html',
  styleUrls: ['./edit-simple-item-modal.component.scss']
})
export class EditSimpleItemModalComponent implements OnInit {

  /**
   * The item edit mode
   */
  @Input() editMode: string;

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  @Input() formConfig: Observable<SubmissionFormModel>;

  /**
   * The item's id related to the edit form
   */
  @Input() itemId: string;

  /**
   * The path to metadata section to patch
   */
  @Input() formSectionName: string;

  /**
   * EventEmitter that will emit the updated item
   */
  @Output() itemUpdate: EventEmitter<Item> = new EventEmitter<Item>();

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

  /**
   * List of form data on initialization
   * @type {MetadataMap}
   */
  protected allFormData: MetadataMap;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilderService: FormBuilderService,
    private formService: FormService,
    private itemService: ItemDataService
  ) {
  }

  /**
   * Initialize all instance variables and init form
   */
  ngOnInit(): void {
    this.formId = this.formService.getUniqueId('edit-simple-item');
    this.initFormModel();
    this.formService.getFormData(this.formId).pipe(take(1)).subscribe((formData: MetadataMap) => {
      this.allFormData = formData;
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
    this.subs.push(this.formService.isValid(this.formId).pipe(
      take(1),
      filter((isValid) => isValid),
      mergeMap(() => this.formService.getFormData(this.formId)),
      take(1),
      mergeMap((formData: MetadataMap) => {
        return this.itemService.updateMultipleItemMetadata(this.itemId, this.editMode, this.formSectionName, this.parsedFormData(formData)).pipe(
          getFirstSucceededRemoteDataPayload()
        );
      })
    ).subscribe((item: Item) => {
      this.itemUpdate.emit(item);
    })
    );
  }

  /**
   * Retrieve form configuration and build form model
   */
  private initFormModel() {
    const item$: Observable<Item> = this.itemService.findById(this.itemId).pipe(
      getFirstSucceededRemoteDataPayload()
    );
    observableCombineLatest([item$, this.formConfig])
      .subscribe(([item, formConfig]: [Item, SubmissionFormsModel]) => {
        this.formModel = this.formBuilderService.modelFromConfiguration(
          null,
          formConfig,
          '',
          item.metadata,
          SubmissionScopeType.WorkspaceItem
        );
      });
  }

  /**
   * Check if information is missing from formModel, so we can clear it.
   */
  private parsedFormData(formData): MetadataMap {
    if (this.formModel.length > Object.keys(formData).length) {
      this.formModel.forEach((model: DynamicRowGroupModel) => {
        if (Object.keys(formData).indexOf(model.group[0].name) === -1) {
          const addFormData: any = this.allFormData[model.group[0].name];
          formData = Object.assign({}, formData, { [model.group[0].name]: [Object.assign({}, addFormData[0], { value: null }) as FormFieldMetadataValueObject] });
        }
      });
    }
    return formData;
  }
}
