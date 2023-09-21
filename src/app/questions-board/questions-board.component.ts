import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { Item } from '../core/shared/item.model';
import { Community } from '../core/shared/community.model';
import { QuestionsBoardStateService } from './core/questions-board-state.service';
import { QuestionsBoardStep } from './core/models/questions-board-step.model';
import { hasValue } from '../shared/empty.util';
import { ActivatedRoute } from '@angular/router';
import { VersionSelectedEvent } from '../shared/item-version-list/item-version-list.component';
import { AlertRole, getProgrammeRoles } from '../shared/alert/alert-role/alert-role';
import { ProjectAuthorizationService } from '../core/project/project-authorization.service';
import { QuestionsBoardService } from './core/questions-board.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';
import { QuestionsUploadStepComponent } from './steps/upload-step/questions-upload-step/questions-upload-step.component';

@Component({
  selector: 'ds-questions-board',
  templateUrl: './questions-board.component.html',
  styleUrls: ['./questions-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsBoardComponent implements OnInit, OnDestroy {
  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() hasAnyFunderRole: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isAdmin: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  /**
   * If the current user is project reader
   */
  @Input() isProjectReader: boolean;

  /**
   * The prefix to use for the i18n keys
   */
  @Input() messagePrefix: string;

  /**
   * The questions board object item
   */
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
   * Flag to check the display of upload step
   */
  @Input() showUploadStep = false;

  /**
   * Flag to indicate if the clear board button should be shown
   */
  @Input() showClearBoardButton = false;

  /**
   * The upload step component reference
   * @memberof QuestionsBoardComponent
   */
  @ViewChild('uploadFileStep') uploadFileStep: QuestionsUploadStepComponent;

  public questionsBoardObjectId: string;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  /**
   * A boolean representing if compare mode is active
   */
  compareMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The list of questions board steps
   */
  questionsBoardStep$: Observable<QuestionsBoardStep[]>;

  /**
   * A boolean representing if item is a version of original item
   */
  public isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public funderRoles: AlertRole[];

  constructor(
    protected questionsBoardService: QuestionsBoardService,
    protected questionsBoardStateService: QuestionsBoardStateService,
    protected aroute: ActivatedRoute,
    private projectAuthorizationService: ProjectAuthorizationService,
    private modalService: NgbModal,
    private chd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.questionsBoardService.isAdmin = this.isAdmin;
    this.questionsBoardObjectId = this.questionsBoardObject?.id;
    this.questionsBoardStep$ = this.questionsBoardStateService.getQuestionsBoardStep(this.questionsBoardObjectId);
    this.subs.push(
      this.questionsBoardStateService.isCompareModeActive()
        .subscribe((compareMode: boolean) => this.compareMode.next(compareMode))
    );

    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });

    this.funderRoles = getProgrammeRoles(this.questionsBoardObject, this.projectAuthorizationService);
  }

  isLoading(): Observable<boolean> {
    return this.questionsBoardStateService.isQuestionsBoardLoaded().pipe(
      map((loaded: boolean) => !loaded)
    );
  }

  /**
   * Dispatch initialization of comparing mode
   *
   * @param selected
   */
  onVersionSelected(selected: VersionSelectedEvent) {
    this.questionsBoardStateService.dispatchInitCompare(selected.base?.id, selected.comparing.id, selected.active.id);
  }

  /**
   * Dispatch cleaning of comparing mode
   */
  onVersionDeselected() {
    this.questionsBoardStateService.dispatchStopCompare(this.questionsBoardObject?.id);
  }

  /**
   * Clear all questions board tasks from all the steps.
   * If upload step is present, clear all files from upload step.
   */
  clearBoard() {
    if (this.questionsBoardObject?.id) {
      const modalRef = this.modalService.open(ConfirmationModalComponent);
      modalRef.componentInstance.dso = this.questionsBoardObject;
      modalRef.componentInstance.headerLabel = 'confirmation-modal.clear-question-board.header';
      modalRef.componentInstance.infoLabel = 'confirmation-modal.clear-question-board.info';
      modalRef.componentInstance.cancelLabel = 'confirmation-modal.clear-question-board.cancel';
      modalRef.componentInstance.confirmLabel = 'confirmation-modal.clear-question-board.confirm';
      modalRef.componentInstance.brandColor = 'danger';
      modalRef.componentInstance.confirmIcon = 'fas fa-trash';
      modalRef.componentInstance.response.pipe(take(1)).subscribe((confirm: boolean) => {
        if (confirm) {
          this.questionsBoardStateService.dispatchClearQuestionBoardSteps(this.questionsBoardObject.id);
          if (this.showUploadStep && this.uploadFileStep?.uploadConfigId) {
            this.questionsBoardStateService.dispatchRemoveQuestionBoardFiles(this.questionsBoardObject.id, this.uploadFileStep.uploadConfigId);
            this.uploadFileStep.onFileEventChanges(true);
            this.chd.detectChanges();
          }
        }
      });
    }
  }

  /**
   * When destroy component clear all collapsed values.
   */
  ngOnDestroy() {
    this.questionsBoardStateService.dispatchClearClearQuestionBoard();

    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }
}
