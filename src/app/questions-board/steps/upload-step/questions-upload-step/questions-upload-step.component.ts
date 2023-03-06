import { RemoteData } from './../../../../core/data/remote-data';
import { QuestionsBoardStateService } from './../../../core/questions-board-state.service';
import { NotificationsService } from './../../../../shared/notifications/notifications.service';
import { SubmissionService } from './../../../../submission/submission.service';
import { AuthService } from './../../../../core/auth/auth.service';
import { RestRequestMethod } from './../../../../core/data/rest-request-method';
import { UploaderOptions } from './../../../../shared/uploader/uploader-options.model';
import { Community } from './../../../../core/shared/community.model';
import { Item } from './../../../../core/shared/item.model';
import { followLink } from './../../../../shared/utils/follow-link-config.model';
import { getFirstSucceededRemoteData } from './../../../../core/shared/operators';
import { SubmissionUploadFilesComponent } from './../../../../submission/form/submission-upload-files/submission-upload-files.component';
import { SubmissionUploadsConfigDataService } from './../../../../core/config/submission-uploads-config-data.service';
import { SectionsService } from './../../../../submission/sections/sections.service';
import { CollectionDataService } from './../../../../core/data/collection-data.service';
import { SectionUploadService } from './../../../../submission/sections/upload/section-upload.service';
import { SubmissionFormsModel } from './../../../../core/config/models/config-submission-forms.model';
import { AccessConditionOption } from './../../../../core/config/models/config-access-condition-option.model';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';
import { AlertType } from './../../../../shared/alert/aletr-type';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from './../../../../shared/subscriptions/models/subscription.model';
import { QuestionsBoardService } from './../../../../questions-board/core/questions-board.service';
import { HALEndpointService } from './../../../../core/shared/hal-endpoint.service';
import { isNotEmpty } from './../../../../shared/empty.util';
import { EasyOnlineImportService } from './../../../../core/easy-online-import/easy-online-import.service';
import { TranslateService } from '@ngx-translate/core';
import { SubmissionUploadsModel } from './../../../../core/config/models/config-submission-uploads.model';
import { WorkspaceitemSectionFormObject } from './../../../../core/submission/models/workspaceitem-section-form.model';

@Component({
  selector: 'ds-questions-upload-step',
  templateUrl: './questions-upload-step.component.html',
  styleUrls: ['./questions-upload-step.component.scss'],
  providers: [EasyOnlineImportService]
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
   * The configuration for the bitstream's metadata form
   */
  // TODO: to be changed
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
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  /**
   * The funding community which the questions board belong to
   */
  @Input() fundingCommunity: Community;

  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() isFunder: boolean;

  /**
   * The prefix to use for the i19n keys
   */
  @Input() messagePrefix: string;

  /**
   * Reference to teh ipwCollapse child component
   */
  @ViewChild('ipwCollapse') collapsable;

  /**
   * A boolean representing if compare mode is active
   */
  @Input() compareMode = false;

  /**
   * A boolean representing if item is a version of original item
   */
  @Input() isVersionOfAnItem = false;

  @ViewChild(SubmissionUploadFilesComponent) submissionUploaderRef: SubmissionUploadFilesComponent;

  public uploadFilesOptions: UploaderOptions = new UploaderOptions();

  /**
 * Observable keeping track whether or not the uploader has finished initializing
 * Used to start rendering the uploader component
 */
  initializedUploaderOptions = new BehaviorSubject(false);

  constructor(
    private bitstreamService: SectionUploadService,
    private authService: AuthService,
    private halService: HALEndpointService,
    private collectionDataService: CollectionDataService,
    protected sectionService: SectionsService,
    private uploadsConfigService: SubmissionUploadsConfigDataService,
    private questionsBoardService: QuestionsBoardService,
    private submissionService: SubmissionService,
    private notificationsService: NotificationsService,
    private questionsBoardStateService: QuestionsBoardStateService,
    private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    // debugger
    // this.questionsBoardStateService.dispatchUploadFilesToQuestionBoard(this.questionsBoardObject.uuid, [
    //   {
    //     uuid: 'string',
    //     metadata: {} as WorkspaceitemSectionFormObject,
    //     sizeBytes: 2,
    //     checkSum: null,
    //     url: 'string',
    //     thumbnail: 'string',
    //   } as any
    // ]);

    this.questionsBoardStateService.getFilesFromQuestionsBoard(this.questionsBoardObject.uuid).subscribe((res) => {
      console.log(res, 'getFilesFromQuestionsBoard');
    });

    this.halService.getEndpoint(this.submissionService.getSubmissionObjectLinkName())
      .pipe(
        filter((href: string) => isNotEmpty(href)),
        distinctUntilChanged())
      .subscribe((endpointURL) => {
        console.log('endpointURL', endpointURL.concat(`/${this.questionsBoardObject.uuid}:${this.questionsBoardService.getQuestionsBoardEditMode()}`));

        this.uploadFilesOptions = Object.assign(new UploaderOptions, {
          url: endpointURL.concat(`/${this.questionsBoardObject.uuid}:${this.questionsBoardService.getQuestionsBoardEditMode()}`),
          method: RestRequestMethod.POST,
          authToken: this.authService.buildAuthHeader(),
        });
        this.initializedUploaderOptions.next(true);
      });

    const config$ = this.uploadsConfigService.findByHref('url', true, false, followLink('metadata')).pipe(
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
    // this.subs.push();

  }


  onCompleteItem(event) {
    console.log(event);
  }

  /**
 * Show error notification on upload fails
 */
  public onUploadError() {
    this.notificationsService.error(null, this.translate.get('submission.sections.upload.upload-failed'));
  }

  /**
* Get questions board step title
*/
  getStepTitle(): string {
    return this.translate.instant(this.messagePrefix + '.' + 'upload' + '.title');
  }

  /**
 * Get from selector the previously inserted collapsed value for the specific step
 */
  isCollapsed() {
    return this.questionsBoardStateService.getCollapsable(this.questionsBoardObject.uuid, 'upload');
  }
}
