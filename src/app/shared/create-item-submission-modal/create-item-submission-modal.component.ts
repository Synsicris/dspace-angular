import { ItemDataService } from './../../core/data/item-data.service';
import { SubmissionService } from './../../submission/submission.service';
import { getPaginatedListPayload, getFirstCompletedRemoteData } from './../../core/shared/operators';
import { Collection } from './../../core/shared/collection.model';
import { CollectionDataService } from './../../core/data/collection-data.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChildren, QueryList } from '@angular/core';

import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import { FormBuilderService } from '../form/builder/form-builder.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { SubmissionFormsModel } from '../../core/config/models/config-submission-forms.model';
import { SubmissionFormsConfigService } from './../../core/config/submission-forms-config.service';
import { ConfigObject } from '../../core/config/models/config.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { FormService } from '../form/form.service';

@Component({
  selector: 'ds-create-item-submission-modal',
  templateUrl: './create-item-submission-modal.component.html',
  styleUrls: ['./create-item-submission-modal.component.scss']
})
export class CreateItemSubmissionModalComponent implements OnInit {

  @ViewChildren('formRef') formRef: any;

  /**
   * The item edit mode
   */
  @Input() entityType: string;

  /**
   * The item edit mode
   */
  @Input() collectionId: string;

  /**
   * The item edit mode
   */
  @Input() formName: string;

  /**
   * The form config
   * @type {SubmissionFormModel}
   */
  formConfig: SubmissionFormModel;

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

  collections: Collection[] = [];
  selectedCollection: Collection;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilderService: FormBuilderService,
    private collectionDataService: CollectionDataService,
    private submissionFormsConfigService: SubmissionFormsConfigService,
    private submissionService: SubmissionService,
    private formService: FormService,
    private itemService: ItemDataService
  ) {
  }

  /**
   * Initialize collection get information
   */
  ngOnInit(): void {
    this.getCollectionsFromEntityType();
  }

  getCollectionsFromEntityType() {
    this.collectionDataService.getAuthorizedCollectionByEntityType('', this.entityType)
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        getPaginatedListPayload()
      )
      .subscribe((collections: Collection[]) => {
        console.log(collections);
        this.collections = collections;
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
  submit(formData: Observable<any>): void {
    console.log(this.formRef);
    // this.submissionService.createSubmission()
    // let form = this.formRef.first();
    // formData.subscribe((form: any) => {
    //   this.submissionService.depositSubmission(form);
    // });
    // this.itemService.updateMultipleItemMetadata(null, false, this.formSectionName, formData).pipe(
    //   getFirstSucceededRemoteDataPayload()
    // );

    // formData.pipe(
    //   take(1),
    //   filter((isValid) => isValid),
    //   mergeMap(() => this.formService.getFormData(this.formId)),
    //   take(1),
    //   mergeMap((formData: MetadataMap) => {
    //     return 
    //   })
    //   ).subscribe((item: Item) => {
    //     this.itemUpdate.emit(item);
    //   })
  }

  /**
   * Retrieve form configuration and build form model
   */
  onSelect(collection: Collection) {
    this.selectedCollection = collection;
    const definition = collection.firstMetadataValue('cris.submission.definition');
    this.processing.next(true);
    this.submissionFormsConfigService.findByName(definition).pipe(
      getFirstCompletedRemoteData(),
      map((configData: RemoteData<ConfigObject>) => configData.payload),
    )
      .subscribe((config: SubmissionFormsModel) => {
        this.formModel = this.formBuilderService.modelFromConfiguration(
          null,
          config,
          '',
          collection.metadata,
          SubmissionScopeType.WorkspaceItem
        );
        this.processing.next(false);
      });
  }
}
