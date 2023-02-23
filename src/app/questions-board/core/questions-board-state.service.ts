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

  dispatchAddQuestionsBoardTaskAction(
    questionsBoardId: string,
    stepId: string,
    taskId: string
  ) {
    this.store.dispatch(new AddQuestionsBoardTaskAction(
      questionsBoardId,
      stepId,
      taskId)
    );
  }

  dispatchGenerateQuestionsBoardTask(
    projectId: string,
    questionsBoardId: string,
    stepId: string,
    type: string,
    metadataMap: MetadataMap
  ) {
    this.store.dispatch(new GenerateQuestionsBoardTaskAction(
      projectId,
      questionsBoardId,
      stepId,
      type,
      metadataMap));
  }

  dispatchPatchQuestionsBoardStepMetadata(
    questionsBoardId: string,
    stepId: string,
    step: QuestionsBoardStep,
    metadata: string,
    metadataIndex: number,
    value: any
  ) {
    this.store.dispatch(new PatchQuestionsBoardStepMetadataAction(
      questionsBoardId,
      stepId,
      step,
      metadata,
      metadataIndex,
      value
    ));
  }

  dispatchUpdateQuestionsBoardStep(questionsBoardId: string, questionsBoardStep: QuestionsBoardStep) {
    this.store.dispatch(new UpdateQuestionsBoardStepAction(questionsBoardId, questionsBoardStep));
  }

  dispatchSetQuestionsBoardStepCollapse(questionsBoardId: string, questionsBoardStepId: string, value: boolean) {
    this.store.dispatch(new SetQuestionsBoardStepCollapseAction(questionsBoardId, questionsBoardStepId, value));
  }

  dispatchClearCollapsable() {
    this.store.dispatch(new ClearQuestionsBoardStepCollapseAction());
  }

  /**
   * Return array of questions board steps
   * @param questionsBoardId
   */
  getQuestionsBoardStep(questionsBoardId: string): Observable<QuestionsBoardStep[]> {
    return this.store.pipe(
      select(questionsBoardByIDSelector(questionsBoardId)),
      map((entry: QuestionsBoard) => entry.steps),
      distinctUntilChanged()
    );
  }

  getQuestionsBoardTasksByParentId(
    questionsBoardId: string,
    questionsBoardStepId: string
  ): Observable<QuestionsBoardTask[]> {
    return this.store.pipe(
      select(questionsBoardByIDSelector(questionsBoardId)),
      filter((questionsBoard: QuestionsBoard) => isNotEmpty(questionsBoard)),
      map((questionsBoard: QuestionsBoard) => {
        return questionsBoard.getStep(questionsBoardStepId).tasks;
      })
    );
  }

  /**
   * Check whether the state for a give questions board has been loaded
   * @param questionsBoardId
   */
  isQuestionsBoardLoadedById(questionsBoardId: string): Observable<boolean> {
    const isLoaded$: Observable<boolean> = this.store.pipe(
      select(isQuestionsBoardLoadedSelector)
    );

    const questionsBoard$: Observable<QuestionsBoard> = this.store.pipe(
      select(questionsBoardByIDSelector(questionsBoardId))
    );

    return combineLatestObservable([isLoaded$, questionsBoard$]).pipe(
      map(([isLoaded, questionsBoard]) => isLoaded && isNotEmpty(questionsBoard)),
      take(1)
    );
  }

  isQuestionsBoardLoaded(): Observable<boolean> {
    return this.store.pipe(
      select(isQuestionsBoardLoadedSelector),
      distinctUntilChanged()
    );
  }

  isProcessing(): Observable<boolean> {
    return this.store.pipe(select(isQuestionsBoardProcessingSelector));
  }

  removeTaskFromStep(questionsBoardId: string, parentId: string, taskId: string, taskPosition: number): void {
    this.store.dispatch(new RemoveQuestionsBoardTaskAction(questionsBoardId, parentId, taskId, taskPosition));
  }

  getQuestionsBoardStepById(questionsBoardId: string, questionsBoardStepId: string) {
    return this.store.pipe(select(
      questionsBoardStepByIDSelector(questionsBoardId, questionsBoardStepId)
    ),
    );
  }

  getCollapsable(questionsBoardId: string, questionsBoardStepId: string) {
    return this.store.pipe(select(
      questionsBoardStepCollapsable(questionsBoardId, questionsBoardStepId)
    )
    );
  }

  dispatchOrderTasks(
    questionsBoardId: string,
    stepId: string,
    currentTasks: QuestionsBoardTask[],
    previousTasks: QuestionsBoardTask[]
  ) {
    this.store.dispatch(new OrderQuestionsBoardTasksAction(
      questionsBoardId,
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
   * @param questionsBoardId
   *    the questions board's id
   * @param compareQuestionsBoardId
   *    the questions board's id to compare with
   * @param isVersionOf
   *    whether the questions board's id to compare is a version of item
   */
  public dispatchInitCompare(questionsBoardId: string, compareQuestionsBoardId: string, isVersionOf: boolean) {
    this.store.dispatch(new InitCompareAction(questionsBoardId, compareQuestionsBoardId, isVersionOf));
  }

  /**
   * Dispatch a new StopCompareQuestionsBoardAction
   *
   * @param questionsBoardId
   *    the questions board's id
   */
  dispatchStopCompare(questionsBoardId: string) {
    this.store.dispatch(new StopCompareQuestionsBoardAction(questionsBoardId));
  }


}
