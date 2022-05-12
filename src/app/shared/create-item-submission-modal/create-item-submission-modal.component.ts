import { SubmissionSectionError } from './../../submission/objects/submission-objects.reducer';
import { NotificationsService } from './../notifications/notifications.service';
import { SectionsService } from './../../submission/sections/sections.service';
import { MetadataMap } from './../../core/shared/metadata.models';
import { ProjectItemService } from './../../core/project/project-item.service';
import { SubmissionService } from './../../submission/submission.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from './../../core/shared/operators';
import { Collection } from './../../core/shared/collection.model';
import { CollectionDataService } from './../../core/data/collection-data.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

import { BehaviorSubject, Observable, combineLatest, of as observableOf } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SubmissionScopeType } from '../../core/submission/submission-scope-type';
import { FormBuilderService } from '../form/builder/form-builder.service';
import { SubmissionFormsModel } from '../../core/config/models/config-submission-forms.model';
import { SubmissionFormsConfigService } from './../../core/config/submission-forms-config.service';
import { ConfigObject } from '../../core/config/models/config.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { SubmissionObject, SubmissionObjectError } from 'src/app/core/submission/models/submission-object.model';
import { FormService } from '../form/form.service';
import { isNull } from 'lodash';
import { isUndefined } from '../empty.util';

@Component({
  selector: 'ds-create-item-submission-modal',
  templateUrl: './create-item-submission-modal.component.html',
  styleUrls: ['./create-item-submission-modal.component.scss']
})
export class CreateItemSubmissionModalComponent implements OnInit {

  /**
   * The entity type of the collection of the item
   */
  @Input() entityType: string;

  /**
   * The collection id that the new item will be created from
   */
  @Input() collectionId: string;

  /**
   * The submission section form name
   */
  @Input() formName: string;

  /**
   * Custom metadatas that wont be shown in the form but passed in the patch requests
   */
  @Input() customMetadata: MetadataMap = {};

  /**
   * A boolean that indicate if to display form's submit and cancel buttons
   */
  public displaySubmit = true;

  /**
   * The form id
   */
  public formId: string;

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
   * Do evade duplicates we maintain the submission information in case there are server errors
   */
  currentSubmission: SubmissionObject;

  /**
   * An event created when submission is sucessfull so the utilizer of the modal can continue its functionality
   */
  @Output() createItemEvent = new EventEmitter();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilderService: FormBuilderService,
    private collectionDataService: CollectionDataService,
    private submissionFormsConfigService: SubmissionFormsConfigService,
    private submissionService: SubmissionService,
    private projectItemService: ProjectItemService,
    private formService: FormService,
    private sectionsService: SectionsService,
    private notificationsService: NotificationsService
  ) {
  }

  /**
   * Initialize form initialization
   */
  ngOnInit(): void {
    this.initFormModel();
  }

  /**
   * Check if submission has errors so you can remove submission before closing modal
   * or close modal if no errors are found
   */
  closeModal() {
    if (!isUndefined(this.currentSubmission) && !isNull(this.currentSubmission) && !isUndefined(this.currentSubmission.errors) && this.currentSubmission.errors.length > 0) {
      this.removeSubmission().subscribe(() => {
        this.activeModal.dismiss(false);
      });
    } else {
      this.activeModal.dismiss(false);
    }
  }

  /**
   * Discart submission from workspace item
   */
  removeSubmission(): Observable<SubmissionObject[]> {
    return this.submissionService.discardSubmission(this.currentSubmission.id);
  }

  /**
   * Patch item with data retrieved from the form
   */
  submit(formData: Observable<any>): void {
    this.processing.next(true);
    combineLatest(formData, this.getCurrentSubmissionObject()).pipe(
      switchMap(([data, submissionObject]) => {
        return this.projectItemService.updateMultipleSubmissionMetadata(submissionObject, this.formName, Object.assign({}, data, this.customMetadata));
      }),
    ).subscribe((submissionObject: SubmissionObject) => {
      // Save submission object in case an error occurres
      this.currentSubmission = submissionObject;
      if (!!submissionObject && submissionObject.errors && submissionObject.errors.length > 0) {
        this.handleErrors(submissionObject);
        this.processing.next(false);
      } else {
        this.handleDepositWorkspace(submissionObject);
      }
    });
  }

  /**
   * If the submission is present return the submission object
   * if not present return the submission request creation
   */
  getCurrentSubmissionObject(): Observable<SubmissionObject> {
    if (!isUndefined(this.currentSubmission) && !isNull(this.currentSubmission)) {
      return observableOf(this.currentSubmission);
    } else {
      return this.submissionService.createSubmission(this.collectionId, this.entityType);
    }
  }

  /**
   * show server errors in the form
   */
  handleErrors(submissionObject: SubmissionObject) {
    this.sectionsService.checkSectionErrors(submissionObject.id, submissionObject._links.self.href, this.formId, this.parseErorrs(submissionObject.errors));
  }

  /**
   * parse server errors from SubmissionObjectError[] to SubmissionSectionError[] to be handled correctly by sectionService
   */
  parseErorrs(errors: SubmissionObjectError[]): SubmissionSectionError[] {
    const newErrors: SubmissionSectionError[] = [];
    errors.forEach(error => {
      error.paths.forEach(path => {
        newErrors.push({ message: error.message, path: path });
      });
    });
    return newErrors;
  }

  /**
   * start depositWorkspaceItem and close modal if successful
   */
  handleDepositWorkspace(submissionObject: SubmissionObject) {
    this.projectItemService.depositWorkspaceItem(submissionObject).subscribe(() => {
      this.notificationsService.success('item.submission.create.sucessfully');
      this.createItemEvent.emit();
      this.closeModal();
    });
  }

  /**
   * Retrieve form configuration and build form model
   */
  initFormModel() {
    this.processing.next(true);
    this.formId = this.formService.getUniqueId('create-item-submission-modal');
    this.collectionDataService.findById(this.collectionId).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((collection: Collection) => {
      this.submissionFormsConfigService.findByName(this.formName).pipe(
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
    });
  }
}
