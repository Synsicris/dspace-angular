import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable, of as observableOf } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { QuestionsBoardStep } from '../../core/models/questions-board-step.model';
import { QuestionsBoardStateService } from '../../core/questions-board-state.service';
import {
  CreateSimpleItemModalComponent
} from '../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { QuestionsBoardService } from '../../core/questions-board.service';
import { SimpleItem } from '../../../shared/create-simple-item-modal/models/simple-item.model';
import { ProjectGroupService } from '../../../core/project/project-group.service';
import { Community } from '../../../core/shared/community.model';
import { DragAndDropContainerComponent } from '../../shared/drag-and-drop/drag-and-drop-container.component';
import { filter, map } from 'rxjs/operators';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'ds-questions-board-step-container',
  styleUrls: ['./questions-board-step-container.component.scss'],
  templateUrl: './questions-board-step-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionsBoardStepContainerComponent extends DragAndDropContainerComponent {
  /**
   * The prefix to use for the i19n keys
   */
  @Input() messagePrefix: string;

  /**
   * The question board step object
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
   * The project community id which the subproject belong to
   */
  @Input() public projectCommunityId: string;

  /**
   * The funding community which the question board belong to
   */
  @Input() fundingCommunity: Community;

  /**
   * Questions board type (interim report or explanation plan)
   */
  @Input() questionEntityType: string;

  /**
   * If the user is a project reader
   */
  @Input() isProjectReader: boolean;

  /**
   * A boolean representing if compare mode is active
   */
  compareMode$ = new BehaviorSubject(false);

  @Input()
  set compareMode(compareMode: boolean) {
    this.compareMode$.next(compareMode);
  }

  get compareMode() {
    return this.compareMode$.value;
  }

  /**
   * A boolean representing if item is a version of original item
   */
  isVersionOfAnItem$ = new BehaviorSubject(false);

  @Input()
  set isVersionOfAnItem(isVersionOfAnItem: boolean) {
    this.isVersionOfAnItem$.next(isVersionOfAnItem);
  }

  get isVersionOfAnItem() {
    return this.isVersionOfAnItem$.value;
  }


  private processing$: Observable<boolean> = observableOf(false);

  constructor(
    protected questionsBoardService: QuestionsBoardService,
    protected cdr: ChangeDetectorRef,
    protected questionsBoardStateService: QuestionsBoardStateService,
    protected modalService: NgbModal,
    protected projectGroupService: ProjectGroupService,
    protected authorizationService: AuthorizationDataService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.processing$ = this.questionsBoardStateService.isProcessing();
    this.questionsBoardStateService.getQuestionsBoardStep(this.questionsBoardStep.parentId).pipe(
      filter((steps: QuestionsBoardStep[]) => steps?.length > 0),
    ).subscribe((steps: QuestionsBoardStep[]) => {
      this.connectedToList = steps.map(step => step.id);
    });
  }

  canAdd(): Observable<boolean> {
    return combineLatest([
      of(this.isProjectReader),
      this.isVersionOfAnItem$.asObservable(),
      this.compareMode$.asObservable()
    ]).pipe(
      map(([isProjectReader, isVersionOfAnItem, compareMode]) => !isProjectReader && !(isVersionOfAnItem || compareMode))
    );
  }

  openModal() {

    const modalRef = this.modalService.open(CreateSimpleItemModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });

    modalRef.componentInstance.formConfig = this.questionsBoardService.getQuestionsBoardTaskFormConfig(this.questionsBoardStep.type);
    modalRef.componentInstance.formHeader = this.questionsBoardService.getQuestionsBoardStepTaskFormName(this.questionsBoardStep.type);
    modalRef.componentInstance.searchMessageInfoKey = this.questionsBoardService.getQuestionsBoardStepTaskSearchHeader(this.questionsBoardStep.type);
    modalRef.componentInstance.processing = this.questionsBoardStateService.isProcessing();
    modalRef.componentInstance.searchConfiguration = this.questionsBoardService.getSearchTaskConfigName(this.questionsBoardStep.type);
    modalRef.componentInstance.scope = this.projectCommunityId;
    modalRef.componentInstance.startWithSearch = true;
    modalRef.componentInstance.query = this.buildExcludedTasksQuery();

    modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
      this.questionsBoardStateService.dispatchGenerateQuestionsBoardTask(
        this.projectCommunityId,
        this.questionsBoardStep.parentId,
        this.questionsBoardStep.id,
        item.type.value,
        item.metadata);
    });
    modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
      items.forEach((item) => {
        this.questionsBoardStateService.dispatchAddQuestionsBoardTaskAction(
          this.questionsBoardStep.parentId,
          this.questionsBoardStep.id,
          item.id);
      });
    });
  }

  /**
   * drop function utilized when the list is reordered
   */
  drop(event: CdkDragDrop<QuestionsBoardStep>) {

    if (event.previousContainer === event.container) {
      const newList = [...event.container.data.tasks];
      moveItemInArray(newList, event.previousIndex, event.currentIndex);
      this.questionsBoardStateService.dispatchOrderTasks(this.questionsBoardStep.parentId, this.questionsBoardStep.id, newList, event.container.data.tasks);
    }
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }


  listDropped(event: CdkDragDrop<QuestionsBoardStep>) {
    return;
  }

  isProcessing(): Observable<boolean> {
    return this.processing$;
  }

  private buildExcludedTasksQuery(): string {
    // const subprojectMembersGroup = this.projectGroupService.getProjectMembersGroupNameByCommunity(this.fundingCommunity);
    // let query = `(entityGrants:${ProjectGrantsTypes.Project} OR entityPolicyGroup:${subprojectMembersGroup})`;
    let query = '';
    if (this.questionsBoardStep.getTasksIds().length > 0) {
      const excludedIdsQuery = '-(search.resourceid' + ':(' + this.questionsBoardStep.getTasksIds().join(' OR ') + '))';
      query += `${excludedIdsQuery}`;
    }

    return query;
  }
}
