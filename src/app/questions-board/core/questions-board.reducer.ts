import {
  AddQuestionsBoardTaskSuccessAction,
  InitCompareAction,
  InitCompareSuccessAction,
  InitQuestionsBoardSuccessAction,
  OrderQuestionsBoardTasksAction,
  QuestionsBoardActions,
  QuestionsBoardActionTypes,
  RemoveQuestionsBoardTaskSuccessAction,
  SetQuestionsBoardStepCollapseAction,
  StopCompareQuestionsBoardAction,
  UpdateQuestionsBoardStepAction,
  UploadFilesToQuestionBoardAction
} from './questions-board.actions';
import { QuestionsBoard } from './models/questions-board.model';
import { QuestionsBoardStep } from './models/questions-board-step.model';
import { QuestionsBoardTask } from './models/questions-board-task.model';

/**
 * An interface to represent questions board object entry
 */
export interface QuestionsBoardEntry {
  [questionsBoardId: string]: QuestionsBoard;
}

/**
 * The questions board State
 */
export interface QuestionsBoardState {
  questionsBoard: QuestionsBoardEntry;
  loaded: boolean;
  processing: boolean;
  moving: boolean;
  collapsed: any;
  compareQuestionsBoardId: string;
  compareMode: boolean;
}

const initialState: QuestionsBoardState = {
  questionsBoard: null,
  loaded: false,
  processing: false,
  moving: false,
  collapsed: {},
  compareQuestionsBoardId: null,
  compareMode: false
};

/**
 * The questions board Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return QuestionsBoardState
 *    the new state
 */
export function questionsBoardReducer(state = initialState, action: QuestionsBoardActions): QuestionsBoardState {
  switch (action.type) {

    case QuestionsBoardActionTypes.CLEAR_QUESTIONS_BOARD:
      return initialState;

    case QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK:
    case QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK:
    case QuestionsBoardActionTypes.INIT_QUESTIONS_BOARD:
    case QuestionsBoardActionTypes.REMOVE_QUESTIONS_BOARD_TASK: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK_SUCCESS: {
      return addQuestionsBoardTaskToQuestionsBoardStep(state, action as AddQuestionsBoardTaskSuccessAction);
    }

    case QuestionsBoardActionTypes.INIT_QUESTIONS_BOARD_SUCCESS: {
      return initQuestionsBoard(state, action as InitQuestionsBoardSuccessAction);
    }



    case QuestionsBoardActionTypes.INIT_COMPARE_QUESTIONS_BOARD: {
      return initCompare(state, action as InitCompareAction);
    }


    case QuestionsBoardActionTypes.STOP_COMPARE_QUESTIONS_BOARD: {
      return stopCompare(state, action as StopCompareQuestionsBoardAction);
    }


    case QuestionsBoardActionTypes.INIT_COMPARE_QUESTIONS_BOARD_SUCCESS: {
      return replaceQuestionsBoardSteps(state, action as InitCompareSuccessAction);
    }

    case QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK_ERROR:
    case QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK_ERROR:
    case QuestionsBoardActionTypes.INIT_QUESTIONS_BOARD_ERROR:
    case QuestionsBoardActionTypes.REMOVE_QUESTIONS_BOARD_TASK_ERROR: {
      return Object.assign({}, state, {
        processing: false
      });
    }

    case QuestionsBoardActionTypes.ORDER_QUESTIONS_BOARD_TASK: {
      return setQuestionsBoardTasks(
        state,
        (action as OrderQuestionsBoardTasksAction).payload.questionsBoardId,
        (action as OrderQuestionsBoardTasksAction).payload.stepId,
        (action as OrderQuestionsBoardTasksAction).payload.currentTasks,
        (action as OrderQuestionsBoardTasksAction).payload.previousTasks,
      );
    }


    case QuestionsBoardActionTypes.SET_QUESTIONS_BOARD_STEP_COLLAPSE: {
      return setQuestionsBoardCollapse(
        state,
        (action as SetQuestionsBoardStepCollapseAction).payload.questionsBoardId,
        (action as SetQuestionsBoardStepCollapseAction).payload.questionsBoardStepId,
        (action as SetQuestionsBoardStepCollapseAction).payload.value,
      );
    }

    case QuestionsBoardActionTypes.CLEAR_QUESTIONS_BOARD_STEP_COLLAPSE: {
      return clearQuestionsBoardCollapse(
        state
      );
    }

    case QuestionsBoardActionTypes.REMOVE_QUESTIONS_BOARD_TASK_SUCCESS: {
      return RemoveQuestionsBoardTaskFromQuestionsBoardStep(state, action as RemoveQuestionsBoardTaskSuccessAction);
    }

    case QuestionsBoardActionTypes.UPDATE_QUESTIONS_BOARD_STEP: {
      return UpdateQuestionsBoardTask(state, action as UpdateQuestionsBoardStepAction);
    }

    case QuestionsBoardActionTypes.UPLOAD_FILES_TO_QUESTION_BOARD: {
      return uploadFilesToQuestionBoard(state, action as UploadFilesToQuestionBoardAction);
    }

    default: {
      return state;
    }
  }
}

/**
 * Init a questions board object.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitQuestionsBoardSuccessAction
 * @return QuestionsBoardState
 *    the new state.
 */
function addQuestionsBoardTaskToQuestionsBoardStep(state: QuestionsBoardState, action: AddQuestionsBoardTaskSuccessAction): QuestionsBoardState {
  const newState = Object.assign({}, state);
  const step: QuestionsBoardStep = newState.questionsBoard[action.payload.questionsBoardId].getStep(action.payload.stepId);
  const stepIndex: number = newState.questionsBoard[action.payload.questionsBoardId].getStepIndex(action.payload.stepId);
  const newStep = Object.assign(new QuestionsBoardStep(), step, {
    tasks: [...step.tasks, action.payload.task]
  });
  const newQuestionsBoard = Object.assign(new QuestionsBoard(), state.questionsBoard[action.payload.questionsBoardId], {
    steps: newState.questionsBoard[action.payload.questionsBoardId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    questionsBoard: Object.assign({}, state.questionsBoard, {
      [action.payload.questionsBoardId]: newQuestionsBoard
    }),
    processing: false
  });
}

/**
 * Init a questions board object.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitQuestionsBoardSuccessAction
 * @return QuestionsBoardState
 *    the new state.
 */
function initQuestionsBoard(state: QuestionsBoardState, action: InitQuestionsBoardSuccessAction): QuestionsBoardState {
  return Object.assign({}, state, {
    questionsBoard: Object.assign({}, state.questionsBoard, {
      [action.payload.id]: action.payload.questionsBoardObj
    }),
    processing: false,
    loaded: true
  });
}


/**
 * Remove task from step.
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveQuestionsBoardTaskSuccessAction
 * @return QuestionsBoardState
 *    the new state.
 */
function RemoveQuestionsBoardTaskFromQuestionsBoardStep(state: QuestionsBoardState, action: RemoveQuestionsBoardTaskSuccessAction): QuestionsBoardState {
  const newState = Object.assign({}, state);
  const step: QuestionsBoardStep = newState.questionsBoard[action.payload.questionsBoardId].getStep(action.payload.parentId);
  const stepIndex: number = newState.questionsBoard[action.payload.questionsBoardId].getStepIndex(action.payload.parentId);
  const newStep = Object.assign(new QuestionsBoardStep(), step, {
    tasks: [...step.tasks]
  });
  newStep.removeTask(action.payload.taskId);
  const newQuestionsBoard = Object.assign(new QuestionsBoard(), state.questionsBoard[action.payload.questionsBoardId], {
    steps: newState.questionsBoard[action.payload.questionsBoardId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    questionsBoard: Object.assign({}, state.questionsBoard, {
      [action.payload.questionsBoardId]: newQuestionsBoard
    }),
    processing: false
  });
}

/**
 * Update an questions board step object.
 *
 * @param state
 *    the current state
 * @param action
 *    an UpdateQuestionsBoardStepAction
 * @return QuestionsBoardState
 *    the new state.
 */
function UpdateQuestionsBoardTask(state: QuestionsBoardState, action: UpdateQuestionsBoardStepAction): QuestionsBoardState {
  const newState = Object.assign({}, state);
  const stepIndex: number = newState.questionsBoard[action.payload.questionsBoardId].getStepIndex(action.payload.questionsBoardStep.id);

  const newQuestionsBoard = Object.assign(new QuestionsBoard(), state.questionsBoard[action.payload.questionsBoardId], {
    steps: newState.questionsBoard[action.payload.questionsBoardId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? action.payload.questionsBoardStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    questionsBoard: Object.assign({}, state.questionsBoard, {
      [action.payload.questionsBoardId]: newQuestionsBoard
    }),
    processing: false
  });
}



/**
 * Order task list of a step
 *
 * @param state
 *    the current state
 * @param questionsBoardId
 *    the questions board's Id
 * @param stepId
 *    the questions board step's Id
 * @param currentTasks
 *    the questions board task list to order
 * @param previousTasks
 *    the questions board previous task list
 * @return QuestionsBoardState
 *    the new state.
 */
function setQuestionsBoardTasks(
  state: QuestionsBoardState,
  questionsBoardId: string,
  stepId: string,
  currentTasks: QuestionsBoardTask[],
  previousTasks: QuestionsBoardTask[],
) {
  const newState = Object.assign({}, state);
  const step: QuestionsBoardStep = newState.questionsBoard[questionsBoardId].getStep(stepId);
  const stepIndex: number = newState.questionsBoard[questionsBoardId].getStepIndex(stepId);
  const newStep = Object.assign(new QuestionsBoardStep(), step, {
    tasks: [...currentTasks]
  });
  const newQuestionsBoard = Object.assign(new QuestionsBoard(), state[questionsBoardId], {
    id: questionsBoardId,
    steps: newState.questionsBoard[questionsBoardId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });

  return Object.assign({}, state, {
    questionsBoard: Object.assign({}, state.questionsBoard, {
      [questionsBoardId]: newQuestionsBoard
    })
  }) as QuestionsBoardState;
}

/**
 * Set the step collapsed value
 *
 * @param state
 *    the current state
 * @param questionsBoardId
 *    the questions board's Id
 * @param stepId
 *    the questions board step's Id
 * @param value
 *    the value of collapsed
 * @return QuestionsBoardState
 *    the new state.
 */
function setQuestionsBoardCollapse(
  state: QuestionsBoardState,
  questionsBoardId: string,
  questionsBoardStepId: string,
  value: boolean
) {
  const newState = Object.assign({}, state);
  let collapsed = Object.assign({}, state.collapsed);

  if (!collapsed[questionsBoardId]) {
    collapsed[questionsBoardId] = {};
  }

  const newCollapsedExplotationPlan = Object.assign({}, collapsed[questionsBoardId], {
    [questionsBoardStepId]: value
  });

  collapsed = Object.assign({}, collapsed, { [questionsBoardId]: newCollapsedExplotationPlan });

  return Object.assign({}, state, { collapsed: collapsed }) as QuestionsBoardState;
}


/**
 * Clear the step collapsable
 *
 * @param state
 *    the current state
 * @return QuestionsBoardState
 *    the new state.
 */
function clearQuestionsBoardCollapse(
  state: QuestionsBoardState,
) {
  return Object.assign({}, state, { collapsed: {} }) as QuestionsBoardState;
}


/**
 * Init state for comparing.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitCompareAction
 * @return QuestionsBoardState
 *    the new state.
 */
function initCompare(state: QuestionsBoardState, action: InitCompareAction) {
  return Object.assign({}, state, {
    compareQuestionsBoardId: action.payload.compareQuestionsBoardId,
    compareMode: true,
    loaded: false
  });
}

/**
 * Stop state for comparing.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitCompareAction
 * @return QuestionsBoardState
 *    the new state.
 */
function stopCompare(state: QuestionsBoardState, action: StopCompareQuestionsBoardAction) {
  return Object.assign({}, state, {
    compareQuestionsBoardId: null,
    compareMode: false,
  });
}

/**
 * replace questions board steps.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitCompareAction
 * @return QuestionsBoardState
 *    the new state.
 */
function replaceQuestionsBoardSteps(state: QuestionsBoardState, action: InitCompareSuccessAction) {

  const questionsBoardEntry = state.questionsBoard;

  return Object.assign({}, state, { loaded: true }, {
    questionsBoard: Object.assign({}, questionsBoardEntry, {
      [action.payload.questionsBoardId]: Object.assign(new QuestionsBoard(), questionsBoardEntry[action.payload.questionsBoardId], { steps: action.payload.steps })
    })
  });
}

function uploadFilesToQuestionBoard(state: QuestionsBoardState, action: UploadFilesToQuestionBoardAction): QuestionsBoardState {
  const questionsBoardEntry = state.questionsBoard;
  const existingFiles = [...questionsBoardEntry[action.payload.questionsBoardId].uploads];
  existingFiles.push(...action.payload.files);

  return Object.assign({}, state, { loaded: true }, {
    questionsBoard: Object.assign({}, questionsBoardEntry, {
      [action.payload.questionsBoardId]: Object.assign(new QuestionsBoard(), questionsBoardEntry[action.payload.questionsBoardId], {
        uploads:  existingFiles
      })
    })
  });
}

