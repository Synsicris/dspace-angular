import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from './../../../../shared/notifications/notifications.service';
import { QuestionsBoardStateService } from './../../../../questions-board/core/questions-board-state.service';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DynamicFormControlModel, } from '@ng-dynamic-forms/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SectionUploadService } from '../section-upload.service';
import { hasValue, isNotUndefined } from '../../../../shared/empty.util';
import { FormService } from '../../../../shared/form/form.service';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { WorkspaceitemSectionUploadFileObject } from '../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { SubmissionFormsModel } from '../../../../core/config/models/config-submission-forms.model';
import { SubmissionService } from '../../../submission.service';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { SubmissionJsonPatchOperationsService } from '../../../../core/submission/submission-json-patch-operations.service';
import { SubmissionSectionUploadFileEditComponent } from './edit/section-upload-file-edit.component';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal-config';
import { QuestionsBoardService } from '../../../../questions-board/core/questions-board.service';

/**
 * This component represents a single bitstream contained in the submission
 */
@Component({
  selector: 'ds-submission-upload-section-file',
  styleUrls: ['./section-upload-file.component.scss'],
  templateUrl: './section-upload-file.component.html',
})
export class SubmissionSectionUploadFileComponent implements OnChanges, OnInit {

  /**
   * The list of available access condition
   * @type {Array}
   */
  @Input() availableAccessConditionOptions: any[];

  /**
   * add more access conditions link show or not
   * @type {boolean}
   */
  @Input() singleAccessCondition: boolean;

  /**
   * The submission id
   * @type {string}
   */
  @Input() collectionId: string;

  /**
   * Define if collection access conditions policy type :
   * POLICY_DEFAULT_NO_LIST : is not possible to define additional access group/s for the single file
   * POLICY_DEFAULT_WITH_LIST : is possible to define additional access group/s for the single file
   * @type {number}
   */
  @Input() collectionPolicyType: number;

  /**
   * The configuration for the bitstream's metadata form
   * @type {SubmissionFormsModel}
   */
  @Input() configMetadataForm: SubmissionFormsModel;

  /**
   * The bitstream id
   * @type {string}
   */
  @Input() fileId: string;

  /**
   * The bitstream array key
   * @type {string}
   */
  @Input() fileIndex: string;

  /**
   * The bitstream id
   * @type {string}
   */
  @Input() fileName: string;

  /**
   * Representing the possibility to edit or not the files
   * @type {boolean}
   */
  @Input() readOnly = false;

  /**
   * The section id
   * @type {string}
   */
  @Input() sectionId: string;

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId: string;

  /**
   * The questionsBoard id
   * @type {string}
   */
  @Input() questionBoardId: string;

  /**
   * Flag to enable/disable action buttons (delete & edit)
   */
  @Input() disableActions = false;

  /**
   * The [[SubmissionSectionUploadFileEditComponent]] reference
   * @type {SubmissionSectionUploadFileEditComponent}
   */
  @ViewChild(SubmissionSectionUploadFileEditComponent) fileEditComp: SubmissionSectionUploadFileEditComponent;

  /**
   * Event emitted when a bitstream is deleted
   * @type {EventEmitter<boolean>}
   */
  @Output() deleteUploadedFile: EventEmitter<boolean> = new EventEmitter(false);

  /**
   * Event emitted when a bitstream is edited
   * @type {EventEmitter<boolean>}
   */
  @Output() editUploadedFile: EventEmitter<boolean> = new EventEmitter(false);
  /**
   * The bitstream's metadata data
   * @type {WorkspaceitemSectionUploadFileObject}
   */
  public fileData: WorkspaceitemSectionUploadFileObject;

  /**
   * The form id
   * @type {string}
   */
  public formId: string;

  /**
   * A boolean representing if to show bitstream edit form
   * @type {boolean}
   */
  public readMode: boolean;

  /**
   * The form model
   * @type {DynamicFormControlModel[]}
   */
  public formModel: DynamicFormControlModel[];

  /**
   * A boolean representing if a submission delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processingDelete$ = new BehaviorSubject<boolean>(false);

  /**
   * The [JsonPatchOperationPathCombiner] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Array containing all the form metadata defined in configMetadataForm
   * @type {Array}
   */
  protected formMetadata: string[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   * @param {FormService} formService
   * @param {HALEndpointService} halService
   * @param {NgbModal} modalService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SubmissionJsonPatchOperationsService} operationsService
   * @param {SubmissionService} submissionService
   * @param {SectionUploadService} uploadService
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private formService: FormService,
    private halService: HALEndpointService,
    private modalService: NgbModal,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private operationsService: SubmissionJsonPatchOperationsService,
    private submissionService: SubmissionService,
    private uploadService: SectionUploadService,
    private questionsBoardStateService: QuestionsBoardStateService,
    private questionsBoardService: QuestionsBoardService,
    private notificationsService: NotificationsService,
    private translate: TranslateService,
  ) {
    this.readMode = true;
  }

  /**
   * Retrieve bitstream's metadata
   */
  ngOnChanges() {
    if (this.availableAccessConditionOptions) {
      // Retrieve file state
      if (hasValue(this.submissionId)) {
        this.subscriptions.push(
          this.uploadService
            .getFileData(this.submissionId, this.sectionId, this.fileId).pipe(
              filter((bitstream) => isNotUndefined(bitstream)))
            .subscribe((bitstream) => {
              this.fileData = bitstream;
            }
            )
        );
      } else if (hasValue(this.questionBoardId)) {
        this.subscriptions.push(
          this.questionsBoardStateService.getUploadedFileFromQuestionsBoard(this.questionBoardId, this.fileId).pipe(
            filter((bitstream) => isNotUndefined(bitstream)))
            .subscribe((bitstream) => {
              this.fileData = bitstream;
            }
            )
        );
      }
    }
  }

  /**
   * Initialize instance variables
   */
  ngOnInit() {
    this.formId = this.formService.getUniqueId(this.fileId);
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionId, 'files', this.fileIndex);
    this.loadFormMetadata();
  }

  /**
   * Show confirmation dialog for delete
   */
  public confirmDelete(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.processingDelete$.next(true);
          this.deleteFile();
        }
      }
    );
  }

  /**
   * Build a Bitstream object by the current file uuid
   *
   * @return Bitstream object
   */
  public getBitstream(): Bitstream {
    return Object.assign(new Bitstream(), {
      uuid: this.fileData.uuid
    });
  }

  editBitstreamData() {

    const options: NgbModalOptions = {
      size: 'xl',
      backdrop: 'static',
    };

    const activeModal = this.modalService.open(SubmissionSectionUploadFileEditComponent, options);

    activeModal.componentInstance.availableAccessConditionOptions = this.availableAccessConditionOptions;
    activeModal.componentInstance.collectionId = this.collectionId;
    activeModal.componentInstance.collectionPolicyType = this.collectionPolicyType;
    activeModal.componentInstance.configMetadataForm = this.configMetadataForm;
    activeModal.componentInstance.fileData = this.fileData;
    activeModal.componentInstance.fileId = this.fileId;
    activeModal.componentInstance.fileIndex = this.fileIndex;
    activeModal.componentInstance.formId = this.formId;
    activeModal.componentInstance.sectionId = this.sectionId;
    activeModal.componentInstance.formMetadata = this.formMetadata;
    activeModal.componentInstance.pathCombiner = this.pathCombiner;
    activeModal.componentInstance.submissionId = this.submissionId;
    activeModal.componentInstance.questionBoardId = this.questionBoardId;
    activeModal.componentInstance.singleAccessCondition = this.singleAccessCondition;

    this.subscriptions.push(
      activeModal.closed.subscribe((updateFinishedQB: boolean) => {
        if (updateFinishedQB) {
          this.editUploadedFile.emit(true);
        }
      }));
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  protected loadFormMetadata() {
    this.configMetadataForm.rows.forEach((row) => {
      row.fields.forEach((field) => {
        field.selectableMetadata.forEach((metadatum) => {
          this.formMetadata.push(metadatum.metadata);
        });
      });
    }
    );
  }

  /**
   * Delete bitstream from submission
   */
  protected deleteFile() {
    this.operationsBuilder.remove(this.pathCombiner.getPath());
    const elementId = this.submissionId ?? `${this.questionBoardId}:${this.questionsBoardService.getQuestionsBoardEditMode()}`;
    this.subscriptions.push(this.operationsService.jsonPatchByResourceID(
      this.submissionService.getSubmissionObjectLinkName(),
      elementId,
      this.pathCombiner.rootElement,
      this.pathCombiner.subRootElement)
      .subscribe({
        next: () => {
        if (isNotUndefined(this.submissionId)) {
          this.uploadService.removeUploadedFile(this.submissionId, this.sectionId, this.fileId);
        }

        if (isNotUndefined(this.questionBoardId)) {
          this.questionsBoardStateService.removeUploadedFile(this.questionBoardId, this.fileId);
          this.deleteUploadedFile.emit(true);
        }
        this.processingDelete$.next(false);
      },
      error: ()=> {
        this.processingDelete$.next(false);
        this.notificationsService.error(
          null,
          this.translate.get('submission.sections.upload.delete.submit.error.message'));
      }}));
  }
}
