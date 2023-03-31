import { createSelector, MemoizedSelector } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { isNotEmpty } from '../../shared/empty.util';
import { QuestionsBoardState } from './questions-board.reducer';
import { QuestionsBoard } from './models/questions-board.model';
import { QuestionsBoardStep } from './models/questions-board-step.model';
import { subStateSelector } from '../../shared/selector.util';


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
 * Returns the questions board state.
 * @function _getQuestionsBoardState
 * @param {AppState} state Top level state.
 * @return {QuestionsBoardState}
 */
const _getQuestionsBoardState = (state: any) => state.questionsBoard;

/**
 * Returns the questions board state.
 * @function questionsBoardStateSelector
 * @return {QuestionsBoardState}
 */
export const questionsBoardStateSelector = createSelector(_getQuestionsBoardState,
  (state: QuestionsBoardState) => state
);

/**
 * Returns true if questions board objects are loaded.
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
 * Returns the QuestionsBoard object.
 * @function questionsBoardByIDSelector
 * @param {string} questionsBoardId
 * @return {QuestionsBoard}
 */
export function questionsBoardByIDSelector(questionsBoardId: string): MemoizedSelector<AppState, QuestionsBoard> {
  return questionsBoardKeySelector<QuestionsBoard>(questionsBoardId, questionsBoardStateSelector);
}

/**
 * Returns the QuestionsBoard object.
 * @function questionsBoardByIDSelector
 * @param {string} questionsBoardId
 * @return {QuestionsBoard}
 */
export function questionsBoardStepByIDSelector(questionsBoardId: string, questionsBoardStepId: string): MemoizedSelector<AppState, QuestionsBoardStep> {
  return questionsBoardStepKeySelector<QuestionsBoardStep>(questionsBoardId, questionsBoardStepId, questionsBoardStateSelector);
}

/**
 * Returns the QuestionsBoard object.
 * @function questionsBoardByIDSelector
 * @param {string} questionsBoardId
 * @return {QuestionsBoard}
 */
export function questionsBoardStepCollapsable(questionsBoardId: string, questionsBoardStepId: string): MemoizedSelector<AppState, QuestionsBoardStep> {
  return questionsBoardStepCollapsableSelector<QuestionsBoardStep>(questionsBoardId, questionsBoardStepId, questionsBoardStateSelector);
}

export function questionsBoardUploadsByBoardIdSelector(boardId: string): MemoizedSelector<AppState, any> {
  const sectionDataSelector = questionsBoardByIDSelector(boardId);
  return subStateSelector<AppState, QuestionsBoard>(sectionDataSelector, 'uploads');
}

/**
 * Returns true if compare mose id active.
 * @function isCompareMode
 * @return {boolean}
 */
export const isCompareMode = createSelector(_getQuestionsBoardState,
  (state: QuestionsBoardState) => state.compareMode || false
);

/**
 * Returns the id of the questions board to compare.
 * @function isCompareMode
 * @return {boolean}
 */
export const questionsBoardCompareIdSelector = createSelector(_getQuestionsBoardState,
  (state: QuestionsBoardState) => state.compareQuestionsBoardId
);

