import { Action } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { type } from '../../shared/ngrx/type';
import { Workpackage, WorkpackageStep } from './models/workpackage-step.model';
import { MetadataMap } from '../shared/metadata.models';
import { Item } from '../shared/item.model';
import { ChartDateViewType } from './working-plan.reducer';

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
  ADD_WORKPACKAGE_STEP: type('dspace/core/workingplan/ADD_WORKPACKAGE_STEP'),
  ADD_WORKPACKAGE_STEP_ERROR: type('dspace/core/workingplan/ADD_WORKPACKAGE_STEP_ERROR'),
  ADD_WORKPACKAGE_STEP_SUCCESS: type('dspace/core/workingplan/ADD_WORKPACKAGE_STEP_SUCCESS'),
  CHANGE_CHART_DATE_VIEW: type('dspace/core/workingplan/CHANGE_CHART_DATE_VIEW'),
  GENERATE_WORKPACKAGE: type('dspace/core/workingplan/GENERATE_WORKPACKAGE'),
  GENERATE_WORKPACKAGE_ERROR: type('dspace/core/workingplan/GENERATE_WORKPACKAGE_ERROR'),
  GENERATE_WORKPACKAGE_SUCCESS: type('dspace/core/workingplan/GENERATE_WORKPACKAGE_SUCCESS'),
  GENERATE_WORKPACKAGE_STEP: type('dspace/core/workingplan/GENERATE_WORKPACKAGE_STEP'),
  GENERATE_WORKPACKAGE_STEP_ERROR: type('dspace/core/workingplan/GENERATE_WORKPACKAGE_STEP_ERROR'),
  GENERATE_WORKPACKAGE_STEP_SUCCESS: type('dspace/core/workingplan/GENERATE_WORKPACKAGE_STEP_SUCCESS'),
  INIT_WORKINGPLAN: type('dspace/core/workingplan/INIT_WORKINGPLAN'),
  INIT_WORKINGPLAN_ERROR: type('dspace/core/workingplan/INIT_WORKINGPLAN_ERROR'),
  INIT_WORKINGPLAN_SUCCESS: type('dspace/core/workingplan/INIT_WORKINGPLAN_SUCCESS'),
  REMOVE_WORKPACKAGE: type('dspace/core/workingplan/REMOVE_WORKPACKAGE'),
  REMOVE_WORKPACKAGE_ERROR: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_ERROR'),
  REMOVE_WORKPACKAGE_SUCCESS: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_SUCCESS'),
  REMOVE_WORKPACKAGE_STEP: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_STEP'),
  REMOVE_WORKPACKAGE_STEP_ERROR: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_STEP_ERROR'),
  REMOVE_WORKPACKAGE_STEP_SUCCESS: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_STEP_SUCCESS'),
  RETRIEVE_ALL_WORKPACKAGES: type('dspace/core/workingplan/RETRIEVE_ALL_WORKPACKAGES'),
  RETRIEVE_ALL_WORKPACKAGES_ERROR: type('dspace/core/workingplan/RETRIEVE_ALL_WORKPACKAGES_ERROR'),
  NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE: type('dspace/core/workingplan/NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE'),
};

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to generate a workpackage item
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
 * An ngrx action to generate a workpackage step item
 */
export class GenerateWorkpackageStepAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP;
  payload: {
    parentId: string;
    workpackageStepType: string;
    metadata: MetadataMap
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateWorkpackageStepAction
   *
   * @param parentId
   *    the workpackage step parent's id
   * @param workpackageStepType
   *    the workpackage step's type
   * @param metadata
   *    the workpackage step's Metadata
   * @param modal
   *    the active modal
   */
  constructor(parentId: string, workpackageStepType: string, metadata: MetadataMap, modal?: NgbActiveModal) {
    this.payload = { parentId, workpackageStepType, metadata, modal };
  }
}

/**
 * An ngrx action for generating workpackage step success
 */
export class GenerateWorkpackageStepSuccessAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP_SUCCESS;
  payload: {
    parentId: string;
    item: Item;
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateWorkpackageStepSuccessAction
   *
   * @param parentId
   *    the workpackage step parent's id
   * @param item
   *    the Item of the workpackage step generated
   * @param modal
   *    the active modal
   */
  constructor(parentId: string, item: Item, modal?: NgbActiveModal) {
    this.payload = { parentId, item, modal };
  }
}

/**
 * An ngrx action for generating workpackage step error
 */
export class GenerateWorkpackageStepErrorAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP_ERROR;
  payload: {
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateWorkpackageStepErrorAction
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
export class AddWorkpackageStepAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_STEP;
  payload: {
    parentId: string;
    workpackageStepId: string;
    modal?: NgbActiveModal
  };

  /**
   * Create a new AddWorkpackageStepAction
   *
   * @param parentId
   *    the workpackage step parent's id
   * @param workpackageStepId
   *    the Item's id of the workpackage step to add
   * @param modal
   *    the active modal
   */
  constructor(parentId: string, workpackageStepId: string, modal?: NgbActiveModal) {
    this.payload = { parentId, workpackageStepId, modal };
  }
}

/**
 * An ngrx action for adding success
 */
export class AddWorkpackageStepSuccessAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_STEP_SUCCESS;
  payload: {
    parentId: string;
    workpackageStep: WorkpackageStep;
    modal?: NgbActiveModal
  };

  /**
   * Create a new AddWorkpackageStepSuccessAction
   *
   * @param parentId
   *    the workpackage step parent's id
   * @param workpackageStep
   *    the WorkpackageStep object to add
   * @param modal
   *    the active modal
   */
  constructor(parentId: string, workpackageStep: WorkpackageStep, modal?: NgbActiveModal) {
    this.payload = { parentId, workpackageStep, modal };
  }
}

/**
 * An ngrx action for adding error
 */
export class AddWorkpackageStepErrorAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_STEP_ERROR;
  payload: {
    modal?: NgbActiveModal;
  };

  /**
   * Create a new AddWorkpackageStepErrorAction
   *
   * @param modal
   *    the active modal
   */
  constructor(modal?: NgbActiveModal) {
    this.payload = { modal };
  }
}

/**
 * An ngrx action to init impact pathway's model objects
 */
export class InitWorkingplanAction implements Action {
  type = WorkpackageActionTypes.INIT_WORKINGPLAN;
  payload: {
    items: Item[];
  };

  /**
   * Create a new InitWorkingplanAction
   *
   * @param items
   *    the list of Item of workpackages
   */
  constructor(items: Item[]) {
    this.payload = { items };
  }
}

/**
 * An ngrx action for init success
 */
export class InitWorkingplanSuccessAction implements Action {
  type = WorkpackageActionTypes.INIT_WORKINGPLAN_SUCCESS;
  payload: {
    workpackages: Workpackage[]
  };

  /**
   * Create a new InitWorkingplanSuccessAction
   *
   * @param workpackages
   *    the list of workpackage objects
   */
  constructor(workpackages: Workpackage[]) {
    this.payload = { workpackages };
  }
}

/**
 * An ngrx action for init error
 */
export class InitWorkingplanErrorAction implements Action {
  type = WorkpackageActionTypes.INIT_WORKINGPLAN_ERROR;
}

/**
 * An ngrx action for removing workpackage step
 */
export class RemoveWorkpackageAction implements Action {
  type = WorkpackageActionTypes.REMOVE_WORKPACKAGE;
  payload: {
    workpackageId: string;
  };

  /**
   * Create a new RemoveWorkpackageStepAction
   *
   * @param workpackageId
   *    the Item id of the workpackage to remove
   */
  constructor(workpackageId: string) {
    this.payload = { workpackageId };
  }
}

/**
 * An ngrx action for remove success
 */
export class RemoveWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.REMOVE_WORKPACKAGE_SUCCESS;
  payload: {
    workpackageId: string;
  };

  /**
   * Create a new RemoveWorkpackageStepSuccessAction
   *
   * @param workpackageId
   *    the Item id of the workpackage to remove
   */
  constructor(workpackageId: string) {
    this.payload = { workpackageId };
  }
}

/**
 * An ngrx action for remove error
 */
export class RemoveWorkpackageErrorAction implements Action {
  type = WorkpackageActionTypes.REMOVE_WORKPACKAGE_ERROR;
}

/**
 * An ngrx action for removing workpackage step
 */
export class RemoveWorkpackageStepAction implements Action {
  type = WorkpackageActionTypes.REMOVE_WORKPACKAGE_STEP;
  payload: {
    workpackageId: string;
    workpackageStepId: string;
  };

  /**
   * Create a new RemoveWorkpackageStepAction
   *
   * @param workpackageId
   *    the workpackage step's parent id from where to remove step
   * @param workpackageStepId
   *    the Item id of the workpackage step to remove
   */
  constructor(workpackageId: string, workpackageStepId: string) {
    this.payload = { workpackageId, workpackageStepId };
  }
}

/**
 * An ngrx action for remove success
 */
export class RemoveWorkpackageStepSuccessAction implements Action {
  type = WorkpackageActionTypes.REMOVE_WORKPACKAGE_STEP_SUCCESS;
  payload: {
    workpackageId: string;
    workpackageStepId: string;
  };

  /**
   * Create a new RemoveWorkpackageStepSuccessAction
   *
   * @param workpackageId
   *    the workpackage step's parent id from where to remove step
   * @param workpackageStepId
   *    the Item id of the workpackage step to remove
   */
  constructor(workpackageId: string, workpackageStepId: string) {
    this.payload = { workpackageId, workpackageStepId };
  }
}

/**
 * An ngrx action for remove error
 */
export class RemoveWorkpackageStepErrorAction implements Action {
  type = WorkpackageActionTypes.REMOVE_WORKPACKAGE_STEP_ERROR;
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
 * An ngrx action to retrieve all working plan's workpackages
 */
export class ChangeChartViewAction implements Action {
  type = WorkpackageActionTypes.CHANGE_CHART_DATE_VIEW;
  payload: ChartDateViewType;

  /**
   * Create a new ChangeChartViewAction
   *
   * @param chartDateView
   *    the current chart date view
   */
  constructor(chartDateView: ChartDateViewType) {
    this.payload = chartDateView;
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
  | AddWorkpackageStepAction
  | AddWorkpackageStepErrorAction
  | AddWorkpackageStepSuccessAction
  | ChangeChartViewAction
  | GenerateWorkpackageAction
  | GenerateWorkpackageErrorAction
  | GenerateWorkpackageSuccessAction
  | GenerateWorkpackageStepAction
  | GenerateWorkpackageStepErrorAction
  | GenerateWorkpackageStepSuccessAction
  | InitWorkingplanAction
  | InitWorkingplanErrorAction
  | InitWorkingplanSuccessAction
  | NormalizeWorkpackageObjectsOnRehydrateAction
  | RemoveWorkpackageAction
  | RemoveWorkpackageErrorAction
  | RemoveWorkpackageSuccessAction
  | RemoveWorkpackageStepAction
  | RemoveWorkpackageStepErrorAction
  | RemoveWorkpackageStepSuccessAction
  | RetrieveAllWorkpackagesAction
  | RetrieveAllWorkpackagesErrorAction;
