import { isEqual } from 'lodash';
import { WorkspaceitemSectionUploadFileObject } from './../../../core/submission/models/workspaceitem-section-upload-file.model';
import { ChangeDetectorRef, Component, Inject, ViewChildren, QueryList } from '@angular/core';

import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { SectionModelComponent } from '../models/section.model';
import { hasValue, isNotEmpty, isNotUndefined, isUndefined } from '../../../shared/empty.util';
import { SectionUploadService } from './section-upload.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { ResourcePolicyDataService } from '../../../core/resource-policy/resource-policy-data.service';
import { SubmissionUploadsConfigDataService } from '../../../core/config/submission-uploads-config-data.service';
import { SubmissionUploadsModel } from '../../../core/config/models/config-submission-uploads.model';
import { SubmissionFormsModel } from '../../../core/config/models/config-submission-forms.model';
import { SectionsType } from '../sections-type';
import { renderSectionFor } from '../sections-decorator';
import { SectionDataObject } from '../models/section-data.model';
import { SubmissionObjectEntry } from '../../objects/submission-objects.reducer';
import { AlertType } from '../../../shared/alert/aletr-type';
import { RemoteData } from '../../../core/data/remote-data';
import { Group } from '../../../core/eperson/models/group.model';
import { SectionsService } from '../sections.service';
import { SubmissionService } from '../../submission.service';
import { Collection } from '../../../core/shared/collection.model';
import { AccessConditionOption } from '../../../core/config/models/config-access-condition-option.model';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { getFirstSucceededRemoteData } from '../../../core/shared/operators';
import { SubmissionVisibility } from '../../utils/visibility.util';
import { SubmissionUploadFilesComponent } from '../../form/submission-upload-files/submission-upload-files.component';
import { SubmissionSectionUploadFileComponent } from './file/section-upload-file.component';

export const POLICY_DEFAULT_NO_LIST = 1; // Banner1
export const POLICY_DEFAULT_WITH_LIST = 2; // Banner2

export interface AccessConditionGroupsMapEntry {
  accessCondition: string;
  groups: Group[];
}

/**
 * This component represents a section that contains submission's bitstreams
 */
@Component({
  selector: 'ds-submission-section-upload',
  styleUrls: ['./section-upload.component.scss'],
  templateUrl: './section-upload.component.html',
})
@renderSectionFor(SectionsType.Upload)
export class SubmissionSectionUploadComponent extends SectionModelComponent {

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  /**
   * The array containing the keys of file list array
   * @type {Array}
   */
  public fileIndexes: string[] = [];

  /**
   * The file list
   * @type {Array}
   */
  public fileList: any[] = [];

  /**
   * The array containing the name of the files
   * @type {Array}
   */
  public fileNames: string[] = [];

  /**
   * The collection name this submission belonging to
   * @type {string}
   */
  public collectionName: string;

  /**
   * Default access conditions of this collection
   * @type {Array}
   */
  public collectionDefaultAccessConditions: any[] = [];

  /**
   * Define if collection access conditions policy type :
   * POLICY_DEFAULT_NO_LIST : is not possible to define additional access group/s for the single file
   * POLICY_DEFAULT_WITH_LIST : is possible to define additional access group/s for the single file
   * @type {number}
   */
  public collectionPolicyType: number;

  /**
   * The configuration for the bitstream's metadata form
   */
  public configMetadataForm$: Observable<SubmissionFormsModel>;

  /**
   * List of available access conditions that could be set to files
   */
  public availableAccessConditionOptions: AccessConditionOption[];  // List of accessConditions that an user can select

  /**
   * i18n message label
   * @type {string}
   */
  public dropMsg = 'submission.sections.upload.drop-message';

  /**
   * add more access conditions link show or not
   */
  public singleAccessCondition: boolean;

  /**
   * Is the upload required
   * @type {boolean}
   */
  public required$ = new BehaviorSubject<boolean>(true);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  /**
   * The list of upload files components in this section
   */
  @ViewChildren(SubmissionSectionUploadFileComponent) fileEntryRef: QueryList<SubmissionSectionUploadFileComponent>;

  /**
   * Flag to indicate if the edit bitstream modal has been opened once
   */
  editBitstreamModalOpenedOnce = false;

  /**
   * The reference to the submission uploader component
   * @type {SubmissionUploadFilesComponent}
   */
  submissionUploader: SubmissionUploadFilesComponent;

  /**
   * Initialize instance variables
   *
   * @param {SectionUploadService} bitstreamService
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {CollectionDataService} collectionDataService
   * @param {GroupDataService} groupService
   * @param {ResourcePolicyDataService} resourcePolicyService
   * @param {SectionsService} sectionService
   * @param {SubmissionService} submissionService
   * @param {SubmissionUploadsConfigDataService} uploadsConfigService
   * @param {SectionDataObject} injectedSectionData
   * @param {string} injectedSubmissionId
   * @param {SubmissionUploadFilesComponent} injectedSubmissionUploaderRef
   */
  constructor(private bitstreamService: SectionUploadService,
    private changeDetectorRef: ChangeDetectorRef,
    private collectionDataService: CollectionDataService,
    private groupService: GroupDataService,
    private resourcePolicyService: ResourcePolicyDataService,
    protected sectionService: SectionsService,
    private submissionService: SubmissionService,
    private uploadsConfigService: SubmissionUploadsConfigDataService,
    @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
    @Inject('submissionIdProvider') public injectedSubmissionId: string,
    @Inject('submissionUploaderRefProvider') public injectedSubmissionUploaderRef: Observable<SubmissionUploadFilesComponent>) {
    super(undefined, injectedSectionData, injectedSubmissionId, injectedSubmissionUploaderRef);
      this.initEditBitstreamListeners();
  }

  /**
   * Initialize all instance variables and retrieve collection default access conditions
   */
  onSectionInit() {
    const config$ = this.uploadsConfigService.findByHref(this.sectionData.config, true, false, followLink('metadata')).pipe(
      getFirstSucceededRemoteData(),
      map((config) => config.payload));

    // retrieve configuration for the bitstream's metadata form
    this.configMetadataForm$ = config$.pipe(
      switchMap((config: SubmissionUploadsModel) =>
        config.metadata.pipe(
          getFirstSucceededRemoteData(),
          map((remoteData: RemoteData<SubmissionFormsModel>) => remoteData.payload)
        )
      ));

    this.subs.push(
      this.submissionService.getSubmissionObject(this.submissionId).pipe(
        filter((submissionObject: SubmissionObjectEntry) => isNotUndefined(submissionObject) && !submissionObject.isLoading),
        filter((submissionObject: SubmissionObjectEntry) => isUndefined(this.collectionId) || this.collectionId !== submissionObject.collection),
        tap((submissionObject: SubmissionObjectEntry) => this.collectionId = submissionObject.collection),
        mergeMap((submissionObject: SubmissionObjectEntry) => this.collectionDataService.findById(submissionObject.collection)),
        filter((rd: RemoteData<Collection>) => isNotUndefined((rd.payload))),
        tap((collectionRemoteData: RemoteData<Collection>) => this.collectionName = collectionRemoteData.payload.name),
        // TODO review this part when https://github.com/DSpace/dspace-angular/issues/575 is resolved
        /*        mergeMap((collectionRemoteData: RemoteData<Collection>) => {
                  return this.resourcePolicyService.findByHref(
                    (collectionRemoteData.payload as any)._links.defaultAccessConditions.href
                  );
                }),
                filter((defaultAccessConditionsRemoteData: RemoteData<ResourcePolicy>) =>
                  defaultAccessConditionsRemoteData.hasSucceeded),
                tap((defaultAccessConditionsRemoteData: RemoteData<ResourcePolicy>) => {
                  if (isNotEmpty(defaultAccessConditionsRemoteData.payload)) {
                    this.collectionDefaultAccessConditions = Array.isArray(defaultAccessConditionsRemoteData.payload)
                      ? defaultAccessConditionsRemoteData.payload : [defaultAccessConditionsRemoteData.payload];
                  }
                }),*/
        mergeMap(() => config$),
      ).subscribe((config: SubmissionUploadsModel) => {
        this.required$.next(config.required);
        this.availableAccessConditionOptions = isNotEmpty(config.accessConditionOptions) ? config.accessConditionOptions : [];
        this.singleAccessCondition = config?.singleAccessCondition || false;
        this.collectionPolicyType = this.availableAccessConditionOptions.length > 0
          ? POLICY_DEFAULT_WITH_LIST
          : POLICY_DEFAULT_NO_LIST;
        this.changeDetectorRef.detectChanges();
      }),

      // retrieve submission's bitstreams from state
      observableCombineLatest(this.configMetadataForm$,
        this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id)).pipe(
          filter(([configMetadataForm, fileList]: [SubmissionFormsModel, any[]]) => {
            return isNotEmpty(configMetadataForm) && isNotUndefined(fileList);
          }),
          distinctUntilChanged())
        .subscribe(([configMetadataForm, fileList]: [SubmissionFormsModel, any[]]) => {
          this.fileList = [];
          this.fileIndexes = [];
          this.fileNames = [];
          this.changeDetectorRef.detectChanges();
          if (isNotUndefined(fileList) && fileList.length > 0) {
            fileList.forEach((file) => {
              this.fileList.push(file);
              this.fileIndexes.push(file.uuid);
              this.fileNames.push(this.getFileName(configMetadataForm, file));
            });
          }

          this.changeDetectorRef.detectChanges();
        }
        )
    );
  }

  /**
   * Check if upload section has read-only visibility
   */
  isReadOnly(): boolean {
    return SubmissionVisibility.isReadOnly(
      this.sectionData.sectionVisibility,
      this.submissionService.getSubmissionScope()
    );
  }

  /**
   * Return file name from metadata
   *
   * @param configMetadataForm
   *    the bitstream's form configuration
   * @param fileData
   *    the file metadata
   */
  private getFileName(configMetadataForm: SubmissionFormsModel, fileData: any): string {
    const metadataName: string = configMetadataForm.rows[0].fields[0].selectableMetadata[0].metadata;
    let title: string;
    if (isNotEmpty(fileData.metadata) && isNotEmpty(fileData.metadata[metadataName])) {
      title = fileData.metadata[metadataName][0].display;
    } else {
      title = fileData.uuid;
    }

    return title;
  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    // if not mandatory, always true
    // if mandatory, at least one file is required
    return observableCombineLatest(this.required$,
      this.bitstreamService.getUploadedFileList(this.submissionId, this.sectionData.id),
      (required,fileList: any[]) => {
        return (!required || (isNotUndefined(fileList) && fileList.length > 0));
      });
  }

  /**
   * Method provided by Angular. Invoked when the instance is destroyed.
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Open file browse dialog
   *
   * @param submissionUploaderRef$
   */
  browse() {
      this.submissionUploader?.uploader?.browseBtn?.nativeElement.click();
  }

  /**
   * Initialize the listeners for the edit bitstream modal and open it when a file is uploaded
   * If there is only one file, open the edit modal
   * If there are multiple files, open the edit modal only for the last uploaded file (the one that triggered the event)
   */
  private initEditBitstreamListeners() {
    this.submissionUploaderRef.subscribe((submissionUploader: SubmissionUploadFilesComponent) => {
      this.submissionUploader = submissionUploader;
      this.submissionUploader?.uploader?.onCompleteItem.subscribe((completeItems) => {
        if (hasValue(completeItems) && isNotEmpty(completeItems) && !this.editBitstreamModalOpenedOnce) {
          const fileEntries = this.fileEntryRef.toArray();
          if (isNotEmpty(fileEntries)) {
            const items: WorkspaceitemSectionUploadFileObject[] = completeItems.sections.upload.files;
            const lastUploadedFile: WorkspaceitemSectionUploadFileObject = items[items.length - 1];
            const sectionIdx = fileEntries.findIndex(fileCmp => isEqual(lastUploadedFile.uuid, fileCmp.fileId));
            if (sectionIdx > -1) {
              const elementToEdit: SubmissionSectionUploadFileComponent = fileEntries[sectionIdx];
              // subscribe to modal close event to reset the flag
              elementToEdit.modalClosed.subscribe(() => {
                this.editBitstreamModalOpenedOnce = false;
              });
              // open the modal
              elementToEdit.editBitstreamData();
              this.editBitstreamModalOpenedOnce = true;
            }
          }
        }
      });
    });
  }
}
