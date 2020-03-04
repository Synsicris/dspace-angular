import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { Workpackage } from './models/workpackage-step.model';
import { MetadataMap } from '../shared/metadata.models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../shared/item.model';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const WorkpackageActionTypes = {
  ADD_WORKPACKAGE: type('dspace/core/workingplan/ADD_WORKPACKAGE'),
  ADD_WORKPACKAGE_ERROR: type('dspace/core/workingplan/ADD_WORKPACKAGE_ERROR'),
  ADD_WORKPACKAGE_SUCCESS: type('dspace/core/workingplan/ADD_WORKPACKAGE_SUCCESS'),
  GENERATE_WORKPACKAGE: type('dspace/core/workingplan/GENERATE_WORKPACKAGE'),
  GENERATE_WORKPACKAGE_ERROR: type('dspace/core/workingplan/GENERATE_WORKPACKAGE_ERROR'),
  GENERATE_WORKPACKAGE_SUCCESS: type('dspace/core/workingplan/GENERATE_WORKPACKAGE_SUCCESS'),
  RETRIEVE_ALL_WORKPACKAGES: type('dspace/core/workingplan/RETRIEVE_ALL_WORKPACKAGES'),
  RETRIEVE_ALL_WORKPACKAGES_ERROR: type('dspace/core/workingplan/RETRIEVE_ALL_WORKPACKAGES_ERROR'),
  RETRIEVE_ALL_WORKPACKAGES_SUCCESS: type('dspace/core/workingplan/RETRIEVE_ALL_WORKPACKAGES_SUCCESS'),
  NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE: type('dspace/core/workingplan/NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE'),
};

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to generate a impact pathway objects
 */
export class GenerateWorkpackageAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE;
  payload: {
    metadata: MetadataMap
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateWorkpackageAction
   *
   * @param metadata: Metadata
   *    the workpackage's Metadata
   * @param modal
   *    the active modal
   */
  constructor(metadata: MetadataMap, modal?: NgbActiveModal) {
    this.payload = { metadata, modal };
  }
}

/**
 * An ngrx action for generating workpackage success
 */
export class GenerateWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_SUCCESS;
  payload: {
    item: Item;
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateWorkpackageSuccessAction
   *
   * @param item
   *    the Item of the workpackage generated
   * @param modal
   *    the active modal
   */
  constructor(item: Item, modal?: NgbActiveModal) {
    this.payload = { item, modal };
  }
}

/**
 * An ngrx action for generating workpackage error
 */
export class GenerateWorkpackageErrorAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_ERROR;
  payload: {
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateWorkpackageErrorAction
   *
   * @param modal
   *    the active modal
   */
  constructor(modal?: NgbActiveModal) {
    this.payload = { modal };
  }

}

/**
 * An ngrx action to add a workpackage
 */
export class AddWorkpackageAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE;
  payload: {
    workpackageId: string;
    modal?: NgbActiveModal
  };

  /**
   * Create a new AddWorkpackageAction
   *
   * @param workpackageId
   *    the Item id of the workpackage to add
   * @param modal
   *    the active modal
   */
  constructor(workpackageId: string, modal?: NgbActiveModal) {
    this.payload = { workpackageId, modal };
  }
}

/**
 * An ngrx action for adding success
 */
export class AddWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_SUCCESS;
  payload: {
    workpackage: Workpackage;
    modal?: NgbActiveModal
  };

  /**
   * Create a new AddWorkpackageSuccessAction
   *
   * @param workpackage
   *    the Workpackage object to add
   * @param modal
   *    the active modal
   */
  constructor(workpackage: Workpackage, modal?: NgbActiveModal) {
    this.payload = { workpackage, modal };
  }
}

/**
 * An ngrx action for adding error
 */
export class AddWorkpackageErrorAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_ERROR;
  payload: {
    modal?: NgbActiveModal;
  };

  /**
   * Create a new AddWorkpackageErrorAction
   *
   * @param modal
   *    the active modal
   */
  constructor(modal?: NgbActiveModal) {
    this.payload = { modal };
  }
}

/**
 * An ngrx action to retrieve all working plan's workpackages
 */
export class RetrieveAllWorkpackagesAction implements Action {
  type = WorkpackageActionTypes.RETRIEVE_ALL_WORKPACKAGES;
  payload: {
    projectId: string;
  };

  /**
   * Create a new RetrieveAllWorkpackagesAction
   *
   * @param projectId
   *    the project'id
   */
  constructor(projectId: string) {
    this.payload = { projectId };
  }
}

/**
 * An ngrx action for retrieving all working plan's workpackages success
 */
export class RetrieveAllWorkpackagesSuccessAction implements Action {
  type = WorkpackageActionTypes.RETRIEVE_ALL_WORKPACKAGES_SUCCESS;
  payload: {
    workpackages: Workpackage[];
  };

  /**
   * Create a new RetrieveAllWorkpackagesAction
   *
   * @param workpackages
   *    the working plan's workpackages
   */
  constructor(workpackages: Workpackage[]) {
    this.payload = { workpackages };
  }
}

/**
 * An ngrx action for retrieving all working plan's workpackages error
 */
export class RetrieveAllWorkpackagesErrorAction implements Action {
  type = WorkpackageActionTypes.RETRIEVE_ALL_WORKPACKAGES_ERROR;
}

/**
 * An ngrx action to normalize state object on rehydrate
 */
export class NormalizeWorkpackageObjectsOnRehydrateAction implements Action {
  type = WorkpackageActionTypes.NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE;
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type WorkingPlanActions
  = AddWorkpackageAction
  | AddWorkpackageErrorAction
  | AddWorkpackageSuccessAction
  | GenerateWorkpackageAction
  | GenerateWorkpackageErrorAction
  | GenerateWorkpackageSuccessAction
  | NormalizeWorkpackageObjectsOnRehydrateAction
  | RetrieveAllWorkpackagesAction
  | RetrieveAllWorkpackagesErrorAction
  | RetrieveAllWorkpackagesSuccessAction;
