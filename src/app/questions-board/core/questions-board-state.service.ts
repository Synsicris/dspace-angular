import { Injectable } from '@angular/core';

import { combineLatest as combineLatestObservable, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { isNotEmpty } from '../../shared/empty.util';
import { AppState } from '../../app.reducer';
import {
  isCompareMode,
  isQuestionsBoardLoadedSelector,
  isQuestionsBoardProcessingSelector,
  questionsBoardByIDSelector,
  questionsBoardStepByIDSelector,
  questionsBoardStepCollapsable
} from './selectors';
import { QuestionsBoard } from './models/questions-board.model';
import { QuestionsBoardStep } from './models/questions-board-step.model';
import { QuestionsBoardTask } from './models/questions-board-task.model';
import {
  AddQuestionsBoardTaskAction,
  ClearQuestionsBoardStepCollapseAction,
  GenerateQuestionsBoardTaskAction,
  InitCompareAction,
  OrderQuestionsBoardTasksAction,
  PatchQuestionsBoardStepMetadataAction,
  RemoveQuestionsBoardTaskAction,
  SetQuestionsBoardStepCollapseAction,
  StopCompareQuestionsBoardAction,
  UpdateQuestionsBoardStepAction
} from './questions-board.actions';
import { MetadataMap } from '../../core/shared/metadata.models';

@Injectable()
export class QuestionsBoardStateService {

  constructor(private store: Store<AppState>) {
  }

  dispatchAddExploitationPlanTaskAction(
    exploitationPlanId: string,
    stepId: string,
    taskId: string
  ) {
    this.store.dispatch(new AddQuestionsBoardTaskAction(
      exploitationPlanId,
      stepId,
      taskId)
    );
  }

  dispatchGenerateExploitationPlanTask(
    projectId: string,
    exploitationPlanId: string,
    stepId: string,
    type: string,
    metadataMap: MetadataMap
  ) {
    this.store.dispatch(new GenerateQuestionsBoardTaskAction(
      projectId,
      exploitationPlanId,
      stepId,
      type,
      metadataMap));
  }

  dispatchPatchStepMetadata(
    exploitationPlanId: string,
    stepId: string,
    step: QuestionsBoardStep,
    metadata: string,
    metadataIndex: number,
    value: any
  ) {
    this.store.dispatch(new PatchQuestionsBoardStepMetadataAction(
      exploitationPlanId,
      stepId,
      step,
      metadata,
      metadataIndex,
      value
    ));
  }

  dispatchUpdateExploitationPlanStep(exploitationPlanId: string, exploitationPlanStep: QuestionsBoardStep) {
    this.store.dispatch(new UpdateQuestionsBoardStepAction(exploitationPlanId, exploitationPlanStep));
  }

  dispatchSetExploitationPlanStepCollapse(exploitationPlanId: string, exploitationPlanStepId: string, value: boolean) {
    this.store.dispatch(new SetQuestionsBoardStepCollapseAction(exploitationPlanId, exploitationPlanStepId, value));
  }

  dispatchClearCollapsable() {
    this.store.dispatch(new ClearQuestionsBoardStepCollapseAction());
  }

  /**
   * Return array of ExploitationPlanStep
   * @param exploitationPlanId
   */
  getExploitationPlanStep(exploitationPlanId: string): Observable<QuestionsBoardStep[]> {
    return this.store.pipe(
      select(questionsBoardByIDSelector(exploitationPlanId)),
      map((entry: QuestionsBoard) => entry.steps),
      distinctUntilChanged()
    );
  }

  getExploitationPlanTasksByParentId(
    exploitationPlanId: string,
    exploitationPlanIdId: string
  ): Observable<QuestionsBoardTask[]> {
    return this.store.pipe(
      select(questionsBoardByIDSelector(exploitationPlanId)),
      filter((exploitationPlan: QuestionsBoard) => isNotEmpty(exploitationPlan)),
      map((exploitationPlan: QuestionsBoard) => {
        return exploitationPlan.getStep(exploitationPlanIdId).tasks;
      })
    );
  }

  /**
   * Check whether the state for a give exploitation plan has been loaded
   * @param exploitationPlanId
   */
  isExploitationPlanLoadedById(exploitationPlanId: string): Observable<boolean> {
    const isLoaded$: Observable<boolean> = this.store.pipe(
      select(isQuestionsBoardLoadedSelector)
    );

    const exploitationPlan$: Observable<QuestionsBoard> = this.store.pipe(
      select(questionsBoardByIDSelector(exploitationPlanId))
    );

    return combineLatestObservable([isLoaded$, exploitationPlan$]).pipe(
      map(([isLoaded, exploitationPlan]) => isLoaded && isNotEmpty(exploitationPlan)),
      take(1)
    );
  }

  isExploitationPlanLoaded(): Observable<boolean> {
    return this.store.pipe(
      select(isQuestionsBoardLoadedSelector),
      distinctUntilChanged()
    );
  }

  isProcessing(): Observable<boolean> {
    return this.store.pipe(select(isQuestionsBoardProcessingSelector));
  }

  removeTaskFromStep(exploitationPlanId: string, parentId: string, taskId: string, taskPosition: number): void {
    this.store.dispatch(new RemoveQuestionsBoardTaskAction(exploitationPlanId, parentId, taskId, taskPosition));
  }

  getExploitationPlanStepById(exploitationPlanId: string, exploitationPlanStepId: string) {
    return this.store.pipe(select(
      questionsBoardStepByIDSelector(exploitationPlanId, exploitationPlanStepId)
    ),
    );
  }

  getCollapsable(exploitationPlanId: string, exploitationPlanStepId: string) {
    return this.store.pipe(select(
      questionsBoardStepCollapsable(exploitationPlanId, exploitationPlanStepId)
    )
    );
  }

  dispatchOrderTasks(
    exploitationPlanId: string,
    stepId: string,
    currentTasks: QuestionsBoardTask[],
    previousTasks: QuestionsBoardTask[]
  ) {
    this.store.dispatch(new OrderQuestionsBoardTasksAction(
      exploitationPlanId,
      stepId,
      currentTasks,
      previousTasks
    ));
  }


  /**
   * Check compareMode is true
   */
  public isCompareModeActive() {
    return this.store.pipe(select(isCompareMode));
  }

  /**
   * Dispatch a new InitCompareAction
   *
   * @param exploitationPlanId
   *    the exploitation plan's id
   * @param compareExploitationPlanId
   *    the exploitation plan's id to compare with
   * @param isVersionOf
   *    whether the exploitation plan's id to compare is a version of item
   */
  public dispatchInitCompare(exploitationPlanId: string, compareExploitationPlanId: string, isVersionOf: boolean) {
    this.store.dispatch(new InitCompareAction(exploitationPlanId, compareExploitationPlanId, isVersionOf));
  }

  /**
   * Dispatch a new StopCompareQuestionsBoardAction
   *
   * @param exploitationPlanId
   *    the exploitation plan's id
   */
  dispatchStopCompare(exploitationPlanId: string) {
    this.store.dispatch(new StopCompareQuestionsBoardAction(exploitationPlanId));
  }


}
