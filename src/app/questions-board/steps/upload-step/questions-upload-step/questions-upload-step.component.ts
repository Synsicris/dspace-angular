import { POLICY_DEFAULT_NO_LIST, POLICY_DEFAULT_WITH_LIST } from './../../../../submission/sections/upload/section-upload.component';
import { SubmissionUploadsModel } from './../../../../core/config/models/config-submission-uploads.model';
import { SectionsType } from './../../../../submission/sections/sections-type';
import { mergeMap } from 'rxjs/operators';
import { SubmissionDefinitionsModel } from './../../../../core/config/models/config-submission-definitions.model';
import { RequestParam } from './../../../../core/cache/models/request-param.model';
import { Collection } from './../../../../core/shared/collection.model';
import { followLink } from './../../../../shared/utils/follow-link-config.model';
import { WorkspaceitemSectionUploadObject } from './../../../../core/submission/models/workspaceitem-section-upload.model';
import { RemoteData } from './../../../../core/data/remote-data';
import { EditItem } from './../../../../core/submission/models/edititem.model';
import { EditItemDataService } from './../../../../core/submission/edititem-data.service';
import { QuestionsBoardStateService } from './../../../core/questions-board-state.service';
import { NotificationsService } from './../../../../shared/notifications/notifications.service';
import { SubmissionService } from './../../../../submission/submission.service';
import { AuthService } from './../../../../core/auth/auth.service';
import { RestRequestMethod } from './../../../../core/data/rest-request-method';
import { UploaderOptions } from './../../../../shared/uploader/uploader-options.model';
import { Item } from './../../../../core/shared/item.model';
import {
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload,
} from './../../../../core/shared/operators';
import { SubmissionUploadFilesComponent } from './../../../../submission/form/submission-upload-files/submission-upload-files.component';
import { SubmissionUploadsConfigDataService } from './../../../../core/config/submission-uploads-config-data.service';
import { SectionsService } from './../../../../submission/sections/sections.service';
import { AccessConditionOption } from './../../../../core/config/models/config-access-condition-option.model';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  switchMap,
  combineLatest,
} from 'rxjs';
import { AlertType } from './../../../../shared/alert/aletr-type';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from './../../../../shared/subscriptions/models/subscription.model';
import { QuestionsBoardService } from './../../../../questions-board/core/questions-board.service';
import { HALEndpointService } from './../../../../core/shared/hal-endpoint.service';
import { isNotEmpty, isNotUndefined } from './../../../../shared/empty.util';
import { EasyOnlineImportService } from './../../../../core/easy-online-import/easy-online-import.service';
import { TranslateService } from '@ngx-translate/core';
import { WorkspaceitemSectionUploadFileObject } from './../../../../core/submission/models/workspaceitem-section-upload-file.model';
import { SubmissionSectionModel } from './../../../../core/config/models/config-submission-section.model';
import { SubmissionSectionsModel } from './../../../../core/config/models/config-submission-sections.model';
import { BaseDataService } from './../../../../core/data/base/base-data.service';
import { SubmissionFormsModel } from './../../../../core/config/models/config-submission-forms.model';

@Component({
  selector: 'ds-questions-upload-step',
  templateUrl: './questions-upload-step.component.html',
  styleUrls: ['./questions-upload-step.component.scss'],
  providers: [EasyOnlineImportService],
})
export class QuestionsUploadStepComponent implements OnInit {
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
   * List of available access conditions that could be set to files
   */
  public availableAccessConditionOptions: AccessConditionOption[]; // List of accessConditions that an user can select

  /**
   * i18n message label
   * @type {string}
   */
  public dropMsg = 'submission.sections.upload.drop-message';

  /**
   * i18n message label
   * @type {string}
   */
  public dropOverDocumentMsg = 'submission.sections.upload.drop-message';

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

  @Input() questionsBoardObject: Item;

  /**
   * The prefix to use for the i19n keys
   */
  @Input() messagePrefix: string;

  /**
   * Reference to teh ipwCollapse child component
   */
  @ViewChild('ipwCollapse') collapsable;

  public uploadFilesOptions: UploaderOptions = new UploaderOptions();

  public configMetadataForm$: Observable<SubmissionFormsModel>;

  /**
   * Observable keeping track whether or not the uploader has finished initializing
   * Used to start rendering the uploader component
   */
  initializedUploaderOptions = new BehaviorSubject(false);

  collectionId: string;

  configEditItem: EditItem;

  sectionType: string = SectionsType.Upload;

  configMetadataForm: SubmissionFormsModel;

  constructor(
    private authService: AuthService,
    private halService: HALEndpointService,
    private uploadsConfigService: SubmissionUploadsConfigDataService,
    private questionsBoardService: QuestionsBoardService,
    private submissionService: SubmissionService,
    private notificationsService: NotificationsService,
    private questionsBoardStateService: QuestionsBoardStateService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private editItemDataService: EditItemDataService,
    private sectionsService: SectionsService,
  ) { }

  ngOnInit(): void {
    const uploadFilesOptions$: Observable<string> = this.halService
      .getEndpoint(this.submissionService.getSubmissionObjectLinkName())
      .pipe(
        filter((href: string) => isNotEmpty(href)),
        distinctUntilChanged(),
        map((endpointURL: string) => {
          const fullURL = endpointURL.concat(
            `/${this.questionsBoardObject.uuid
            }:${this.questionsBoardService.getQuestionsBoardEditMode()}`
          );

          this.uploadFilesOptions = Object.assign(new UploaderOptions(), {
            url: fullURL,
            method: RestRequestMethod.POST,
            authToken: this.authService.buildAuthHeader(),
          });
          this.initializedUploaderOptions.next(true);
          return fullURL;
        })
      );

    const editItem$: Observable<EditItem> = uploadFilesOptions$.pipe(
      switchMap((endpointURL: string) => {
        const searchParams: RequestParam[] = [
          new RequestParam('projection', 'full'),
        ];
        const href = this.editItemDataService.buildHrefWithParams(endpointURL, searchParams);
        // retrieve submission's section list
        return this.editItemDataService.findByHref(href, true, false, followLink('collection'), followLink('submissionDefinition'))
          .pipe(
            getFirstSucceededRemoteDataPayload(),
          );
      })
    );

    const submissionConfig$: Observable<SubmissionUploadsModel> = editItem$.pipe(
      mergeMap((value: EditItem) => {
        return (value.submissionDefinition as Observable<RemoteData<SubmissionDefinitionsModel>>).pipe(
          getRemoteDataPayload(),
          mergeMap((model: SubmissionDefinitionsModel) => {
            return this.uploadsConfigService.findByHref(model._links.sections.href).pipe(
              getFirstSucceededRemoteDataPayload(),
              mergeMap((config: any) => {
                let res = config._links;
                const uploadLink = (res as any).page?.find(x => x.href.includes(this.sectionType));

                return this.uploadsConfigService.findByHref(uploadLink.href, true, false).pipe(
                  getFirstSucceededRemoteData(),
                  mergeMap((c) => {
                    const payload = (c.payload as any);
                    const section: SubmissionSectionModel = { ...payload };
                    const config$ = this.uploadsConfigService.findByHref(section._links.config.href, true, false, followLink('metadata')).pipe(
                      getFirstSucceededRemoteDataPayload(),
                      map((submissionConfig: SubmissionUploadsModel) => submissionConfig)
                    );

                    return config$;
                  }));
              })
            );
          })
        );
      })
    );

    // retrieve configuration for the bitstream's metadata form
    this.configMetadataForm$ = submissionConfig$.pipe(
      switchMap((config: SubmissionUploadsModel) =>
        config.metadata.pipe(
          getFirstSucceededRemoteData(),
          map((remoteData: RemoteData<SubmissionFormsModel>) => remoteData.payload)
        )
      ));

    // retrieve submission's section list
    // const submissionSections = this.submissionService.getSubmissionObject(this.questionsBoardObject.id).pipe(
    //   map((submission: SubmissionObjectEntry) => submission.isLoading),
    //   map((isLoading: boolean) => isLoading),
    //   distinctUntilChanged(),
    //   switchMap((isLoading: boolean) => {
    //     if (!isLoading) {
    //       return this.getUploadedFileList();
    //     } else {
    //       return of([]);
    //     }
    //   }));
    // const isAvailable$ = this.sectionsService.isSectionTypeAvailable(this.questionsBoardObject.id, SectionsType.Upload);
    // const isReadOnly$ = this.sectionsService.isSectionReadOnlyByType(
    //   this.questionsBoardObject.id,
    //   SectionsType.Upload,
    //   this.submissionService.getSubmissionScope()
    // );

    // const uploadEnabled$ = combineLatest([isAvailable$, isReadOnly$]).pipe(
    //   map(([isAvailable, isReadOnly]: [boolean, boolean]) => isAvailable && !isReadOnly)
    // );

    combineLatest([editItem$, submissionConfig$, this.configMetadataForm$])
      .subscribe(([editItem, submissionConfig, configMetadataForm]: [EditItem, SubmissionUploadsModel, SubmissionFormsModel]) => {
        this.configEditItem = editItem;
        const fileList: WorkspaceitemSectionUploadFileObject[] = (editItem.sections.upload as WorkspaceitemSectionUploadObject).files;
        // this.initializedUploaderOptions.next(true);
        this.prepareFiles(fileList, configMetadataForm);
        this.configMetadataForm = configMetadataForm;
        this.required$.next(submissionConfig.required);
        this.availableAccessConditionOptions = isNotEmpty(submissionConfig.accessConditionOptions) ? submissionConfig.accessConditionOptions : [];
        this.singleAccessCondition = submissionConfig?.singleAccessCondition || false;
        this.collectionPolicyType = this.availableAccessConditionOptions.length > 0
          ? POLICY_DEFAULT_WITH_LIST
          : POLICY_DEFAULT_NO_LIST;
        this.changeDetectorRef.detectChanges();
      });

  }

  private prepareFiles(fileList: WorkspaceitemSectionUploadFileObject[], configMetadataForm: SubmissionFormsModel){
    this.fileList = [];
    this.fileIndexes = [];
    this.fileNames = [];

    if (isNotUndefined(fileList) && fileList.length > 0) {
      fileList.forEach((file) => {
        this.fileList.push(file);
        this.fileIndexes.push(file.uuid);
        this.fileNames.push(this.getFileName(configMetadataForm, file));
      });
    }
    this.questionsBoardStateService.dispatchUploadFilesToQuestionBoard(this.questionsBoardObject.id, this.fileList);
  }

  /**
   * Return file name from metadata
   *
   * @param configMetadataForm
   *    the bitstream's form configuration
   * @param fileData
   *    the file metadata
   */
  private getFileName(
    configMetadataForm: SubmissionFormsModel,
    fileData: any
  ): string {
    const metadataName = configMetadataForm.rows[0].fields[0].selectableMetadata[0].metadata;
    let title: string;
    if (
      isNotEmpty(fileData.metadata) &&
      isNotEmpty(fileData.metadata[metadataName])
    ) {
      title = fileData.metadata[metadataName][0].display;
    } else {
      title = fileData.uuid;
    }

    return title;
  }

  private getUploadedFileList() {
    return this.questionsBoardStateService.getFilesFromQuestionsBoard(
      this.questionsBoardObject.id
    );
  }

  onCompleteItem(event) {
    const fileList: WorkspaceitemSectionUploadFileObject[] = (event.sections.upload as WorkspaceitemSectionUploadObject).files;
    this.prepareFiles(fileList, this.configMetadataForm);
    this.questionsBoardStateService.dispatchUploadFilesToQuestionBoard(this.questionsBoardObject.id, fileList);
  }

  /**
   * Show error notification on upload fails
   */
  public onUploadError() {
    this.notificationsService.error(
      null,
      this.translate.get('submission.sections.upload.upload-failed')
    );
  }

  /**
   * Get questions board step title
   */
  getStepTitle(): string {
    return this.translate.instant(
      this.messagePrefix + '.' + 'upload-step' + '.title'
    );
  }

  getCollection(): Observable<string> {
    return (this.configEditItem?.collection as Observable<RemoteData<Collection>>).pipe(
      getFirstSucceededRemoteData(),
      map((value: RemoteData<Collection>) => {
        return value.payload.uuid;
      })
    );
  }

  protected getSectionStatus(): Observable<boolean> {
    // TODO: required ??
    // if not mandatory, always true
    // if mandatory, at least one file is required
   return combineLatest([
      this.required$,
      this.getUploadedFileList()
    ]).pipe(
      map(([required,fileList]) => {
        return (!required || (isNotUndefined(fileList) && fileList.length > 0));
      } )
    );
  }

}
