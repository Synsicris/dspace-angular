import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { Workpackage, WorkpackageSearchItem, WorkpackageStep } from './models/workpackage-step.model';
import { MetadataMap, MetadatumViewModel } from '../shared/metadata.models';
import { Item } from '../shared/item.model';
import { ChartDateViewType, WorkpackageEntries } from './working-plan.reducer';

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
  UPDATE_WORKPACKAGE: type('dspace/core/workingplan/UPDATE_WORKPACKAGE'),
  UPDATE_WORKPACKAGE_SUCCESS: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_SUCCESS'),
  UPDATE_WORKPACKAGE_ERROR: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_ERROR'),
  UPDATE_WORKPACKAGE_STEP: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_STEP'),
  UPDATE_WORKPACKAGE_STEP_ERROR: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_STEP_ERROR'),
  MOVE_WORKPACKAGE: type('dspace/core/workingplan/MOVE_WORKPACKAGE'),
  MOVE_WORKPACKAGE_STEP: type('dspace/core/workingplan/MOVE_WORKPACKAGE_STEP'),
  SAVE_WORKPACKAGE_ORDER: type('dspace/core/workingplan/SAVE_WORKPACKAGE_ORDER'),
  SAVE_WORKPACKAGE_ORDER_SUCCESS: type('dspace/core/workingplan/SAVE_WORKPACKAGE_ORDER_SUCCESS'),
  SAVE_WORKPACKAGE_ORDER_ERROR: type('dspace/core/workingplan/SAVE_WORKPACKAGE_ORDER_ERROR'),
  SAVE_WORKPACKAGE_STEPS_ORDER: type('dspace/core/workingplan/SAVE_WORKPACKAGE_STEPS_ORDER'),
  SAVE_WORKPACKAGE_STEPS_ORDER_SUCCESS: type('dspace/core/workingplan/SAVE_WORKPACKAGE_STEPS_ORDER_SUCCESS'),
  SAVE_WORKPACKAGE_STEPS_ORDER_ERROR: type('dspace/core/workingplan/SAVE_WORKPACKAGE_STEPS_ORDER_ERROR'),
  NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE: type('dspace/core/workingplan/NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE'),
};

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to generate a workpackage item
 */
export class GenerateWorkpackageAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE;
  payload: {
    metadata: MetadataMap,
    place: string;
  };

  /**
   * Create a new GenerateWorkpackageAction
   *
   * @param metadata: Metadata
   *    the workpackage's Metadata
   * @param place: string
   *    the workpackage's place
   */
  constructor(metadata: MetadataMap, place: string) {
    this.payload = { metadata, place };
  }
}

/**
 * An ngrx action for generating workpackage success
 */
export class GenerateWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_SUCCESS;
  payload: {
    item: Item;
    workspaceItemId: string;
  };

  /**
   * Create a new GenerateWorkpackageSuccessAction
   *
   * @param item
   *    the Item of the workpackage generated
   * @param workspaceItemId
   *    the workspaceItem's id generated
   */
  constructor(item: Item, workspaceItemId: string) {
    this.payload = { item, workspaceItemId };
  }
}

/**
 * An ngrx action for generating workpackage error
 */
export class GenerateWorkpackageErrorAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_ERROR;
}

/**
 * An ngrx action to add a workpackage
 */
export class AddWorkpackageAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE;
  payload: {
    workpackageId: string;
    workspaceItemId: string;
  };

  /**
   * Create a new AddWorkpackageAction
   *
   * @param workpackageId
   *    the Item id of the workpackage to add
   * @param workspaceItemId
   *    the workspaceItem's id of the workpackage to add
   */
  constructor(workpackageId: string, workspaceItemId: string) {
    this.payload = { workpackageId, workspaceItemId };
  }
}

/**
 * An ngrx action for adding success
 */
export class AddWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_SUCCESS;
  payload: {
    workpackage: Workpackage;
  };

  /**
   * Create a new AddWorkpackageSuccessAction
   *
   * @param workpackage
   *    the Workpackage object to add
   */
  constructor(workpackage: Workpackage) {
    this.payload = { workpackage };
  }
}

/**
 * An ngrx action for adding error
 */
export class AddWorkpackageErrorAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_ERROR;
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
   */
  constructor(parentId: string, workpackageStepType: string, metadata: MetadataMap) {
    this.payload = { parentId, workpackageStepType, metadata };
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
    workspaceItemId: string;
  };

  /**
   * Create a new GenerateWorkpackageStepSuccessAction
   *
   * @param parentId
   *    the workpackage step parent's id
   * @param item
   *    the Item of the workpackage step generated
   * @param workspaceItemId
   *    the workspaceItem's id generated
   */
  constructor(parentId: string, item: Item, workspaceItemId: string) {
    this.payload = { parentId, item, workspaceItemId };
  }
}

/**
 * An ngrx action for generating workpackage step error
 */
export class GenerateWorkpackageStepErrorAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP_ERROR;
}

/**
 * An ngrx action to add a workpackage
 */
export class AddWorkpackageStepAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_STEP;
  payload: {
    parentId: string;
    workpackageStepId: string;
    workspaceItemId: string;
  };

  /**
   * Create a new AddWorkpackageStepAction
   *
   * @param parentId
   *    the workpackage step parent's id
   * @param workpackageStepId
   *    the Item's id of the workpackage step to add
   * @param workspaceItemId
   *    the workspaceItem's id generated
   */
  constructor(parentId: string, workpackageStepId: string, workspaceItemId: string) {
    this.payload = { parentId, workpackageStepId, workspaceItemId };
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
  };

  /**
   * Create a new AddWorkpackageStepSuccessAction
   *
   * @param parentId
   *    the workpackage step parent's id
   * @param workpackageStep
   *    the WorkpackageStep object to add
   */
  constructor(parentId: string, workpackageStep: WorkpackageStep) {
    this.payload = { parentId, workpackageStep };
  }
}

/**
 * An ngrx action for adding error
 */
export class AddWorkpackageStepErrorAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_STEP_ERROR;
}

/**
 * An ngrx action to init impact pathway's model objects
 */
export class InitWorkingplanAction implements Action {
  type = WorkpackageActionTypes.INIT_WORKINGPLAN;
  payload: {
    items: WorkpackageSearchItem[];
  };

  /**
   * Create a new InitWorkingplanAction
   *
   * @param items
   *    the list of Item of workpackages
   */
  constructor(items: WorkpackageSearchItem[]) {
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
    workspaceItemId: string;
  };

  /**
   * Create a new RemoveWorkpackageStepAction
   *
   * @param workpackageId
   *    the Item id of the workpackage to remove
   * @param workspaceItemId
   *    the workspaceItem id (if exists) of the workpackage to remove
   */
  constructor(workpackageId: string, workspaceItemId: string) {
    this.payload = { workpackageId, workspaceItemId };
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
    workspaceItemId: string
  };

  /**
   * Create a new RemoveWorkpackageStepAction
   *
   * @param workpackageId
   *    the workpackage step's parent id from where to remove step
   * @param workpackageStepId
   *    the Item id of the workpackage step to remove
   * @param workspaceItemId
   *    the workspaceItem id of the workpackage step to remove
   */
  constructor(workpackageId: string, workpackageStepId: string, workspaceItemId: string) {
    this.payload = { workpackageId, workpackageStepId, workspaceItemId };
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
 * An ngrx action to update a workpackage's object
 */
export class UpdateWorkpackageAction implements Action {
  type = WorkpackageActionTypes.UPDATE_WORKPACKAGE;
  payload: {
    workpackageId: string;
    workpackage: Workpackage;
    metadatumViewList: MetadatumViewModel[];
  };

  /**
   * Create a new UpdateWorkpackageAction
   *
   * @param workpackageId
   *    the workpackage's id
   * @param workpackage
   *    the workpackage's object
   * @param metadatumViewList
   *    the list of metadata to patch
   */
  constructor(workpackageId: string, workpackage: Workpackage, metadatumViewList: MetadatumViewModel[]) {
    this.payload = { workpackageId, workpackage, metadatumViewList };
  }
}

/**
 * An ngrx action to retrieve all working plan's workpackages
 */
export class UpdateWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.UPDATE_WORKPACKAGE_SUCCESS;
}

/**
 * An ngrx action to retrieve all working plan's workpackages
 */
export class UpdateWorkpackageErrorAction implements Action {
  type = WorkpackageActionTypes.UPDATE_WORKPACKAGE_ERROR;
  payload: {
    workpackageId: string;
  };

  /**
   * Create a new UpdateWorkpackageErrorAction
   *
   * @param workpackageId
   *    the workpackage's id
   */
  constructor(workpackageId: string) {
    this.payload = { workpackageId };
  }
}

/**
 * An ngrx action to update a workpackage's object
 */
export class UpdateWorkpackageStepAction implements Action {
  type = WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP;
  payload: {
    workpackageId: string;
    workpackageStepId: string;
    workpackageStep: WorkpackageStep;
    metadatumViewList: MetadatumViewModel[];
  };

  /**
   * Create a new UpdateWorkpackageStepAction
   *
   * @param workpackageId
   *    the workpackage's id
   * @param workpackageStepId
   *    the workpackage step's id
   * @param workpackageStep
   *    the workpackage step's object
   * @param metadatumViewList
   *    the list of metadata to patch
   */
  constructor(workpackageId: string, workpackageStepId: string, workpackageStep: WorkpackageStep, metadatumViewList: MetadatumViewModel[]) {
    this.payload = { workpackageId, workpackageStepId, workpackageStep, metadatumViewList };
  }
}

/**
 * An ngrx action to retrieve all working plan's workpackages
 */
export class UpdateWorkpackageStepErrorAction implements Action {
  type = WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP_ERROR;
  payload: {
    workpackageId: string;
    workpackageStepId: string;
  };

  /**
   * Create a new UpdateWorkpackageErrorAction
   *
   * @param workpackageId
   *    the workpackage's id
   * @param workpackageStepId
   *    the workpackage step's id
   */
  constructor(workpackageId: string, workpackageStepId: string) {
    this.payload = { workpackageId, workpackageStepId };
  }
}

/**
 * An ngrx action to change order of a workpackage
 */
export class MoveWorkpackageAction implements Action {
  type = WorkpackageActionTypes.MOVE_WORKPACKAGE;
  payload: {
    workpackageId: string;
    oldIndex: number
    newIndex: number;
  };

  /**
   * Create a new UpdateWorkpackageErrorAction
   *
   * @param workpackageId
   *    the workpackage's id
   * @param oldIndex
   *    the old index
   * @param newIndex
   *    the new index
   */
  constructor(workpackageId: string, oldIndex: number, newIndex: number) {
    this.payload = { workpackageId, oldIndex, newIndex };
  }
}

/**
 * An ngrx action to change order of a workpackage step
 */
export class MoveWorkpackageStepAction implements Action {
  type = WorkpackageActionTypes.MOVE_WORKPACKAGE_STEP;
  payload: {
    workpackageId: string;
    workpackage: Workpackage;
    workpackageStepId: string;
    oldIndex: number
    newIndex: number;
  };

  /**
   * Create a new MoveWorkpackageStepAction
   *
   * @param workpackageId
   *    the workpackage's id
   * @param workpackage
   *    the workpackage's object
   * @param workpackageStepId
   *    the workpackage step's id
   * @param oldIndex
   *    the old index
   * @param newIndex
   *    the new index
   */
  constructor(workpackageId: string, workpackage: Workpackage, workpackageStepId: string, oldIndex: number, newIndex: number) {
    this.payload = { workpackageId, workpackage, workpackageStepId, oldIndex, newIndex };
  }
}

/**
 * An ngrx action to change order of a workpackage
 */
export class SaveWorkpackageOrderAction implements Action {
  type = WorkpackageActionTypes.SAVE_WORKPACKAGE_ORDER;
  payload: {
    oldWorkpackageEntries: WorkpackageEntries;
  };

  /**
   * Create a new UpdateWorkpackageErrorAction
   *
   * @param oldWorkpackageEntries
   *    the old Workpackage Entries state
   */
  constructor(oldWorkpackageEntries: WorkpackageEntries) {
    this.payload = { oldWorkpackageEntries };
  }
}

/**
 * An ngrx action to change order of a workpackage
 */
export class SaveWorkpackageOrderSuccessAction implements Action {
  type = WorkpackageActionTypes.SAVE_WORKPACKAGE_ORDER_SUCCESS;
}

/**
 * An ngrx action to change order of a workpackage
 */
export class SaveWorkpackageOrderErrorAction implements Action {
  type = WorkpackageActionTypes.SAVE_WORKPACKAGE_ORDER_ERROR;
  payload: {
    oldWorkpackageEntries: WorkpackageEntries;
  };

  /**
   * Create a new UpdateWorkpackageErrorAction
   *
   * @param oldWorkpackageEntries
   *    the old Workpackage Entries state
   */
  constructor(oldWorkpackageEntries: WorkpackageEntries) {
    this.payload = { oldWorkpackageEntries };
  }
}

/**
 * An ngrx action to change order of a workpackage
 */
export class SaveWorkpackageStepsOrderAction implements Action {
  type = WorkpackageActionTypes.SAVE_WORKPACKAGE_STEPS_ORDER;
  payload: {
    workpackageId: string;
    workpackage: Workpackage;
    previousStepsState: WorkpackageStep[];
  };

  /**
   * Create a new SaveWorkpackageStepsOrderAction
   *
   * @param workpackageId
   *    the parent workpackage's id
   * @param workpackage
   *    the parent workpackage
   * @param previousStepsState
   *    the previous WorkpackageSteps array state
   */
  constructor(workpackageId: string, workpackage: Workpackage, previousStepsState: WorkpackageStep[]) {
    this.payload = { workpackageId, workpackage, previousStepsState };
  }
}

/**
 * An ngrx action to change order of a workpackage
 */
export class SaveWorkpackageStepsOrderSuccessAction implements Action {
  type = WorkpackageActionTypes.SAVE_WORKPACKAGE_STEPS_ORDER_SUCCESS;
}

/**
 * An ngrx action to change order of a workpackage
 */
export class SaveWorkpackageStepsOrderErrorAction implements Action {
  type = WorkpackageActionTypes.SAVE_WORKPACKAGE_STEPS_ORDER_ERROR;
  payload: {
    workpackageId: string;
    previousStepsState: WorkpackageStep[];
  };

  /**
   * Create a new SaveWorkpackageStepsOrderErrorAction
   *
   * @param workpackageId
   *    the parent workpackage's id
   * @param previousStepsState
   *    the previous WorkpackageSteps array state
   */
  constructor(workpackageId: string, previousStepsState: WorkpackageStep[]) {
    this.payload = { workpackageId, previousStepsState };
  }
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
  | MoveWorkpackageAction
  | MoveWorkpackageStepAction
  | NormalizeWorkpackageObjectsOnRehydrateAction
  | RemoveWorkpackageAction
  | RemoveWorkpackageErrorAction
  | RemoveWorkpackageSuccessAction
  | RemoveWorkpackageStepAction
  | RemoveWorkpackageStepErrorAction
  | RemoveWorkpackageStepSuccessAction
  | RetrieveAllWorkpackagesAction
  | RetrieveAllWorkpackagesErrorAction
  | SaveWorkpackageOrderAction
  | SaveWorkpackageOrderErrorAction
  | SaveWorkpackageOrderSuccessAction
  | SaveWorkpackageStepsOrderAction
  | SaveWorkpackageStepsOrderErrorAction
  | SaveWorkpackageStepsOrderSuccessAction
  | UpdateWorkpackageAction
  | UpdateWorkpackageErrorAction
  | UpdateWorkpackageSuccessAction
  | UpdateWorkpackageStepAction
  | UpdateWorkpackageStepErrorAction;
