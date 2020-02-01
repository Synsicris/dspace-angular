import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { Item } from '../shared/item.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ImpactPathwayActionTypes = {
  GENERATE_IMPACT_PATHWAY: type('dspace/core/impactpathway/GENERATE_IMPACT_PATHWAY'),
  GENERATE_IMPACT_PATHWAY_SUCCESS: type('dspace/core/impactpathway/GENERATE_IMPACT_PATHWAY_SUCCESS'),
  GENERATE_IMPACT_PATHWAY_ERROR: type('dspace/core/impactpathway/GENERATE_IMPACT_PATHWAY_ERROR'),
  INIT_IMPACT_PATHWAY: type('dspace/core/impactpathway/INIT_IMPACT_PATHWAY'),
  INIT_IMPACT_PATHWAY_SUCCESS: type('dspace/core/impactpathway/INIT_IMPACT_PATHWAY_SUCCESS'),
  INIT_IMPACT_PATHWAY_ERROR: type('dspace/core/impactpathway/INIT_IMPACT_PATHWAY_ERROR'),
  GENERATE_IMPACT_PATHWAY_TASK: type('dspace/core/impactpathway/GENERATE_IMPACT_PATHWAY_TASK'),
  GENERATE_IMPACT_PATHWAY_TASK_SUCCESS: type('dspace/core/impactpathway/GENERATE_IMPACT_PATHWAY_TASK_SUCCESS'),
  GENERATE_IMPACT_PATHWAY_TASK_ERROR: type('dspace/core/impactpathway/GENERATE_IMPACT_PATHWAY_TASK_ERROR'),
  ADD_IMPACT_PATHWAY_TASK: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_TASK'),
  ADD_IMPACT_PATHWAY_TASK_SUCCESS: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_TASK_SUCCESS'),
  ADD_IMPACT_PATHWAY_TASK_ERROR: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_TASK_ERROR'),
  NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE: type('dspace/core/impactpathway/NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE'),
};

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to generate a impact pathway objects
 */
export class GenerateImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY;
  payload: {
    name: string;
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateImpactPathwayAction
   *
   * @param name
   *    the impact pathway's title
   * @param modal
   *    the active modal
   */
  constructor(name: string, modal?: NgbActiveModal) {
    this.payload = { name, modal };
  }
}

/**
 * An ngrx action for generate success
 */
export class GenerateImpactPathwaySuccessAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUCCESS;
  payload: {
    item: Item;
  };

  /**
   * Create a new GenerateImpactPathwaySuccessAction
   *
   * @param item
   *    the Item of the impact pathway generated
   */
  constructor(item: Item) {
    this.payload = { item };
  }
}

/**
 * An ngrx action for generate error
 */
export class GenerateImpactPathwayErrorAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_ERROR;

}

/**
 * An ngrx action to init impact pathway's model objects
 */
export class InitImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY;
  payload: {
    item: Item;
  };

  /**
   * Create a new InitImpactPathwayAction
   *
   * @param item
   *    the Item of the impact pathway generated
   */
  constructor(item: Item) {
    this.payload = { item };
  }
}

/**
 * An ngrx action for init success
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
 * An ngrx action for init error
 */
export class InitImpactPathwayErrorAction implements Action {
  type = ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY_ERROR;
}

/**
 * An ngrx action to generate a impact pathway objects
 */
export class GenerateImpactPathwayTaskAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    taskType: string;
    title: string;
    description: string;
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateImpactPathwayTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id
   * @param taskType
   *    the impact pathway task's type
   * @param title
   *    the impact pathway task's title
   * @param description
   *    the impact pathway task's description
   * @param modal
   *    the active modal
   */
  constructor(impactPathwayId: string, stepId: string, taskType: string, title: string, description: string, modal?: NgbActiveModal) {
    this.payload = { impactPathwayId, stepId, taskType, title, description, modal };
  }
}

/**
 * An ngrx action for generate success
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
 * An ngrx action for generate error
 */
export class GenerateImpactPathwayTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_ERROR;

}

/**
 * An ngrx action for generate success
 */
export class AddImpactPathwayTaskAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    item: Item;
  };

  /**
   * Create a new AddImpactPathwayTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id to whom to add task
   * @param item
   *    the Item of the impact pathway task to add
   */
  constructor(impactPathwayId: string, stepId: string, item: Item) {
    this.payload = { impactPathwayId, stepId, item };
  }
}

/**
 * An ngrx action for generate success
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
 * An ngrx action for generate error
 */
export class AddImpactPathwayTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_ERROR;
}

/**
 * An ngrx action for normalize state objects
 */
export class NormalizeImpactPathwayObjectsOnRehydrateAction implements Action {
  type = ImpactPathwayActionTypes.NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE;
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
  | GenerateImpactPathwayAction
  | GenerateImpactPathwayErrorAction
  | GenerateImpactPathwaySuccessAction
  | GenerateImpactPathwayTaskAction
  | GenerateImpactPathwayTaskErrorAction
  | GenerateImpactPathwayTaskSuccessAction
  | InitImpactPathwayAction
  | InitImpactPathwaySuccessAction
  | InitImpactPathwayErrorAction
  | NormalizeImpactPathwayObjectsOnRehydrateAction;
