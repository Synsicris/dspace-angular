/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { Item } from '../../core/shared/item.model';
import { QuestionsBoardTask } from './models/questions-board-task.model';
import { QuestionsBoard } from './models/questions-board.model';
import { MetadataMap } from '../../core/shared/metadata.models';
import { QuestionsBoardStep } from './models/questions-board-step.model';
import { QuestionsBoardConfig } from '../../../config/questions-board.config';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const QuestionsBoardActionTypes = {
  ADD_QUESTIONS_BOARD_TASK: type('dspace/questionsboard/ADD_QUESTIONS_BOARD_TASK'),
  ADD_QUESTIONS_BOARD_TASK_SUCCESS: type('dspace/questionsboard/ADD_QUESTIONS_BOARD_TASK_SUCCESS'),
  ADD_QUESTIONS_BOARD_TASK_ERROR: type('dspace/questionsboard/ADD_QUESTIONS_BOARD_TASK_ERROR'),
  CLEAR_QUESTIONS_BOARD: type('dspace/questionsboard/CLEAR_QUESTIONS_BOARD'),
  GENERATE_QUESTIONS_BOARD_TASK: type('dspace/questionsboard/GENERATE_QUESTIONS_BOARD_TASK'),
  GENERATE_QUESTIONS_BOARD_TASK_SUCCESS: type('dspace/questionsboard/GENERATE_QUESTIONS_BOARD_TASK_SUCCESS'),
  GENERATE_QUESTIONS_BOARD_TASK_ERROR: type('dspace/questionsboard/GENERATE_QUESTIONS_BOARD_TASK_ERROR'),
  INIT_QUESTIONS_BOARD: type('dspace/questionsboard/INIT_QUESTIONS_BOARD'),
  INIT_QUESTIONS_BOARD_SUCCESS: type('dspace/questionsboard/INIT_QUESTIONS_BOARD_SUCCESS'),
  INIT_QUESTIONS_BOARD_ERROR: type('dspace/questionsboard/INIT_QUESTIONS_BOARD_ERROR'),
  NORMALIZE_QUESTIONS_BOARD_OBJECTS_ON_REHYDRATE: type('dspace/questionsboard/NORMALIZE_QUESTIONS_BOARD_OBJECTS_ON_REHYDRATE'),
  PATCH_QUESTIONS_BOARD_STEP_METADATA: type('dspace/questionsboard/PATCH_QUESTIONS_BOARD_STEP_METADATA'),
  PATCH_QUESTIONS_BOARD_STEP_METADATA_SUCCESS: type('dspace/questionsboard/PATCH_QUESTIONS_BOARD_STEP_METADATA_SUCCESS'),
  PATCH_QUESTIONS_BOARD_STEP_METADATA_ERROR: type('dspace/questionsboard/PATCH_QUESTIONS_BOARD_STEP_METADATA_ERROR'),
  RETRIEVE_QUESTIONS_BOARD: type('dspace/questionsboard/RETRIEVE_QUESTIONS_BOARD'),
  REMOVE_QUESTIONS_BOARD_TASK: type('dspace/questionsboard/REMOVE_QUESTIONS_BOARD_TASK'),
  REMOVE_QUESTIONS_BOARD_TASK_SUCCESS: type('dspace/questionsboard/REMOVE_QUESTIONS_BOARD_TASK_SUCCESS'),
  REMOVE_QUESTIONS_BOARD_TASK_ERROR: type('dspace/questionsboard/REMOVE_QUESTIONS_BOARD_TASK_ERROR'),
  UPDATE_QUESTIONS_BOARD_STEP: type('dspace/questionsboard/UPDATE_QUESTIONS_BOARD_STEP'),
  ORDER_QUESTIONS_BOARD_TASK: type('dspace/questionsboard/ORDER_QUESTIONS_BOARD_TASK'),
  ORDER_QUESTIONS_BOARD_TASK_SUCCESS: type('dspace/questionsboard/ORDER_QUESTIONS_BOARD_TASK_SUCCESS'),
  ORDER_QUESTIONS_BOARD_TASK_ERROR: type('dspace/questionsboard/ORDER_QUESTIONS_BOARD_TASK_ERROR'),
  SET_QUESTIONS_BOARD_STEP_COLLAPSE: type('dspace/questionsboard/SET_QUESTIONS_BOARD_STEP_COLLAPSE'),
  CLEAR_QUESTIONS_BOARD_STEP_COLLAPSE: type('dspace/questionsboard/CLEAR_QUESTIONS_BOARD_STEP_COLLAPSE'),
  INIT_COMPARE_QUESTIONS_BOARD: type('dspace/questionsboard/INIT_COMPARE_QUESTIONS_BOARD'),
  INIT_COMPARE_QUESTIONS_BOARD_SUCCESS: type('dspace/questionsboard/INIT_COMPARE_QUESTIONS_BOARD_SUCCESS'),
  INIT_COMPARE_QUESTIONS_BOARD_ERROR: type('dspace/questionsboard/INIT_COMPARE_QUESTIONS_BOARD_ERROR'),
  STOP_COMPARE_QUESTIONS_BOARD: type('dspace/questionsboard/STOP_COMPARE_QUESTIONS_BOARD'),
};

/* tslint:disable:max-classes-per-file */

/**
 * A ngrx action for generate success
 */
export class AddQuestionsBoardTaskAction implements Action {
  type = QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK;
  payload: {
    questionsBoardId: string;
    stepId: string;
    taskId: string;
  };

  /**
   * Create a new AddQuestionsBoardTaskAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param stepId
   *    the questions board step's id to whom to add task
   * @param taskId
   *    the Item id of the questions board task to add
   */
  constructor(questionsBoardId: string, stepId: string, taskId: string) {
    this.payload = { questionsBoardId, stepId, taskId };
  }
}

/**
 * A ngrx action for generate success
 */
export class AddQuestionsBoardTaskSuccessAction implements Action {
  type = QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK_SUCCESS;
  payload: {
    questionsBoardId: string;
    stepId: string;
    task: QuestionsBoardTask;
  };

  /**
   * Create a new AddQuestionsBoardTaskSuccessAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param stepId
   *    the questions board step's id to whom to add task
   * @param task
   *    the QuestionsBoardTask object to add
   */
  constructor(questionsBoardId: string, stepId: string, task: QuestionsBoardTask) {
    this.payload = { questionsBoardId, stepId, task };
  }
}

/**
 * A ngrx action for generate error
 */
export class AddQuestionsBoardTaskErrorAction implements Action {
  type = QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK_ERROR;
}

/**
 * A ngrx action to generate a questions board objects
 */
export class GenerateQuestionsBoardTaskAction implements Action {
  type = QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK;
  payload: {
    projectId: string;
    questionsBoardId: string;
    stepId: string;
    taskType: string;
    metadata: MetadataMap
  };

  /**
   * Create a new GenerateQuestionsBoardTaskAction
   *
   * @param projectId
   *    the project's UUID where to create the object
   * @param questionsBoardId
   *    the questions board's id
   * @param stepId
   *    the questions board step's id
   * @param taskType
   *    the questions board task's type
   * @param metadata: Metadata
   *    the questions board task's Metadata
   */
  constructor(projectId: string, questionsBoardId: string, stepId: string, taskType: string, metadata: MetadataMap) {
    this.payload = { projectId, questionsBoardId, stepId, taskType, metadata };
  }
}

/**
 * A ngrx action for generate success
 */
export class GenerateQuestionsBoardTaskSuccessAction implements Action {
  type = QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK_SUCCESS;
  payload: {
    questionsBoardId: string;
    stepId: string;
    item: Item;
  };

  /**
   * Create a new GenerateQuestionsBoardTaskSuccessAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param stepId
   *    the questions board step's id
   * @param item
   *    the Item of the questions board task generated
   */
  constructor(questionsBoardId: string, stepId: string, item: Item) {
    this.payload = { questionsBoardId, stepId, item };
  }
}

/**
 * A ngrx action for generate error
 */
export class GenerateQuestionsBoardTaskErrorAction implements Action {
  type = QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK_ERROR;
}

/**
 * A ngrx action to init questions board's model objects
 */
export class InitQuestionsBoardAction implements Action {
  type = QuestionsBoardActionTypes.INIT_QUESTIONS_BOARD;
  payload: {
    item: Item;
    config: QuestionsBoardConfig;
  };

  /**
   * Create a new InitQuestionsBoardAction
   *
   * @param item
   *    the Item of the questions board
   */
  constructor(item: Item, config: QuestionsBoardConfig) {
    this.payload = { item, config };
  }
}

/**
 * A ngrx action for init success
 */
export class InitQuestionsBoardSuccessAction implements Action {
  type = QuestionsBoardActionTypes.INIT_QUESTIONS_BOARD_SUCCESS;
  payload: {
    id: string;
    questionsBoardObj: QuestionsBoard
  };

  /**
   * Create a new InitQuestionsBoardSuccessAction
   *
   * @param id
   *    the Item id of the questions board generated
   * @param questionsBoardObj
   *    the questions board object
   */
  constructor(id: string, questionsBoardObj: QuestionsBoard) {
    this.payload = { id, questionsBoardObj };
  }
}

/**
 * A ngrx action for init error
 */
export class InitQuestionsBoardErrorAction implements Action {
  type = QuestionsBoardActionTypes.INIT_QUESTIONS_BOARD_ERROR;
}

/**
 * A ngrx action to patch a task's metadata
 */
export class PatchQuestionsBoardStepMetadataAction implements Action {
  type = QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA;
  payload: {
    questionsBoardId: string;
    stepId: string;
    oldStep: QuestionsBoardStep;
    metadata: string;
    metadataIndex: number;
    value: string;
  };

  /**
   * Create a new PatchQuestionsBoardStepMetadataAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param stepId
   *    the questions board step's id
   * @param oldStep
   *    the previous questions board step version
   * @param metadata
   *    the Item metadata to patch
   * @param metadataIndex
   *    the index of the Item metadata to patch
   * @param value
   *    the new value of the Item metadata to patch
   */
  constructor(
    questionsBoardId: string,
    stepId: string,
    oldStep: QuestionsBoardStep,
    metadata: string,
    metadataIndex: number,
    value: string) {
    this.payload = { questionsBoardId, stepId, oldStep, metadata, metadataIndex, value };
  }
}

/**
 * A ngrx action to patch a task's metadata
 */
export class PatchQuestionsBoardStepMetadataSuccessAction implements Action {
  type = QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA_SUCCESS;
  payload: {
    questionsBoardId: string;
    stepId: string,
    oldStep: QuestionsBoardStep,
    item: Item;
  };

  /**
   * Create a new PatchQuestionsBoardStepMetadataSuccessAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param stepId
   *    the questions board step's id
   * @param oldStep
   *    the previous questions board step version
   * @param item
   *    the patched item
   */
  constructor(
    questionsBoardId: string,
    stepId: string,
    oldStep: QuestionsBoardStep,
    item: Item) {
    this.payload = { questionsBoardId, stepId, oldStep, item };
  }
}

/**
 * A ngrx action for patch error
 */
export class PatchQuestionsBoardStepMetadataErrorAction implements Action {
  type = QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA_ERROR;
}

/**
 * A ngrx action for removing task
 */
export class RemoveQuestionsBoardTaskAction implements Action {
  type = QuestionsBoardActionTypes.REMOVE_QUESTIONS_BOARD_TASK;
  payload: {
    questionsBoardId: string;
    parentId: string;
    taskId: string;
    taskPosition: number;
  };

  /**
   * Create a new RemoveQuestionsBoardTaskAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param parentId
   *    the questions board task's parent id from where to remove task
   * @param taskId
   *    the Item id of the questions board task to remove
   * @param taskPosition
   *    the array position of the questions board task
   */
  constructor(questionsBoardId: string, parentId: string, taskId: string, taskPosition: number) {
    this.payload = { questionsBoardId, parentId, taskId, taskPosition };
  }
}

/**
 * A ngrx action for remove success
 */
export class RemoveQuestionsBoardTaskSuccessAction implements Action {
  type = QuestionsBoardActionTypes.REMOVE_QUESTIONS_BOARD_TASK_SUCCESS;
  payload: {
    questionsBoardId: string;
    parentId: string;
    taskId: string;
  };

  /**
   * Create a new RemoveQuestionsBoardTaskSuccessAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param parentId
   *    the questions board task's parent id from where to remove task
   * @param taskId
   *    the Item id of the questions board task to remove
   */
  constructor(questionsBoardId: string, parentId: string, taskId: string) {
    this.payload = { questionsBoardId, parentId, taskId };
  }
}

/**
 * A ngrx action for remove error
 */
export class RemoveQuestionsBoardTaskErrorAction implements Action {
  type = QuestionsBoardActionTypes.REMOVE_QUESTIONS_BOARD_TASK_ERROR;
}

/**
 * A ngrx action to retrieve questions board
 */
export class RetrieveQuestionsBoardAction implements Action {
  type = QuestionsBoardActionTypes.RETRIEVE_QUESTIONS_BOARD;
  payload: {
    projectId: string;
    subprojectId: string;
  };

  /**
   * Create a new RetrieveAllLinkedWorkingPlanObjectsAction
   *
   * @param projectId
   *    the project'id
   * @param subprojectId
   *    the subproject'id
   */
  constructor(projectId: string, subprojectId: string) {
    this.payload = { projectId, subprojectId };
  }
}

/**
 * A ngrx action to update a task
 */
export class UpdateQuestionsBoardStepAction implements Action {
  type = QuestionsBoardActionTypes.UPDATE_QUESTIONS_BOARD_STEP;
  payload: {
    questionsBoardId: string;
    questionsBoardStep: QuestionsBoardStep;
  };

  /**
   * Create a new UpdateQuestionsBoardStepAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param questionsBoardStep
   *    the updated questions board step
   */
  constructor(questionsBoardId: string, questionsBoardStep: QuestionsBoardStep) {
    this.payload = { questionsBoardId, questionsBoardStep };
  }
}

/**
 * A ngrx action to normalize state object on rehydrate
 */
export class NormalizeQuestionsBoardObjectsOnRehydrateAction implements Action {
  type = QuestionsBoardActionTypes.NORMALIZE_QUESTIONS_BOARD_OBJECTS_ON_REHYDRATE;
}


/**
 * A ngrx action to normalize state object on rehydrate
 */
export class OrderQuestionsBoardTasksAction implements Action {
  type = QuestionsBoardActionTypes.ORDER_QUESTIONS_BOARD_TASK;
  payload: {
    questionsBoardId: string;
    stepId: string;
    currentTasks: QuestionsBoardTask[];
    previousTasks: QuestionsBoardTask[];
  };

  constructor(questionsBoardId: string, stepId: string, currentTasks: QuestionsBoardTask[], previousTasks: QuestionsBoardTask[]) {
    this.payload = { questionsBoardId, stepId, currentTasks, previousTasks };
  }

}
/**
 * A ngrx action for ordering success
 */
export class OrderQuestionsBoardTasksSuccessAction implements Action {
  type = QuestionsBoardActionTypes.ORDER_QUESTIONS_BOARD_TASK_SUCCESS;
}

/**
 * A ngrx action for ordering tasks error
 */
export class OrderQuestionsBoardTasksErrorAction implements Action {
  type = QuestionsBoardActionTypes.ORDER_QUESTIONS_BOARD_TASK_ERROR;
  payload: {
    questionsBoardId: string;
    stepId: string;
    currentTasks: QuestionsBoardTask[];
    previousTasks: QuestionsBoardTask[];
  };

  /**
   * Create a new OrderQuestionsBoardTasksErrorAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param stepId
   *    the questions board step's id
   * @param currentTasks
   *   the list of the questions board tasks in the current order
   * @param previousTasks
   *    the list of the questions board tasks in the previous order to restore
   */
  constructor(
    questionsBoardId: string,
    stepId: string,
    currentTasks: QuestionsBoardTask[],
    previousTasks: QuestionsBoardTask[]
  ) {
    this.payload = { questionsBoardId, stepId, currentTasks, previousTasks };
  }
}

/**
 * A ngrx action to set step plan collapsed value
 */
export class SetQuestionsBoardStepCollapseAction implements Action {
  type = QuestionsBoardActionTypes.SET_QUESTIONS_BOARD_STEP_COLLAPSE;
  payload: {
    questionsBoardId: string;
    questionsBoardStepId: string;
    value: boolean;
  };

  /**
   * Create a new SetQuestionsBoardStepCollapseAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param questionsBoardStepId
   *    the updated questions board step
   */
  constructor(questionsBoardId: string, questionsBoardStepId: string, value: boolean) {
    this.payload = { questionsBoardId, questionsBoardStepId, value };
  }
}


/**
 * A ngrx action to clear all step plans collapse
 */
export class ClearQuestionsBoardStepCollapseAction implements Action {
  type = QuestionsBoardActionTypes.CLEAR_QUESTIONS_BOARD_STEP_COLLAPSE;
}


/**
 * A ngrx action to init questions board's compare
 */
export class InitCompareAction implements Action {
  type = QuestionsBoardActionTypes.INIT_COMPARE_QUESTIONS_BOARD;
  payload: {
    questionsBoardId: string;
    compareQuestionsBoardId: string;
    activeQuestionBoardId: string;
  };

  /**
   * Create a new InitCompareAction
   *
   * @param questionsBoardId
   *    the base questions board's id to compare
   * @param compareQuestionsBoardId
   *    the questions board's id to compare with the current one
   * @param activeQuestionBoardId
   *    the loaded question board's id in the interface
   */
  constructor(questionsBoardId: string, compareQuestionsBoardId: string, activeQuestionBoardId: string) {
    this.payload = { questionsBoardId, compareQuestionsBoardId, activeQuestionBoardId };
  }
}

/**
 * A ngrx action for init error
 */
export class InitCompareErrorAction implements Action {
  type = QuestionsBoardActionTypes.INIT_COMPARE_QUESTIONS_BOARD_ERROR;
}

/**
 * A ngrx action for clearing state
 */
export class ClearQuestionBoardAction implements Action {
  type = QuestionsBoardActionTypes.CLEAR_QUESTIONS_BOARD;
}

/**
 * A ngrx action for init success
 */
export class InitCompareSuccessAction implements Action {
  type = QuestionsBoardActionTypes.INIT_COMPARE_QUESTIONS_BOARD_SUCCESS;
  payload: {
    questionsBoardId: string;
    steps: QuestionsBoardStep[];
  };

  /**
   * Create a new InitCompareSuccessAction
   *
   * @param questionsBoardId
   *    the questions board's id
   * @param steps
   *    the list of steps objects
   */
  constructor(questionsBoardId: string, steps: QuestionsBoardStep[]) {
    this.payload = { questionsBoardId, steps };
  }
}


/**
 * A ngrx action for init success
 */
export class StopCompareQuestionsBoardAction implements Action {
  type = QuestionsBoardActionTypes.STOP_COMPARE_QUESTIONS_BOARD;
  payload: {
    id: string;
  };

  /**
   * Create a new StopCompareQuestionsBoardAction
   *
   * @param id
   *    the Item id of the questions board generated
   */
  constructor(id: string) {
    this.payload = { id };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type QuestionsBoardActions
  = AddQuestionsBoardTaskAction
  | AddQuestionsBoardTaskErrorAction
  | AddQuestionsBoardTaskSuccessAction
  | GenerateQuestionsBoardTaskAction
  | GenerateQuestionsBoardTaskErrorAction
  | GenerateQuestionsBoardTaskSuccessAction
  | InitQuestionsBoardAction
  | InitQuestionsBoardErrorAction
  | InitQuestionsBoardSuccessAction
  | NormalizeQuestionsBoardObjectsOnRehydrateAction
  | PatchQuestionsBoardStepMetadataAction
  | PatchQuestionsBoardStepMetadataErrorAction
  | PatchQuestionsBoardStepMetadataSuccessAction
  | RetrieveQuestionsBoardAction
  | RemoveQuestionsBoardTaskAction
  | RemoveQuestionsBoardTaskErrorAction
  | RemoveQuestionsBoardTaskSuccessAction
  | UpdateQuestionsBoardStepAction
  | OrderQuestionsBoardTasksAction
  | OrderQuestionsBoardTasksSuccessAction
  | OrderQuestionsBoardTasksErrorAction
  | SetQuestionsBoardStepCollapseAction
  | ClearQuestionsBoardStepCollapseAction
  | InitCompareAction
  | InitCompareSuccessAction
  | InitCompareErrorAction
  | StopCompareQuestionsBoardAction
  | ClearQuestionBoardAction;
