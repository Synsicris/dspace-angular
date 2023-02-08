import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { Item } from '../../core/shared/item.model';
import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { MetadataMap } from '../../core/shared/metadata.models';
import { ImpactPathwayLink } from './impact-pathway.reducer';
import { ImpactPathwayStep } from './models/impact-pathway-step.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ImpactPathwayActionTypes = {
  GENERATE_IMPACT_PATHWAY: type('dspace/impactpathway/GENERATE_IMPACT_PATHWAY'),
  GENERATE_IMPACT_PATHWAY_SUCCESS: type('dspace/impactpathway/GENERATE_IMPACT_PATHWAY_SUCCESS'),
  GENERATE_IMPACT_PATHWAY_ERROR: type('dspace/impactpathway/GENERATE_IMPACT_PATHWAY_ERROR'),
  CLEAR_IMPACT_PATHWAY: type('dspace/impactpathway/CLEAR_IMPACT_PATHWAY'),
  INIT_IMPACT_PATHWAY: type('dspace/impactpathway/INIT_IMPACT_PATHWAY'),
  INIT_IMPACT_PATHWAY_SUCCESS: type('dspace/impactpathway/INIT_IMPACT_PATHWAY_SUCCESS'),
  INIT_IMPACT_PATHWAY_ERROR: type('dspace/impactpathway/INIT_IMPACT_PATHWAY_ERROR'),
  GENERATE_IMPACT_PATHWAY_TASK: type('dspace/impactpathway/GENERATE_IMPACT_PATHWAY_TASK'),
  GENERATE_IMPACT_PATHWAY_TASK_SUCCESS: type('dspace/impactpathway/GENERATE_IMPACT_PATHWAY_TASK_SUCCESS'),
  GENERATE_IMPACT_PATHWAY_TASK_ERROR: type('dspace/impactpathway/GENERATE_IMPACT_PATHWAY_TASK_ERROR'),
  GENERATE_IMPACT_PATHWAY_SUB_TASK: type('dspace/impactpathway/GENERATE_IMPACT_PATHWAY_SUB_TASK'),
  GENERATE_IMPACT_PATHWAY_SUB_TASK_SUCCESS: type('dspace/impactpathway/GENERATE_IMPACT_PATHWAY_SUB_TASK_SUCCESS'),
  ADD_IMPACT_PATHWAY_TASK: type('dspace/impactpathway/ADD_IMPACT_PATHWAY_TASK'),
  ADD_IMPACT_PATHWAY_TASK_SUCCESS: type('dspace/impactpathway/ADD_IMPACT_PATHWAY_TASK_SUCCESS'),
  ADD_IMPACT_PATHWAY_TASK_ERROR: type('dspace/impactpathway/ADD_IMPACT_PATHWAY_TASK_ERROR'),
  ADD_IMPACT_PATHWAY_SUB_TASK: type('dspace/impactpathway/ADD_IMPACT_PATHWAY_SUB_TASK'),
  ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS: type('dspace/impactpathway/ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS'),
  ADD_IMPACT_PATHWAY_SUB_TASK_ERROR: type('dspace/impactpathway/ADD_IMPACT_PATHWAY_SUB_TASK_ERROR'),
  MOVE_IMPACT_PATHWAY_SUB_TASK: type('dspace/impactpathway/MOVE_IMPACT_PATHWAY_SUB_TASK'),
  MOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS: type('dspace/impactpathway/MOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS'),
  MOVE_IMPACT_PATHWAY_SUB_TASK_ERROR: type('dspace/impactpathway/MOVE_IMPACT_PATHWAY_SUB_TASK_ERROR'),
  NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE: type('dspace/impactpathway/NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE'),
  ORDER_IMPACT_PATHWAY_TASKS: type('dspace/impactpathway/ORDER_IMPACT_PATHWAY_TASKS'),
  ORDER_IMPACT_PATHWAY_TASKS_SUCCESS: type('dspace/impactpathway/ORDER_IMPACT_PATHWAY_TASKS_SUCCESS'),
  ORDER_IMPACT_PATHWAY_TASKS_ERROR: type('dspace/impactpathway/ORDER_IMPACT_PATHWAY_TASKS_ERROR'),
  ORDER_IMPACT_PATHWAY_SUB_TASKS: type('dspace/impactpathway/ORDER_IMPACT_PATHWAY_SUB_TASKS'),
  ORDER_IMPACT_PATHWAY_SUB_TASKS_SUCCESS: type('dspace/impactpathway/ORDER_IMPACT_PATHWAY_SUB_TASKS_SUCCESS'),
  ORDER_IMPACT_PATHWAY_SUB_TASKS_ERROR: type('dspace/impactpathway/ORDER_IMPACT_PATHWAY_SUB_TASKS_ERROR'),
  REMOVE_IMPACT_PATHWAY: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY'),
  REMOVE_IMPACT_PATHWAY_SUCCESS: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_SUCCESS'),
  REMOVE_IMPACT_PATHWAY_ERROR: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_ERROR'),
  REMOVE_IMPACT_PATHWAY_STEP: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_STEP'),
  REMOVE_IMPACT_PATHWAY_STEP_SUCCESS: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_STEP_SUCCESS'),
  REMOVE_IMPACT_PATHWAY_STEP_ERROR: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_STEP_ERROR'),
  REMOVE_IMPACT_PATHWAY_TASK: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_TASK'),
  REMOVE_IMPACT_PATHWAY_TASK_SUCCESS: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_TASK_SUCCESS'),
  REMOVE_IMPACT_PATHWAY_SUB_TASK: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_SUB_TASK'),
  REMOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS'),
  REMOVE_IMPACT_PATHWAY_TASK_ERROR: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_TASK_ERROR'),
  PATCH_IMPACT_PATHWAY_METADATA: type('dspace/impactpathway/PATCH_IMPACT_PATHWAY_METADATA'),
  PATCH_IMPACT_PATHWAY_METADATA_SUCCESS: type('dspace/impactpathway/PATCH_IMPACT_PATHWAY_METADATA_SUCCESS'),
  PATCH_IMPACT_PATHWAY_METADATA_ERROR: type('dspace/impactpathway/PATCH_IMPACT_PATHWAY_METADATA_ERROR'),
  PATCH_IMPACT_PATHWAY_TASK_METADATA: type('dspace/impactpathway/PATCH_IMPACT_PATHWAY_TASK_METADATA'),
  PATCH_IMPACT_PATHWAY_TASK_METADATA_SUCCESS: type('dspace/impactpathway/PATCH_IMPACT_PATHWAY_TASK_METADATA_SUCCESS'),
  PATCH_IMPACT_PATHWAY_TASK_METADATA_ERROR: type('dspace/impactpathway/PATCH_IMPACT_PATHWAY_TASK_METADATA_ERROR'),
  UPDATE_IMPACT_PATHWAY: type('dspace/impactpathway/UPDATE_IMPACT_PATHWAY'),
  UPDATE_IMPACT_PATHWAY_TASK: type('dspace/impactpathway/UPDATE_IMPACT_PATHWAY_TASK'),
  UPDATE_IMPACT_PATHWAY_SUB_TASK: type('dspace/impactpathway/UPDATE_IMPACT_PATHWAY_SUB_TASK'),
  ADD_IMPACT_PATHWAY_TASK_LINKS: type('dspace/impactpathway/ADD_IMPACT_PATHWAY_TASK_LINKS'),
  ADD_IMPACT_PATHWAY_TASK_LINK: type('dspace/impactpathway/ADD_IMPACT_PATHWAY_TASK_LINK'),
  REMOVE_IMPACT_PATHWAY_TASK_LINK: type('dspace/impactpathway/REMOVE_IMPACT_PATHWAY_TASK_LINK'),
  EDIT_IMPACT_PATHWAY_TASK_LINKS: type('dspace/impactpathway/EDIT_IMPACT_PATHWAY_TASK_LINKS'),
  COMPLETE_EDITING_IMPACT_PATHWAY_TASK_LINKS: type('dspace/impactpathway/COMPLETE_EDITING_IMPACT_PATHWAY_TASK_LINKS'),
  SAVE_IMPACT_PATHWAY_TASK_LINKS: type('dspace/impactpathway/SAVE_IMPACT_PATHWAY_TASK_LINKS'),
  SAVE_IMPACT_PATHWAY_TASK_LINKS_SUCCESS: type('dspace/impactpathway/SAVE_IMPACT_PATHWAY_TASK_LINKS_SUCCESS'),
  SAVE_IMPACT_PATHWAY_TASK_LINKS_ERROR: type('dspace/impactpathway/SAVE_IMPACT_PATHWAY_TASK_LINKS_ERROR'),
  TOGGLE_IMPACT_PATHWAY_TASK_LINKS_VIEW: type('dspace/impactpathway/TOGGLE_IMPACT_PATHWAY_TASK_LINKS_VIEW'),
  SET_IMPACT_PATHWAY_TARGET_TASK: type('dspace/impactpathway/SET_IMPACT_PATHWAY_TARGET_TASK'),
  SET_IMPACT_PATHWAY_TASK_COLLAPSE: type('dspace/impactpathway/SET_IMPACT_PATHWAY_TASK_COLLAPSE'),
  CLEAR_IMPACT_PATHWAY_TASK_COLLAPSE: type('dspace/impactpathway/CLEAR_IMPACT_PATHWAY_TASK_COLLAPSE'),
  INIT_COMPARE_IMPACT_PATHWAY: type('dspace/impactpathway/INIT_COMPARE_IMPACT_PATHWAY'),
  INIT_COMPARE_IMPACT_PATHWAY_ERROR: type('dspace/impactpathway/INIT_COMPARE_IMPACT_PATHWAY_ERROR'),
  INIT_COMPARE_IMPACT_PATHWAY_SUCCESS: type('dspace/impactpathway/INIT_COMPARE_IMPACT_PATHWAY_SUCCESS'),
  STOP_COMPARE_IMPACT_PATHWAY: type('dspace/impactpathway/STOP_COMPARE_IMPACT_PATHWAY'),
  INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK: type('dspace/impactpathway/INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK'),
  INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK_ERROR: type('dspace/impactpathway/INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK_ERROR'),
  INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK_SUCCESS: type('dspace/impactpathway/INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK_SUCCESS'),
  STOP_COMPARE_IMPACT_PATHWAY_STEP_TASK: type('dspace/impactpathway/STOP_COMPARE_IMPACT_PATHWAY_STEP_TASK'),
};

/* tslint:disable:max-classes-per-file */

/**
 * A ngrx action to clear the impact pathway state
 */
export class ClearImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.CLEAR_IMPACT_PATHWAY;
}

/**
 * A ngrx action to generate a impact pathway objects
 */
export class GenerateImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY;
  payload: {
    projectId: string;
    name: string;
  };

  /**
   * Create a new GenerateImpactPathwayAction
   *
   * @param projectId
   *    the project's UUID where to create the object
   * @param name
   *    the impact pathway's title
   */
  constructor(projectId: string, name: string) {
    this.payload = { projectId, name };
  }
}

/**
 * A ngrx action for generate success
 */
export class GenerateImpactPathwaySuccessAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUCCESS;
  payload: {
    projectId: string;
    item: Item;
  };

  /**
   * Create a new GenerateImpactPathwaySuccessAction
   *
   * @param projectId
   *    the project's UUID where to create the object
   * @param item
   *    the Item of the impact pathway generated
   */
  constructor(projectId: string, item: Item) {
    this.payload = { projectId, item };
  }
}

/**
 * A ngrx action for generate error
 */
export class GenerateImpactPathwayErrorAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_ERROR;

}

/**
 * A ngrx action to init impact pathway's model objects
 */
export class InitImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY;
  payload: {
    item: Item;
    withTarget: boolean
  };

  /**
   * Create a new InitImpactPathwayAction
   *
   * @param item
   *    the Item of the impact pathway generated
   * @param withTarget
   *    if impact pathway generated has an item target
   */
  constructor(item: Item, withTarget = false) {
    this.payload = { item, withTarget };
  }
}



/**
 * A ngrx action for init success
 */
export class StopCompareImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.STOP_COMPARE_IMPACT_PATHWAY;
  payload: {
    id: string;
  };

  /**
   * Create a new InitImpactPathwaySuccessAction
   *
   * @param id
   *    the Item id of the impact pathway generated
   */
  constructor(id: string) {
    this.payload = { id };
  }
}

/**
 * A ngrx action for init success
 */
export class InitImpactPathwaySuccessAction implements Action {
  type = ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY_SUCCESS;
  payload: {
    id: string;
    impactPathwayObj: ImpactPathway
  };

  /**
   * Create a new InitImpactPathwaySuccessAction
   *
   * @param id
   *    the Item id of the impact pathway generated
   * @param impactPathwayObj
   *    the impact pathway object
   */
  constructor(id: string, impactPathwayObj: ImpactPathway) {
    this.payload = { id, impactPathwayObj };
  }
}

/**
 * A ngrx action for init error
 */
export class InitImpactPathwayErrorAction implements Action {
  type = ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY_ERROR;
}

/**
 * A ngrx action to generate a impact pathway objects
 */
export class GenerateImpactPathwayTaskAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK;
  payload: {
    projectId: string;
    impactPathwayId: string;
    stepId: string;
    taskType: string;
    metadata: MetadataMap
  };

  /**
   * Create a new GenerateImpactPathwayTaskAction
   *
   * @param projectId
   *    the project's UUID where to create the object
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param taskType
   *    the impact pathway task's type
   * @param metadata: Metadata
   *    the impact pathway task's Metadata
   */
  constructor(projectId: string, impactPathwayId: string, stepId: string, taskType: string, metadata: MetadataMap) {
    this.payload = { projectId, impactPathwayId, stepId, taskType, metadata };
  }
}

/**
 * A ngrx action for generate success
 */
export class GenerateImpactPathwayTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    item: Item;
  };

  /**
   * Create a new GenerateImpactPathwayTaskSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param item
   *    the Item of the impact pathway task generated
   */
  constructor(impactPathwayId: string, stepId: string, item: Item) {
    this.payload = { impactPathwayId, stepId, item };
  }
}

/**
 * A ngrx action for generate error
 */
export class GenerateImpactPathwayTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_ERROR;
}

/**
 * A ngrx action to generate a impact pathway objects
 */
export class GenerateImpactPathwaySubTaskAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK;
  payload: {
    projectId: string;
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    taskType: string;
    metadata: MetadataMap;
  };

  /**
   * Create a new GenerateImpactPathwaySubTaskAction
   *
   * @param projectId
   *    the project's UUID where to create the object
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param parentTaskId
   *    the impact pathway parent task's id
   * @param taskType
   *    the impact pathway task's type
   * @param metadata: Metadata
   *    the impact pathway task's Metadata
   */
  constructor(
    projectId: string,
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    taskType: string,
    metadata: MetadataMap,
  ) {
    this.payload = { projectId, impactPathwayId, stepId, parentTaskId, taskType, metadata };
  }
}

/**
 * A ngrx action for generate success
 */
export class GenerateImpactPathwaySubTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    item: Item;
  };

  /**
   * Create a new GenerateImpactPathwaySubTaskSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param parentTaskId
   *    the impact pathway parent task's id
   * @param item
   *    the Item of the impact pathway task generated
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, item: Item) {
    this.payload = { impactPathwayId, stepId, parentTaskId, item };
  }
}

/**
 * A ngrx action for generate success
 */
export class AddImpactPathwayTaskAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    taskId: string;
  };

  /**
   * Create a new AddImpactPathwayTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id to whom to add task
   * @param taskId
   *    the Item id of the impact pathway task to add
   */
  constructor(impactPathwayId: string, stepId: string, taskId: string) {
    this.payload = { impactPathwayId, stepId, taskId };
  }
}

/**
 * A ngrx action for generate success
 */
export class AddImpactPathwayTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    task: ImpactPathwayTask;
  };

  /**
   * Create a new AddImpactPathwayTaskSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id to whom to add task
   * @param task
   *    the ImpactPathwayTask object to add
   */
  constructor(impactPathwayId: string, stepId: string, task: ImpactPathwayTask) {
    this.payload = { impactPathwayId, stepId, task };
  }
}

/**
 * A ngrx action for generate error
 */
export class AddImpactPathwayTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_ERROR;
}

/**
 * A ngrx action for generate success
 */
export class AddImpactPathwaySubTaskAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    taskId: string;
  };

  /**
   * Create a new AddImpactPathwaySubTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id to whom to add task
   * @param parentTaskId
   *    the impact pathway parent task's id
   * @param taskId
   *    the Item id of the impact pathway task to add
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, taskId: string) {
    this.payload = { impactPathwayId, stepId, parentTaskId, taskId };
  }
}

/**
 * A ngrx action for generate success
 */
export class AddImpactPathwaySubTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    task: ImpactPathwayTask;
  };

  /**
   * Create a new AddImpactPathwaySubTaskSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id to whom to add task
   * @param parentTaskId
   *    the impact pathway parent task's id
   * @param task
   *    the ImpactPathwayTask object to add
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, task: ImpactPathwayTask) {
    this.payload = { impactPathwayId, stepId, parentTaskId, task };
  }
}

/**
 * A ngrx action for generate error
 */
export class AddImpactPathwaySubTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_ERROR;
}

/**
 * A ngrx action for moving task
 */
export class MoveImpactPathwaySubTaskAction implements Action {
  type = ImpactPathwayActionTypes.MOVE_IMPACT_PATHWAY_SUB_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    newParentTaskId: string;
    taskId: string;
  };

  /**
   * Create a new MoveImpactPathwaySubTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param parentTaskId
   *    the impact pathway parent task's id from to delete task
   * @param newParentTaskId
   *    the impact pathway parent task's id where to add task
   * @param taskId
   *    the Item id of the impact pathway task to move
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    newParentTaskId: string,
    taskId: string
  ) {
    this.payload = { impactPathwayId, stepId, parentTaskId, newParentTaskId, taskId };
  }
}

/**
 * A ngrx action for move success
 */
export class MoveImpactPathwaySubTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.MOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS;
}

/**
 * A ngrx action to restore task moving
 */
export class MoveImpactPathwaySubTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.MOVE_IMPACT_PATHWAY_SUB_TASK_ERROR;
  payload: {
    impactPathwayId: string;
    stepId: string;
    previousParentTaskId: string;
    currentParentTaskId: string;
    taskId: string;
  };

  /**
   * Create a new MoveImpactPathwaySubTaskErrorAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param previousParentTaskId
   *    the impact pathway parent task's id where to restore task
   * @param currentParentTaskId
   *    the impact pathway parent task's id from where to remove task
   * @param taskId
   *    the Item id of the impact pathway task to restore
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    previousParentTaskId: string,
    currentParentTaskId: string,
    taskId: string
  ) {
    this.payload = { impactPathwayId, stepId, previousParentTaskId, currentParentTaskId, taskId };
  }
}


/**
 * A ngrx action for ordering tasks
 */
export class OrderImpactPathwayTasksAction implements Action {
  type = ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_TASKS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    currentTasks: ImpactPathwayTask[];
    previousTasks: ImpactPathwayTask[];
  };

  /**
   * Create a new OrderImpactPathwayTasksAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id where to order task
   * @param currentTasks
   *    the list of the impact pathway tasks in the new order
   * @param previousTasks
   *    the list of the impact pathway tasks in the previous order to restore in case of error
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    currentTasks: ImpactPathwayTask[],
    previousTasks: ImpactPathwayTask[]
  ) {
    this.payload = { impactPathwayId, stepId, currentTasks, previousTasks };
  }
}

/**
 * A ngrx action for ordering success
 */
export class OrderImpactPathwayTasksSuccessAction implements Action {
  type = ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_TASKS_SUCCESS;
}

/**
 * A ngrx action for ordering tasks error
 */
export class OrderImpactPathwayTasksErrorAction implements Action {
  type = ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_TASKS_ERROR;
  payload: {
    impactPathwayId: string;
    stepId: string;
    previousTasks: ImpactPathwayTask[];
  };

  /**
   * Create a new OrderImpactPathwayTasksErrorAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param previousTasks
   *    the list of the impact pathway tasks in the previous order to restore
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    previousTasks: ImpactPathwayTask[]
  ) {
    this.payload = { impactPathwayId, stepId, previousTasks };
  }
}

/**
 * A ngrx action for ordering subtasks
 */
export class OrderImpactPathwaySubTasksAction implements Action {
  type = ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_SUB_TASKS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    currentTasks: ImpactPathwayTask[];
    previousTasks: ImpactPathwayTask[];
  };

  /**
   * Create a new OrderImpactPathwaySubTasksAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param parentTaskId
   *    the impact pathway parent task's id where to order task
   * @param currentTasks
   *    the list of the impact pathway tasks in the new order
   * @param previousTasks
   *    the list of the impact pathway tasks in the previous order to restore in case of error
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    currentTasks: ImpactPathwayTask[],
    previousTasks: ImpactPathwayTask[]
  ) {
    this.payload = { impactPathwayId, stepId, parentTaskId, currentTasks, previousTasks };
  }
}

/**
 * A ngrx action for ordering success
 */
export class OrderImpactPathwaySubTasksSuccessAction implements Action {
  type = ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_SUB_TASKS_SUCCESS;
}

/**
 * A ngrx action for ordering tasks error
 */
export class OrderImpactPathwaySubTasksErrorAction implements Action {
  type = ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_SUB_TASKS_ERROR;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    previousTasks: ImpactPathwayTask[];
  };

  /**
   * Create a new OrderImpactPathwaySubTasksErrorAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param parentTaskId
   *    the impact pathway parent task's id where to order task
   * @param previousTasks
   *    the list of the impact pathway tasks in the previous order to restore
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    previousTasks: ImpactPathwayTask[]
  ) {
    this.payload = { impactPathwayId, stepId, parentTaskId, previousTasks };
  }
}

/**
 * A ngrx action for removing task
 */
export class RemoveImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY;
  payload: {
    projectItemId: string;
    impactPathwayId: string;
  };

  /**
   * Create a new RemoveImpactPathwayAction
   *
   * @param projectItemId
   *    the project item's id whom the impact pathway belong to
   * @param impactPathwayId
   *    the impact pathway's id
   */
  constructor(projectItemId: string, impactPathwayId: string) {
    this.payload = { projectItemId, impactPathwayId };
  }
}

/**
 * A ngrx action for remove success
 */
export class RemoveImpactPathwaySuccessAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUCCESS;
  payload: {
    projectItemId: string;
    impactPathwayId: string;
  };

  /**
   * Create a new RemoveImpactPathwaySuccessAction
   *
   * @param projectItemId
   *    the project item's id whom the impact pathway belong to
   * @param impactPathwayId
   *    the impact pathway's id
   */
  constructor(projectItemId: string, impactPathwayId: string) {
    this.payload = { projectItemId, impactPathwayId };
  }
}

/**
 * A ngrx action for remove error
 */
export class RemoveImpactPathwayErrorAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_ERROR;
}

/**
 * A ngrx action for removing task
 */
export class RemoveImpactPathwayStepAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_STEP;
  payload: {
    impactPathwayId: string;
    stepId: string;
  };

  /**
   * Create a new RemoveImpactPathwayStepAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   */
  constructor(impactPathwayId: string, stepId: string) {
    this.payload = { impactPathwayId, stepId };
  }
}

/**
 * A ngrx action for remove success
 */
export class RemoveImpactPathwayStepSuccessAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_STEP_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
  };

  /**
   * Create a new RemoveImpactPathwayStepSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   */
  constructor(impactPathwayId: string, stepId: string) {
    this.payload = { impactPathwayId, stepId };
  }
}

/**
 * A ngrx action for remove error
 */
export class RemoveImpactPathwayStepErrorAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_STEP_ERROR;
}

/**
 * A ngrx action for removing task
 */
export class RemoveImpactPathwayTaskAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK;
  payload: {
    impactPathwayId: string;
    parentId: string;
    taskId: string;
    taskPosition: number;
  };

  /**
   * Create a new RemoveImpactPathwayTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param parentId
   *    the impact pathway task's parent id from where to remove task
   * @param taskId
   *    the Item id of the impact pathway task to remove
   * @param taskPosition
   *    the array position of the impact pathway task
   */
  constructor(impactPathwayId: string, parentId: string, taskId: string, taskPosition: number) {
    this.payload = { impactPathwayId, parentId, taskId, taskPosition };
  }
}

/**
 * A ngrx action for remove success
 */
export class RemoveImpactPathwayTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    parentId: string;
    taskId: string;
  };

  /**
   * Create a new RemoveImpactPathwayTaskSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param parentId
   *    the impact pathway task's parent id from where to remove task
   * @param taskId
   *    the Item id of the impact pathway task to remove
   */
  constructor(impactPathwayId: string, parentId: string, taskId: string) {
    this.payload = { impactPathwayId, parentId, taskId };
  }
}

/**
 * A ngrx action for remove error
 */
export class RemoveImpactPathwayTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_ERROR;
}

/**
 * A ngrx action for removing task
 */
export class RemoveImpactPathwaySubTaskAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUB_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    taskId: string;
    taskPosition: number;
  };

  /**
   * Create a new RemoveImpactPathwaySubTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param parentTaskId
   *    the impact pathway task's parent id from where to remove task
   * @param taskId
   *    the Item id of the impact pathway task to remove
   * @param taskPosition
   *    the array position of the impact pathway task
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, taskId: string, taskPosition: number) {
    this.payload = { impactPathwayId, stepId, parentTaskId, taskId, taskPosition };
  }
}

/**
 * A ngrx action for remove success
 */
export class RemoveImpactPathwaySubTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    taskId: string;
  };

  /**
   * Create a new RemoveImpactPathwaySubTaskSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param parentTaskId
   *    the impact pathway task's parent id from where to remove task
   * @param taskId
   *    the Item id of the impact pathway task to remove
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, taskId: string) {
    this.payload = { impactPathwayId, stepId, parentTaskId, taskId };
  }
}

/**
 * A ngrx action to patch a ImpactPathway's metadata
 */
export class PatchImpactPathwayMetadataAction implements Action {
  type = ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_METADATA;
  payload: {
    impactPathwayId: string,
    oldImpactPathway: ImpactPathway;
    metadata: string;
    metadataIndex: number;
    value: string;
  };

  /**
   * Create a new PatchImpactPathwayMetadataAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param oldImpactPathway
   *    the previous impact pathway version
   * @param metadata
   *    the Item metadata to patch
   * @param metadataIndex
   *    the index of the Item metadata to patch
   * @param value
   *    the new value of the Item metadata to patch
   */
  constructor(
    impactPathwayId: string,
    oldImpactPathway: ImpactPathway,
    metadata: string,
    metadataIndex: number,
    value: string) {
    this.payload = { impactPathwayId, oldImpactPathway, metadata, metadataIndex, value };
  }
}

/**
 * A ngrx action to patch a ImpactPathway's metadata
 */
export class PatchImpactPathwayMetadataSuccessAction implements Action {
  type = ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_METADATA_SUCCESS;
  payload: {
    impactPathwayId: string,
    oldImpactPathway: ImpactPathway;
    item: Item;
  };

  /**
   * Create a new PatchImpactPathwayMetadataSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param oldImpactPathway
   *    the previous impact pathway version
   * @param item
   *    the patched item
   */
  constructor(
    impactPathwayId: string,
    oldImpactPathway: ImpactPathway,
    item: Item) {
    this.payload = { impactPathwayId, oldImpactPathway, item };
  }
}

/**
 * A ngrx action for patch error
 */
export class PatchImpactPathwayMetadataErrorAction implements Action {
  type = ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_METADATA_ERROR;
}

/**
 * A ngrx action to patch a task's metadata
 */
export class PatchImpactPathwayTaskMetadataAction implements Action {
  type = ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_TASK_METADATA;
  payload: {
    impactPathwayId: string;
    stepId: string;
    taskId: string;
    oldTask: ImpactPathwayTask;
    metadata: string;
    metadataIndex: number;
    value: string;
    parentTaskId?: string;
  };

  /**
   * Create a new PatchImpactPathwayTaskMetadataAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param taskId
   *    the Item id of the impact pathway task to patch
   * @param oldTask
   *    the previous impact pathway task version
   * @param metadata
   *    the Item metadata to patch
   * @param metadataIndex
   *    the index of the Item metadata to patch
   * @param value
   *    the new value of the Item metadata to patch
   * @param parentTaskId
   *    the impact pathway task's parent id from where to patch task
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    taskId: string,
    oldTask: ImpactPathwayTask,
    metadata: string,
    metadataIndex: number,
    value: string,
    parentTaskId?: string) {
    this.payload = { impactPathwayId, stepId, taskId, oldTask, metadata, metadataIndex, value, parentTaskId };
  }
}

/**
 * A ngrx action to patch a task's metadata
 */
export class PatchImpactPathwayTaskMetadataSuccessAction implements Action {
  type = ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_TASK_METADATA_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    taskId: string;
    oldTask: ImpactPathwayTask;
    item: Item;
    parentTaskId?: string;
  };

  /**
   * Create a new PatchImpactPathwayTaskMetadataSuccessAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param taskId
   *    the Item id of the impact pathway task to patch
   * @param oldTask
   *    the previous impact pathway task version
   * @param item
   *    the patched item
   * @param parentTaskId
   *    the impact pathway task's parent id from where to patch task
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    taskId: string,
    oldTask: ImpactPathwayTask,
    item: Item,
    parentTaskId?: string) {
    this.payload = { impactPathwayId, stepId, taskId, oldTask, item, parentTaskId };
  }
}

/**
 * A ngrx action for patch error
 */
export class PatchImpactPathwayTaskMetadataErrorAction implements Action {
  type = ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_TASK_METADATA_ERROR;
}

/**
 * A ngrx action to update a task
 */
export class UpdateImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.UPDATE_IMPACT_PATHWAY;
  payload: {
    impactPathwayId: string;
    impactPathway: ImpactPathway;
  };

  /**
   * Create a new UpdateImpactPathwayAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param impactPathway
   *    the updated impact pathway
   */
  constructor(impactPathwayId: string, impactPathway: ImpactPathway) {
    this.payload = { impactPathwayId, impactPathway };
  }
}

/**
 * A ngrx action to update a task
 */
export class UpdateImpactPathwayTaskAction implements Action {
  type = ImpactPathwayActionTypes.UPDATE_IMPACT_PATHWAY_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    taskId: string;
    task: ImpactPathwayTask;
  };

  /**
   * Create a new UpdateImpactPathwayTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id where to update task
   * @param taskId
   *    the Item id of the impact pathway task to add
   * @param task
   *    the updated impact pathway task
   */
  constructor(impactPathwayId: string, stepId: string, taskId: string, task: ImpactPathwayTask) {
    this.payload = { impactPathwayId, stepId, taskId, task };
  }
}

/**
 * A ngrx action to update a task
 */
export class UpdateImpactPathwaySubTaskAction implements Action {
  type = ImpactPathwayActionTypes.UPDATE_IMPACT_PATHWAY_SUB_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    taskId: string;
    task: ImpactPathwayTask;
  };

  /**
   * Create a new UpdateImpactPathwaySubTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param parentTaskId
   *    the impact pathway task's parent id where to update task
   * @param taskId
   *    the Item id of the impact pathway task to add
   * @param task
   *    the updated impact pathway task
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, taskId: string, task: ImpactPathwayTask) {
    this.payload = { impactPathwayId, stepId, parentTaskId, taskId, task };
  }
}

/**
 * A ngrx action to enable editing of relation between task
 */
export class AddImpactPathwayTaskLinksAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_LINKS;
  payload: {
    links: ImpactPathwayLink[];
  };

  /**
   * Create a new InitImpactPathwayTaskLinksAction
   *
   * @param links
   *    the impact pathway task links
   */
  constructor(links: ImpactPathwayLink[]) {
    this.payload = { links };
  }
}

/**
 * A ngrx action to enable editing of relation between task
 */
export class AddImpactPathwayTaskLinkAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_LINK;
  payload: {
    targetImpactPathwayTaskHTMLId: string;
    targetImpactPathwayId: string;
    targetImpactPathwayStepId: string;
    targetImpactPathwayTaskId: string;
    targetImpactPathwayTaskTitle: string;
  };

  /**
   * Create a new AddImpactPathwayTaskLinkAction
   *
   * @param targetImpactPathwayTaskHTMLId
   *    the impact pathway task HTML div's id
   * @param targetImpactPathwayId
   *    the impact pathway's id
   * @param targetImpactPathwayStepId
   *    the impact pathway step's id
   * @param targetImpactPathwayTaskId
   *    the impact pathway task's id
   * @param targetImpactPathwayTaskTitle
   *    the impact pathway task's title
   */
  constructor(
    targetImpactPathwayTaskHTMLId: string,
    targetImpactPathwayId: string,
    targetImpactPathwayStepId: string,
    targetImpactPathwayTaskId: string,
    targetImpactPathwayTaskTitle: string
  ) {
    this.payload = {
      targetImpactPathwayTaskHTMLId,
      targetImpactPathwayId,
      targetImpactPathwayStepId,
      targetImpactPathwayTaskId,
      targetImpactPathwayTaskTitle
    };
  }
}

/**
 * A ngrx action to enable editing of relation between task
 */
export class RemoveImpactPathwayTaskLinkAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_LINK;
  payload: {
    targetImpactPathwayTaskHTMLId: string;
    targetImpactPathwayTaskId: string;
  };

  /**
   * Create a new RemoveImpactPathwayTaskLinkAction
   *
   * @param targetImpactPathwayTaskHTMLId
   *    the impact pathway task HTML div's id
   * @param targetImpactPathwayTaskId
   *    the impact pathway task's id
   */
  constructor(targetImpactPathwayTaskHTMLId: string, targetImpactPathwayTaskId: string) {
    this.payload = { targetImpactPathwayTaskHTMLId, targetImpactPathwayTaskId };
  }
}

/**
 * A ngrx action to enable editing of relation between task
 */
export class EditImpactPathwayTaskLinksAction implements Action {
  type = ImpactPathwayActionTypes.EDIT_IMPACT_PATHWAY_TASK_LINKS;
  payload: {
    impactPathwayId: string;
    impactPathwayStepId: string;
    selectedTwoWay: boolean;
    impactPathwayTaskHTMLId: string;
    impactPathwayTaskId: string;
  };

  /**
   * Create a new EditImpactPathwayTaskLinksAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param impactPathwayStepId
   *    the impact pathway step's id
   * @param selectedTwoWay
   *    if is two way relation or not
   * @param impactPathwayTaskHTMLId
   *    the impact pathway task HTML div's id
   * @param impactPathwayTaskId
   *    the impact pathway task's id
   */
  constructor(
    impactPathwayId: string,
    impactPathwayStepId: string,
    selectedTwoWay: boolean,
    impactPathwayTaskHTMLId: string,
    impactPathwayTaskId: string
  ) {
    this.payload = { impactPathwayId, impactPathwayStepId, selectedTwoWay, impactPathwayTaskHTMLId, impactPathwayTaskId };
  }
}

/**
 * A ngrx action to complete editing relation between task
 */
export class CompleteEditingImpactPathwayTaskLinksAction implements Action {
  type = ImpactPathwayActionTypes.COMPLETE_EDITING_IMPACT_PATHWAY_TASK_LINKS;

}

/**
 * A ngrx action to change the state of the visualization of relations
 */
export class ToggleImpactPathwayTaskLinksViewAction implements Action {
  type = ImpactPathwayActionTypes.TOGGLE_IMPACT_PATHWAY_TASK_LINKS_VIEW;

}

/**
 * A ngrx action to enable editing of relation between task
 */
export class SaveImpactPathwayTaskLinksAction implements Action {
  type = ImpactPathwayActionTypes.SAVE_IMPACT_PATHWAY_TASK_LINKS;
  payload: {
    impactPathwayTaskId: string;
    toSave: ImpactPathwayLink[];
    toDelete: ImpactPathwayLink[];
  };

  /**
   * Create a new SaveImpactPathwayTaskLinksAction
   *
   * @param impactPathwayTaskId
   *    the impact pathway task's id
   * @param toSave
   *    the list of relations to save
   * @param toDelete
   *    the list of relations to delete
   */
  constructor(impactPathwayTaskId: string, toSave: ImpactPathwayLink[], toDelete: ImpactPathwayLink[]) {
    this.payload = { impactPathwayTaskId, toSave, toDelete };
  }
}

/**
 * A ngrx action to confirm links save
 */
export class SaveImpactPathwayTaskLinksSuccessAction implements Action {
  type = ImpactPathwayActionTypes.SAVE_IMPACT_PATHWAY_TASK_LINKS_SUCCESS;

}

/**
 * A ngrx action for save links error
 */
export class SaveImpactPathwayTaskLinksErrorAction implements Action {
  type = ImpactPathwayActionTypes.SAVE_IMPACT_PATHWAY_TASK_LINKS_ERROR;

}

/**
 * A ngrx action to set target task id
 */
export class SetImpactPathwayTargetTaskAction implements Action {
  type = ImpactPathwayActionTypes.SET_IMPACT_PATHWAY_TARGET_TASK;
  payload: {
    targetTaskId: string;
  };

  /**
   * Create a new GenerateImpactPathwayAction
   *
   * @param targetTaskId
   *    the impact pathway's title
   */
  constructor(targetTaskId: string) {
    this.payload = { targetTaskId };
  }
}

/**
 * A ngrx action to normalize state object on rehydrate
 */
export class NormalizeImpactPathwayObjectsOnRehydrateAction implements Action {
  type = ImpactPathwayActionTypes.NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE;
}


/**
 * A ngrx action to set step plan collapsed value
 */
export class SetImpactPathwaySubTaskCollapseAction implements Action {
  type = ImpactPathwayActionTypes.SET_IMPACT_PATHWAY_TASK_COLLAPSE;
  payload: {
    impactPathwayStepId: string,
    impactPathwayTaskId: string,
    value: boolean;
  };

  /**
   * Create a new SetImpactPathwaySubTaskCollapseAction
   *
   * @param impactPathwayStepId
   *    the impactPathwayStep's id
   * @param impactPathwayTaskId
   *    the impactPathwayTask's id
   * @param value
   *    the collapsed value to be updated
   */
  constructor(impactPathwayStepId: string, impactPathwayTaskId: string, value: boolean) {
    this.payload = { impactPathwayStepId, impactPathwayTaskId, value };
  }
}


/**
 * A ngrx action to clear all task collapse
 */
export class ClearImpactPathwaySubtaskCollapseAction implements Action {
  type = ImpactPathwayActionTypes.CLEAR_IMPACT_PATHWAY_TASK_COLLAPSE;
}

/**
 * A ngrx action to init impact pathway's compare
 */
export class InitCompareAction implements Action {
  type = ImpactPathwayActionTypes.INIT_COMPARE_IMPACT_PATHWAY;
  payload: {
    impactPathwayId: string;
    compareImpactPathwayId: string;
    isVersionOf: boolean;
  };

  /**
   * Create a new InitCompareAction
   *
   * @param impactPathwayId
   *    the base impact pathway's id to compare
   *  @param compareImpactPathwayId
   *    the impact pathway's id to compare with the current one
   * @param isVersionOf
   *    whether the impact pathway's id to compare is a version of item
   */
  constructor(impactPathwayId: string, compareImpactPathwayId: string, isVersionOf: boolean) {
    this.payload = { impactPathwayId, compareImpactPathwayId, isVersionOf };
  }
}

/**
 * A ngrx action for init error
 */
export class InitCompareErrorAction implements Action {
  type = ImpactPathwayActionTypes.INIT_COMPARE_IMPACT_PATHWAY_ERROR;
}

/**
 * A ngrx action for init success
 */
export class InitCompareSuccessAction implements Action {
  type = ImpactPathwayActionTypes.INIT_COMPARE_IMPACT_PATHWAY_SUCCESS;
  payload: {
    impactPathwayId: string;
    steps: ImpactPathwayStep[];
  };

  /**
   * Create a new InitCompareSuccessAction
   *
   * @param impactPathwayId
   *    the base impact pathway's id to compare
   * @param steps
   *    the list of steps objects
   */
  constructor(impactPathwayId: string, steps: ImpactPathwayStep[]) {
    this.payload = { impactPathwayId, steps };
  }
}

export class InitCompareStepTaskAction implements Action {
  type = ImpactPathwayActionTypes.INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK;
  payload: {
    impactPathwayId: string;
    impactPathwayStepId: string;
    compareImpactPathwayStepId: string;
  };

  /**
   * Create a new StopCompareImpactPathwayStepTaskAction
   *
   * @param impactPathwayId
   *    the id of impact pathway that the task belongs to
   * @param impactPathwayStepId
   *    the id of impact pathway step that the task belongs to
   * @param compareImpactPathwayStepId
   *    the impact pathway step's id to compare with the current one
   */
  constructor(impactPathwayId: string, impactPathwayStepId: string, compareImpactPathwayStepId: string) {
    this.payload = { impactPathwayId, impactPathwayStepId, compareImpactPathwayStepId };
  }
}

/**
 * An ngrx action for init StepTask error
 */
export class InitCompareStepTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK_ERROR;
}

/**
 * An ngrx action for init StepTask success
 */
export class InitCompareStepTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.INIT_COMPARE_IMPACT_PATHWAY_STEP_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    impactPathwayStepId: string;
    tasks: ImpactPathwayTask[];
  };

  /**
   * Create a new InitCompareStepTaskSuccessAction
   *
   * @param impactPathwayId
   *    the id of impact pathway that the tasks belong to
   * @param impactPathwayStepId
   *    the id of impact pathway step that the tasks belong to
   * @param tasks
   *    the list of tasks objects
   */
  constructor(impactPathwayId: string, impactPathwayStepId: string, tasks: ImpactPathwayTask[]) {
    this.payload = { impactPathwayId, impactPathwayStepId, tasks };
  }
}

/**
 * An ngrx action for StepTask init success
 */
export class StopCompareImpactPathwayStepTaskAction implements Action {
  type = ImpactPathwayActionTypes.STOP_COMPARE_IMPACT_PATHWAY_STEP_TASK;
  payload: {
    impactPathwayId: string;
    impactPathwayStepId: string;
    impactPathwayStepTaskId: string;
  };


  /**
   * Create a new StopCompareImpactPathwayStepTaskAction
   *
   * @param impactPathwayId
   *    the id of impact pathway that the task belongs to
   * @param impactPathwayStepId
   *    the id of impact pathway step that the task belongs to
   * @param impactPathwayStepTaskId
   *    the id of impact pathway step task
   */
  constructor(impactPathwayId: string, impactPathwayStepId: string, impactPathwayStepTaskId: string) {
    this.payload = { impactPathwayId, impactPathwayStepId, impactPathwayStepTaskId };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type ImpactPathwayActions
  = AddImpactPathwayTaskAction
  | AddImpactPathwayTaskErrorAction
  | AddImpactPathwayTaskSuccessAction
  | AddImpactPathwaySubTaskAction
  | AddImpactPathwaySubTaskErrorAction
  | AddImpactPathwaySubTaskSuccessAction
  | AddImpactPathwayTaskLinkAction
  | AddImpactPathwayTaskLinksAction
  | ClearImpactPathwayAction
  | CompleteEditingImpactPathwayTaskLinksAction
  | EditImpactPathwayTaskLinksAction
  | GenerateImpactPathwayAction
  | GenerateImpactPathwayErrorAction
  | GenerateImpactPathwaySuccessAction
  | GenerateImpactPathwayTaskAction
  | GenerateImpactPathwayTaskErrorAction
  | GenerateImpactPathwayTaskSuccessAction
  | GenerateImpactPathwaySubTaskAction
  | GenerateImpactPathwaySubTaskSuccessAction
  | InitImpactPathwayAction
  | InitImpactPathwaySuccessAction
  | InitImpactPathwayErrorAction
  | MoveImpactPathwaySubTaskAction
  | MoveImpactPathwaySubTaskErrorAction
  | MoveImpactPathwaySubTaskSuccessAction
  | NormalizeImpactPathwayObjectsOnRehydrateAction
  | OrderImpactPathwayTasksAction
  | OrderImpactPathwayTasksErrorAction
  | OrderImpactPathwayTasksSuccessAction
  | OrderImpactPathwaySubTasksAction
  | OrderImpactPathwaySubTasksErrorAction
  | OrderImpactPathwaySubTasksSuccessAction
  | PatchImpactPathwayMetadataAction
  | PatchImpactPathwayMetadataErrorAction
  | PatchImpactPathwayMetadataSuccessAction
  | PatchImpactPathwayTaskMetadataAction
  | PatchImpactPathwayTaskMetadataErrorAction
  | PatchImpactPathwayTaskMetadataSuccessAction
  | RemoveImpactPathwayAction
  | RemoveImpactPathwayErrorAction
  | RemoveImpactPathwaySuccessAction
  | RemoveImpactPathwayStepAction
  | RemoveImpactPathwayStepErrorAction
  | RemoveImpactPathwayStepSuccessAction
  | RemoveImpactPathwaySubTaskAction
  | RemoveImpactPathwaySubTaskSuccessAction
  | RemoveImpactPathwayTaskAction
  | RemoveImpactPathwayTaskErrorAction
  | RemoveImpactPathwayTaskSuccessAction
  | RemoveImpactPathwayTaskLinkAction
  | SaveImpactPathwayTaskLinksAction
  | SaveImpactPathwayTaskLinksErrorAction
  | SaveImpactPathwayTaskLinksSuccessAction
  | SetImpactPathwayTargetTaskAction
  | ToggleImpactPathwayTaskLinksViewAction
  | UpdateImpactPathwayAction
  | UpdateImpactPathwayTaskAction
  | UpdateImpactPathwaySubTaskAction
  | SetImpactPathwaySubTaskCollapseAction
  | ClearImpactPathwaySubtaskCollapseAction
  | InitCompareAction
  | InitCompareErrorAction
  | InitCompareSuccessAction
  | StopCompareImpactPathwayAction
  | InitCompareStepTaskAction
  | InitCompareStepTaskErrorAction
  | InitCompareStepTaskSuccessAction
  | StopCompareImpactPathwayStepTaskAction;
