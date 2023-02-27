/* eslint-disable max-classes-per-file */
import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { Workpackage, WorkpackageSearchItem, WorkpackageStep } from './models/workpackage-step.model';
import { MetadataMap, MetadatumViewModel } from '../../core/shared/metadata.models';
import { Item } from '../../core/shared/item.model';
import { ChartDateViewType, WorkpackageEntries } from './working-plan.reducer';
import { WpActionPackage, WpStepActionPackage } from './working-plan-state.service';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const WorkpackageActionTypes = {
  CLEAR_WORKINGPLAN: type('dspace/core/workingplan/CLEAR_WORKINGPLAN'),
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
  INIT_COMPARE: type('dspace/core/workingplan/INIT_COMPARE'),
  INIT_COMPARE_ERROR: type('dspace/core/workingplan/INIT_COMPARE_ERROR'),
  INIT_COMPARE_SUCCESS: type('dspace/core/workingplan/INIT_COMPARE_SUCCESS'),
  INIT_WORKINGPLAN: type('dspace/core/workingplan/INIT_WORKINGPLAN'),
  INIT_WORKINGPLAN_ERROR: type('dspace/core/workingplan/INIT_WORKINGPLAN_ERROR'),
  INIT_WORKINGPLAN_SUCCESS: type('dspace/core/workingplan/INIT_WORKINGPLAN_SUCCESS'),
  REMOVE_WORKPACKAGE: type('dspace/core/workingplan/REMOVE_WORKPACKAGE'),
  REMOVE_WORKPACKAGE_ERROR: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_ERROR'),
  REMOVE_WORKPACKAGE_SUCCESS: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_SUCCESS'),
  REMOVE_WORKPACKAGE_STEP: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_STEP'),
  REMOVE_WORKPACKAGE_STEP_ERROR: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_STEP_ERROR'),
  REMOVE_WORKPACKAGE_STEP_SUCCESS: type('dspace/core/workingplan/REMOVE_WORKPACKAGE_STEP_SUCCESS'),
  RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS: type('dspace/core/workingplan/RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS'),
  RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS_ERROR: type('dspace/core/workingplan/RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS_ERROR'),
  UPDATE_WORKPACKAGE: type('dspace/core/workingplan/UPDATE_WORKPACKAGE'),
  UPDATE_WORKPACKAGE_SUCCESS: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_SUCCESS'),
  UPDATE_ALL_WORKPACKAGE: type('dspace/core/workingplan/UPDATE_ALL_WORKPACKAGE'),
  UPDATE_ALL_WORKPACKAGE_SUCCESS: type('dspace/core/workingplan/UPDATE_ALL_WORKPACKAGE_SUCCESS'),
  UPDATE_WORKPACKAGE_ERROR: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_ERROR'),
  UPDATE_ALL_WORKPACKAGE_ERROR: type('dspace/core/workingplan/UPDATE_ALL_WORKPACKAGE_ERROR'),
  UPDATE_WORKPACKAGE_STEP: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_STEP'),
  UPDATE_WORKPACKAGE_STEP_SUCCESS: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_STEP_SUCCESS'),
  UPDATE_ALL_WORKPACKAGE_STEP: type('dspace/core/workingplan/UPDATE_ALL_WORKPACKAGE_STEP'),
  UPDATE_ALL_WORKPACKAGE_STEP_SUCCESS: type('dspace/core/workingplan/UPDATE_ALL_WORKPACKAGE_STEP_SUCCESS'),
  UPDATE_WORKPACKAGE_STEP_ERROR: type('dspace/core/workingplan/UPDATE_WORKPACKAGE_STEP_ERROR'),
  UPDATE_ALL_WORKPACKAGE_STEP_ERROR: type('dspace/core/workingplan/UPDATE_ALL_WORKPACKAGE_STEP_ERROR'),
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
 * An ngrx action to clear the impact pathway state
 */
export class ClearWorkingPlanAction implements Action {
  type = WorkpackageActionTypes.CLEAR_WORKINGPLAN;
}

/**
 * An ngrx action to generate a workpackage item
 */
export class GenerateWorkpackageAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE;
  payload: {
    projectId: string,
    entityType: string,
    metadata: MetadataMap,
    place: string;
  };

  /**
   * Create a new GenerateWorkpackageAction
   *
   * @param projectId
   *    the project's UUID where to create the object
   * @param entityType
   *    the entity type, can be workpackage or milestone
   * @param metadata: Metadata
   *    the workpackage's Metadata
   * @param place string
   *    the workpackage's place
   */
  constructor(projectId: string, entityType: string, metadata: MetadataMap, place: string) {
    this.payload = { projectId, entityType, metadata, place };
  }
}

/**
 * An ngrx action for generating workpackage success
 */
export class GenerateWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.GENERATE_WORKPACKAGE_SUCCESS;
  payload: {
    projectId: string;
    item: Item;
    workspaceItemId: string;
  };

  /**
   * Create a new GenerateWorkpackageSuccessAction
   *
   * @param projectId
   *    the project identifier
   * @param item
   *    the Item of the workpackage generated
   * @param workspaceItemId
   *    the workspaceItem's id generated
   */
  constructor(projectId: string, item: Item, workspaceItemId: string) {
    this.payload = { projectId, item, workspaceItemId };
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
    projectId: string;
    workpackageId: string;
    workspaceItemId: string;
    place?: string;
  };

  /**
   * Create a new AddWorkpackageAction
   *
   * @param projectId
   *    the project identifier
   * @param workpackageId
   *    the Item id of the workpackage to add
   * @param workspaceItemId
   *    the workspaceItem's id of the workpackage to add
   * @param place string
   *    the workpackage's place
   */
  constructor(projectId: string, workpackageId: string, workspaceItemId: string, place?: string) {
    this.payload = { projectId, workpackageId, workspaceItemId, place };
  }
}

/**
 * An ngrx action for adding success
 */
export class AddWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.ADD_WORKPACKAGE_SUCCESS;
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
    projectId: string;
    parentId: string;
    workpackageStepType: string;
    metadata: MetadataMap
  };

  /**
   * Create a new GenerateWorkpackageStepAction
   *
   * @param projectId
   *    the project's UUID where to create the object
   * @param parentId
   *    the workpackage step parent's id
   * @param workpackageStepType
   *    the workpackage step's type
   * @param metadata
   *    the workpackage step's Metadata
   */
  constructor(projectId: string, parentId: string, workpackageStepType: string, metadata: MetadataMap) {
    this.payload = { projectId, parentId, workpackageStepType, metadata };
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
 * An ngrx action to init working-plan compare
 */
export class InitCompareAction implements Action {
  type = WorkpackageActionTypes.INIT_COMPARE;
  payload: {
    compareWorkingplanId: string;
    isVersionOf: boolean;
  };

  /**
   * Create a new InitCompareAction
   *
   * @param compareWorkingplanId
   *    the working-plan id to compare with the current one
   * @param isVersionOf
   *    whether the working-plan id to compare is a version of item
   */
  constructor(compareWorkingplanId: string, isVersionOf: boolean) {
    this.payload = { compareWorkingplanId, isVersionOf };
  }
}

/**
 * An ngrx action for init error
 */
export class InitCompareErrorAction implements Action {
  type = WorkpackageActionTypes.INIT_COMPARE_ERROR;
}

/**
 * An ngrx action for init success
 */
export class InitCompareSuccessAction implements Action {
  type = WorkpackageActionTypes.INIT_COMPARE_SUCCESS;
  payload: {
    workpackages: Workpackage[];
  };

  /**
   * Create a new InitCompareSuccessAction
   *
   * @param workpackages
   *    the list of workpackage objects
   */
  constructor(workpackages: Workpackage[]) {
    this.payload = { workpackages };
  }
}

/**
 * An ngrx action to init impact pathway's model objects
 */
export class InitWorkingplanAction implements Action {
  type = WorkpackageActionTypes.INIT_WORKINGPLAN;
  payload: {
    workingplanId: string;
    items: WorkpackageSearchItem[];
    sortOption: string;
    readMode: boolean;
  };

  /**
   * Create a new InitWorkingplanAction
   *
   * @param workingplanId
   *    the working-plan id
   * @param items
   *    the list of Item of workpackages
   * @param sortOption
   *    the default sort option value
   * @param readMode
   *    if working-plan is opened with read-only mode
   */
  constructor(workingplanId: string, items: WorkpackageSearchItem[], sortOption: string, readMode: boolean) {
    this.payload = { workingplanId, items, sortOption, readMode };
  }
}

/**
 * An ngrx action for init success
 */
export class InitWorkingplanSuccessAction implements Action {
  type = WorkpackageActionTypes.INIT_WORKINGPLAN_SUCCESS;
  payload: {
    workingplanId: string;
    workpackages: Workpackage[];
    sortOption: string;
    readMode: boolean;
  };

  /**
   * Create a new InitWorkingplanSuccessAction
   *
   * @param workingplanId
   *    the working-plan id
   * @param workpackages
   *    the list of workpackage objects
   * @param sortOption
   *    the default sort option value
   * @param readMode
   *    if working-plan is opened with read-only mode
   */
  constructor(workingplanId: string, workpackages: Workpackage[], sortOption: string, readMode: boolean) {
    this.payload = { workingplanId, workpackages, sortOption, readMode };
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
export class RetrieveAllLinkedWorkingPlanObjectsAction implements Action {
  type = WorkpackageActionTypes.RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS;
  payload: {
    projectId: string;
    workingplanId: string;
    sortOption: string;
    readMode: boolean;
    lastAddedId?: string;
  };

  /**
   * Create a new RetrieveAllLinkedWorkingPlanObjectsAction
   *
   * @param workingplanId
   *    the working-plan id
   * @param projectId
   *    the project id
   * @param sortOption
   *    the sort type
   * @param readMode
   *    if working-plan is opened with read-only mode
   * @param lastAddedId
   *    the id of the last added element
   */
  constructor(projectId: string, workingplanId: string, sortOption: string, readMode: boolean, lastAddedId?: string) {
    this.payload = { projectId, workingplanId, sortOption, readMode, lastAddedId };
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
export class RetrieveAllLinkedWorkingPlanObjectsErrorAction implements Action {
  type = WorkpackageActionTypes.RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS_ERROR;
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
 * An ngrx action to update all the workpackage's object
 */
export class UpdateAllWorkpackageAction implements Action {
  type = WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE;
  payload: {
    wpActionPackage: WpActionPackage[];
    wpStepsActionPackage: WpStepActionPackage[];
  };

  /**
   * Create a new UpdateAllWorkpackageAction
   *
   * @param wpActionPackage
   *    the workpackages data to update
   * @param wpStepsActionPackage
   *    the workpackages steps data to update
   */
  constructor(wpActionPackage: WpActionPackage[], wpStepsActionPackage: WpStepActionPackage[]) {
    this.payload = { wpActionPackage, wpStepsActionPackage };
  }
}

/**
 * An ngrx action to update all the workpackage's object
 */
export class UpdateAllWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_SUCCESS;
  payload: {
    wpActionPackage: WpActionPackage[];
    wpStepsActionPackage: WpStepActionPackage[];
  };

  /**
   * Create a new UpdateAllWorkpackageSuccessAction
   *
   * @param wpActionPackage
   *    the workpackages data to update
   * @param wpStepsActionPackage
   *    the workpackages steps data to update
   */
  constructor(wpActionPackage: WpActionPackage[], wpStepsActionPackage: WpStepActionPackage[]) {
    this.payload = { wpActionPackage, wpStepsActionPackage };
  }
}

/**
 * An ngrx action to retrieve all working plan's workpackages
 */
export class UpdateWorkpackageSuccessAction implements Action {
  type = WorkpackageActionTypes.UPDATE_WORKPACKAGE_SUCCESS;
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
 * An ngrx action to update all the workpackage's object
 */
export class UpdateAllWorkpackageErrorAction implements Action {
  type = WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_ERROR;
  payload: {
    wpActionPackage: WpActionPackage[];
  };

  /**
   * Create a new UpdateAllWorkpackageErrorAction
   *
   * @param wpActionPackage
   *    the workpackages data
   */
  constructor(wpActionPackage: WpActionPackage[]) {
    this.payload = { wpActionPackage };
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
 * An ngrx action to update all the workpackage's object
 */
export class UpdateAllWorkpackageStepAction implements Action {
  type = WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_STEP;
  payload: {
    wpStepActionPackage: WpStepActionPackage[];
  };

  /**
   * Create a new UpdateAllWorkpackageStepAction
   *
   * @param wpStepActionPackage
   *    the workpackages data to Update
   */
  constructor(wpStepActionPackage: WpStepActionPackage[]) {
    this.payload = { wpStepActionPackage };
  }
}

/**
 * An ngrx action to retrieve all working plan's workpackages
 */
export class UpdateAllWorkpackageStepSuccessAction implements Action {
  type = WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_STEP_SUCCESS;
  payload: {
    wpStepActionPackage: WpStepActionPackage[];
  };

  /**
   * Create a new UpdateAllWorkpackageStepSuccessAction
   *
   * @param wpStepActionPackage
   *    the workpackages data to Update
   */
  constructor(wpStepActionPackage: WpStepActionPackage[]) {
    this.payload = { wpStepActionPackage };
  }
}

/**
 * An ngrx action to retrieve all working plan's workpackages
 */
export class UpdateWorkpackageStepSuccessAction implements Action {
  type = WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP_SUCCESS;
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
 * An ngrx action to retrieve all working plan's workpackages
 */
export class UpdateAllWorkpackageStepErrorAction implements Action {
  type = WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_STEP_ERROR;
  payload: {
    wpStepActionPackage: WpStepActionPackage[];
  };

  /**
   * Create a new UpdateAllWorkpackageStepErrorAction
   *
   * @param wpStepActionPackage
   *    the workpackages data
   */
  constructor(wpStepActionPackage: WpStepActionPackage[]) {
    this.payload = { wpStepActionPackage };
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
  | ClearWorkingPlanAction
  | GenerateWorkpackageAction
  | GenerateWorkpackageErrorAction
  | GenerateWorkpackageSuccessAction
  | GenerateWorkpackageStepAction
  | GenerateWorkpackageStepErrorAction
  | GenerateWorkpackageStepSuccessAction
  | InitCompareAction
  | InitCompareErrorAction
  | InitCompareSuccessAction
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
  | RetrieveAllLinkedWorkingPlanObjectsAction
  | RetrieveAllLinkedWorkingPlanObjectsErrorAction
  | SaveWorkpackageOrderAction
  | SaveWorkpackageOrderErrorAction
  | SaveWorkpackageOrderSuccessAction
  | SaveWorkpackageStepsOrderAction
  | SaveWorkpackageStepsOrderErrorAction
  | SaveWorkpackageStepsOrderSuccessAction
  | UpdateWorkpackageAction
  | UpdateWorkpackageErrorAction
  | UpdateAllWorkpackageErrorAction
  | UpdateWorkpackageSuccessAction
  | UpdateAllWorkpackageAction
  | UpdateAllWorkpackageSuccessAction
  | UpdateWorkpackageStepAction
  | UpdateWorkpackageStepErrorAction
  | UpdateWorkpackageStepSuccessAction
  | UpdateAllWorkpackageStepAction
  | UpdateAllWorkpackageStepSuccessAction
  | UpdateAllWorkpackageStepErrorAction;
