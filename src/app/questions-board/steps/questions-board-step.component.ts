import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, skip, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { QuestionsBoardStep } from '../core/models/questions-board-step.model';
import { QuestionsBoardStateService } from '../core/questions-board-state.service';
import { Community } from '../../core/shared/community.model';
import { Item } from '../../core/shared/item.model';
import { QuestionsBoardService } from '../core/questions-board.service';
import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { EditSimpleItemModalComponent } from '../../shared/edit-simple-item-modal/edit-simple-item-modal.component';
import { QuestionsBoardType } from '../core/models/questions-board-type';
import { getRemoteDataPayload } from '../../core/shared/operators';

@Component({
  selector: 'ds-questions-board-step',
  templateUrl: './questions-board-step.component.html',
  styleUrls: ['./questions-board-step.component.scss', './../../shared/comments/comment-list-box/comment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsBoardStepComponent implements OnInit {

  /**
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  /**
   * The questions board step object
   */
  _questionsBoardStep: BehaviorSubject<QuestionsBoardStep> = new BehaviorSubject<QuestionsBoardStep>(null);
  @Input()
  set questionsBoardStep(questionsBoardStep: QuestionsBoardStep) {
    this._questionsBoardStep.next(questionsBoardStep);
  }

  get questionsBoardStep(): QuestionsBoardStep {
    return this._questionsBoardStep.value;
  }

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

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  formConfig$: Observable<SubmissionFormModel>;

  /**
   * The questions board item
   * @type {Observable<Item>}
   */
  questionsBoard$: Observable<Item>;

  /**
   * The entity type that represent the questions board step
   */
  questionBoardEntityType: string;

  /**
   * Indicate to show or not checkbox
   */
  hasCheckbox = false;

  constructor(
    private questionsBoardService: QuestionsBoardService,
    protected questionsBoardStateService: QuestionsBoardStateService,
    protected modalService: NgbModal,
    protected translate: TranslateService,
    protected route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.questionBoardEntityType = this.questionsBoardService.getQuestionsBoardStepEntityTypeName();
    this.hasCheckbox = this.questionsBoardStep.type === QuestionsBoardType.Question1;
    this.formConfig$ = this.questionsBoardService.getQuestionsBoardStepFormConfig(this.questionsBoardStep.type);
    this.questionsBoard$ = this.route.data.pipe(
      map((data: Data) => data.questionsBoard),
      getRemoteDataPayload()
    );
  }

  /**
   * After component view init after 2 times it sets the value, then start setting the state value for step
   */
  ngAfterViewInit() {
    this.collapsable.isCollapsed().pipe(
      skip(2),
      distinctUntilChanged()
    ).subscribe((val) => {
      this.questionsBoardStateService.dispatchSetQuestionsBoardStepCollapse(
        this.questionsBoardStep.parentId,
        this.questionsBoardStep.id,
        val
      );
    });
  }

  /**
   * Get the edit item mode
   */
  getEditMode(): string {
    return this.questionsBoardService.getQuestionsBoardEditMode();
  }

  /**
   * Get the path to metadata section to patch
   */
  getSectionName() {
    return this.questionsBoardService.getQuestionsBoardEditFormSection();
  }

  /**
   * Get questions board step title
   */
  getStepTitle(): string {
    return this.translate.instant(this.messagePrefix + '.' + this.questionsBoardStep.type + '.title');
  }

  /**
   * Open dialog box for editing questions board
   */
  openEditModal() {
    const modalRef = this.modalService.open(EditSimpleItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.formConfig = this.formConfig$;
    modalRef.componentInstance.editMode = this.questionsBoardService.getQuestionsBoardEditMode();
    modalRef.componentInstance.formSectionName = this.questionsBoardService.getQuestionsBoardEditFormSection();
    modalRef.componentInstance.itemId = this.questionsBoardStep.id;

    modalRef.componentInstance.itemUpdate.pipe(take(1))
      .subscribe((item: Item) => {
        this.updateQuestionsBoardStep(item);
        modalRef.close();
      });
  }

  /**
   * Update questions board step object from given item
   * @param item
   */
  updateQuestionsBoardStep(item: Item) {
    const updatedQuestionsBoardStep = this.questionsBoardService.updateQuestionsBoardStep(item, this.questionsBoardStep);
    this.questionsBoardStateService.dispatchUpdateQuestionsBoardStep(
      updatedQuestionsBoardStep.parentId,
      updatedQuestionsBoardStep
    );
  }

  /**
   * Get from selector the previously inserted collapsed value for the specific step
   */
  isCollapsed() {
    return this.questionsBoardStateService.getCollapsable(this.questionsBoardStep.parentId, this.questionsBoardStep.id);
  }

}
