import { createSelector, MemoizedSelector } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { isNotEmpty } from '../../shared/empty.util';
import { QuestionsBoardState } from './questions-board.reducer';
import { QuestionsBoard } from './models/questions-board.model';
import { QuestionsBoardStep } from './models/questions-board-step.model';


function questionsBoardKeySelector<T>(key: string, selector): MemoizedSelector<AppState, QuestionsBoard> {
  return createSelector(selector, (state: QuestionsBoardState) => {
    if (isNotEmpty(state) && isNotEmpty(state.questionsBoard)) {
      return state.questionsBoard[key];
    } else {
      return undefined;
    }
  });
}

function questionsBoardStepKeySelector<T>(key: string, stepId: string, selector): MemoizedSelector<AppState, QuestionsBoardStep> {
  return createSelector(selector, (state: QuestionsBoardState) => {
    if (isNotEmpty(state) && isNotEmpty(state.questionsBoard)) {
      return state.questionsBoard[key].getStep(stepId);
    } else {
      return undefined;
    }
  });
}

function questionsBoardStepCollapsableSelector<T>(key: string, stepId: string, selector): MemoizedSelector<AppState, QuestionsBoardStep> {
  return createSelector(selector, (state: QuestionsBoardState) => {
    if (isNotEmpty(state) && isNotEmpty(state.collapsed) && isNotEmpty(state.collapsed[key]) && isNotEmpty(state.collapsed[key][stepId])) {
      return state.collapsed[key][stepId];
    } else {
      return true;
    }
  });
}

/**
 * Returns the exploitationPlan state.
 * @function _getQuestionsBoardState
 * @param {AppState} state Top level state.
 * @return {QuestionsBoardState}
 */
const _getQuestionsBoardState = (state: any) => state.exploitationPlan;

/**
 * Returns the exploitation plan state.
 * @function questionsBoardStateSelector
 * @return {QuestionsBoardState}
 */
export const questionsBoardStateSelector = createSelector(_getQuestionsBoardState,
  (state: QuestionsBoardState) => state
);

/**
 * Returns true if exploitation plan objects are loaded.
 * @function isQuestionsBoardLoadedSelector
 * @return {boolean}
 */
export const isQuestionsBoardLoadedSelector = createSelector(_getQuestionsBoardState,
  (state: QuestionsBoardState) => state.loaded
);

/**
 * Returns true if the user an operation is processing.
 * @function isQuestionsBoardProcessingSelector
 * @return {boolean}
 */
export const isQuestionsBoardProcessingSelector = createSelector(_getQuestionsBoardState,
  (state: QuestionsBoardState) => state.processing
);

/**
 * Returns the ExploitationPlan object.
 * @function questionsBoardByIDSelector
 * @param {string} exploitationPlanId
 * @return {QuestionsBoard}
 */
export function questionsBoardByIDSelector(exploitationPlanId: string): MemoizedSelector<AppState, QuestionsBoard> {
  return questionsBoardKeySelector<QuestionsBoard>(exploitationPlanId, questionsBoardStateSelector);
}

/**
 * Returns the ExploitationPlan object.
 * @function questionsBoardByIDSelector
 * @param {string} exploitationPlanId
 * @return {QuestionsBoard}
 */
export function questionsBoardStepByIDSelector(exploitationPlanId: string, exploitationPlanStepId: string): MemoizedSelector<AppState, QuestionsBoardStep> {
  return questionsBoardStepKeySelector<QuestionsBoardStep>(exploitationPlanId, exploitationPlanStepId, questionsBoardStateSelector);
}

/**
 * Returns the ExploitationPlan object.
 * @function questionsBoardByIDSelector
 * @param {string} exploitationPlanId
 * @return {QuestionsBoard}
 */
export function questionsBoardStepCollapsable(exploitationPlanId: string, exploitationPlanStepId: string): MemoizedSelector<AppState, QuestionsBoardStep> {
  return questionsBoardStepCollapsableSelector<QuestionsBoardStep>(exploitationPlanId, exploitationPlanStepId, questionsBoardStateSelector);
}


/**
 * Returns true if compare mose id active.
 * @function isCompareMode
 * @return {boolean}
 */
export const isCompareMode = createSelector(_getQuestionsBoardState,
  (state: QuestionsBoardState) => state.compareMode || false
);

