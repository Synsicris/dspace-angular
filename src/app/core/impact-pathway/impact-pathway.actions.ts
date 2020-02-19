import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';
import { Item } from '../shared/item.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { MetadataMap } from '../shared/metadata.models';

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
  GENERATE_IMPACT_PATHWAY_SUB_TASK: type('dspace/core/impactpathway/GENERATE_IMPACT_PATHWAY_SUB_TASK'),
  GENERATE_IMPACT_PATHWAY_SUB_TASK_SUCCESS: type('dspace/core/impactpathway/GENERATE_IMPACT_PATHWAY_SUB_TASK_SUCCESS'),
  ADD_IMPACT_PATHWAY_TASK: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_TASK'),
  ADD_IMPACT_PATHWAY_TASK_SUCCESS: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_TASK_SUCCESS'),
  ADD_IMPACT_PATHWAY_TASK_ERROR: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_TASK_ERROR'),
  ADD_IMPACT_PATHWAY_SUB_TASK: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_SUB_TASK'),
  ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS'),
  ADD_IMPACT_PATHWAY_SUB_TASK_ERROR: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_SUB_TASK_ERROR'),
  NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE: type('dspace/core/impactpathway/NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE'),
  REMOVE_IMPACT_PATHWAY_TASK: type('dspace/core/impactpathway/REMOVE_IMPACT_PATHWAY_TASK'),
  REMOVE_IMPACT_PATHWAY_TASK_SUCCESS: type('dspace/core/impactpathway/REMOVE_IMPACT_PATHWAY_TASK_SUCCESS'),
  REMOVE_IMPACT_PATHWAY_SUB_TASK: type('dspace/core/impactpathway/REMOVE_IMPACT_PATHWAY_SUB_TASK'),
  REMOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS: type('dspace/core/impactpathway/REMOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS'),
  REMOVE_IMPACT_PATHWAY_TASK_ERROR: type('dspace/core/impactpathway/REMOVE_IMPACT_PATHWAY_TASK_ERROR'),
  PATCH_IMPACT_PATHWAY_METADATA: type('dspace/core/impactpathway/PATCH_IMPACT_PATHWAY_METADATA'),
  PATCH_IMPACT_PATHWAY_METADATA_SUCCESS: type('dspace/core/impactpathway/PATCH_IMPACT_PATHWAY_METADATA_SUCCESS'),
  PATCH_IMPACT_PATHWAY_METADATA_ERROR: type('dspace/core/impactpathway/PATCH_IMPACT_PATHWAY_METADATA_ERROR'),
  PATCH_IMPACT_PATHWAY_TASK_METADATA: type('dspace/core/impactpathway/PATCH_IMPACT_PATHWAY_TASK_METADATA'),
  PATCH_IMPACT_PATHWAY_TASK_METADATA_SUCCESS: type('dspace/core/impactpathway/PATCH_IMPACT_PATHWAY_TASK_METADATA_SUCCESS'),
  PATCH_IMPACT_PATHWAY_TASK_METADATA_ERROR: type('dspace/core/impactpathway/PATCH_IMPACT_PATHWAY_TASK_METADATA_ERROR'),
  UPDATE_IMPACT_PATHWAY: type('dspace/core/impactpathway/UPDATE_IMPACT_PATHWAY'),
  UPDATE_IMPACT_PATHWAY_TASK: type('dspace/core/impactpathway/UPDATE_IMPACT_PATHWAY_TASK'),
  UPDATE_IMPACT_PATHWAY_SUB_TASK: type('dspace/core/impactpathway/UPDATE_IMPACT_PATHWAY_SUB_TASK'),
  ADD_IMPACT_PATHWAY_TASK_RELATION: type('dspace/core/impactpathway/ADD_IMPACT_PATHWAY_TASK_RELATION'),
  REMOVE_IMPACT_PATHWAY_TASK_RELATION: type('dspace/core/impactpathway/REMOVE_IMPACT_PATHWAY_TASK_RELATION'),
  EDIT_IMPACT_PATHWAY_TASK_RELATIONS: type('dspace/core/impactpathway/EDIT_IMPACT_PATHWAY_TASK_RELATIONS'),
  SAVE_IMPACT_PATHWAY_TASK_RELATIONS: type('dspace/core/impactpathway/SAVE_IMPACT_PATHWAY_TASK_RELATIONS'),
  TOGGLE_IMPACT_PATHWAY_TASK_RELATIONS_VIEW: type('dspace/core/impactpathway/TOGGLE_IMPACT_PATHWAY_TASK_RELATIONS_VIEW'),
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
    metadata: MetadataMap
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
   * @param metadata: Metadata
   *    the impact pathway task's Metadata
   * @param modal
   *    the active modal
   */
  constructor(impactPathwayId: string, stepId: string, taskType: string, metadata: MetadataMap, modal?: NgbActiveModal) {
    this.payload = { impactPathwayId, stepId, taskType, metadata, modal };
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
    modal?: NgbActiveModal;
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
   * @param modal
   *    the active modal
   */
  constructor(impactPathwayId: string, stepId: string, item: Item, modal?: NgbActiveModal) {
    this.payload = { impactPathwayId, stepId, item, modal };
  }
}

/**
 * An ngrx action for generate error
 */
export class GenerateImpactPathwayTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_ERROR;
  payload: {
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateImpactPathwayTaskErrorAction
   *
   * @param modal
   *    the active modal
   */
  constructor(modal?: NgbActiveModal) {
    this.payload = { modal };
  }

}

/**
 * An ngrx action to generate a impact pathway objects
 */
export class GenerateImpactPathwaySubTaskAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    taskType: string;
    metadata: MetadataMap
    modal?: NgbActiveModal;
  };

  /**
   * Create a new GenerateImpactPathwaySubTaskAction
   *
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
   * @param modal
   *    the active modal
   */
  constructor(
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    taskType: string,
    metadata: MetadataMap,
    modal?: NgbActiveModal
  ) {
    this.payload = { impactPathwayId, stepId, parentTaskId, taskType, metadata, modal };
  }
}

/**
 * An ngrx action for generate success
 */
export class GenerateImpactPathwaySubTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    item: Item;
    modal?: NgbActiveModal
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
   * @param modal
   *    the active modal
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, item: Item, modal?: NgbActiveModal) {
    this.payload = { impactPathwayId, stepId, parentTaskId, item, modal };
  }
}

/**
 * An ngrx action for generate success
 */
export class AddImpactPathwayTaskAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    taskId: string;
    modal?: NgbActiveModal
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
   * @param modal
   *    the active modal
   */
  constructor(impactPathwayId: string, stepId: string, taskId: string, modal?: NgbActiveModal) {
    this.payload = { impactPathwayId, stepId, taskId, modal };
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
    modal?: NgbActiveModal
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
   * @param modal
   *    the active modal
   */
  constructor(impactPathwayId: string, stepId: string, task: ImpactPathwayTask, modal?: NgbActiveModal) {
    this.payload = { impactPathwayId, stepId, task, modal };
  }
}

/**
 * An ngrx action for generate error
 */
export class AddImpactPathwayTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_ERROR;
  payload: {
    modal?: NgbActiveModal;
  };

  /**
   * Create a new AddImpactPathwayTaskErrorAction
   *
   * @param modal
   *    the active modal
   */
  constructor(modal?: NgbActiveModal) {
    this.payload = { modal };
  }
}

/**
 * An ngrx action for generate success
 */
export class AddImpactPathwaySubTaskAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    taskId: string;
    modal?: NgbActiveModal
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
   * @param modal
   *    the active modal
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, taskId: string, modal?: NgbActiveModal) {
    this.payload = { impactPathwayId, stepId, parentTaskId, taskId, modal};
  }
}

/**
 * An ngrx action for generate success
 */
export class AddImpactPathwaySubTaskSuccessAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS;
  payload: {
    impactPathwayId: string;
    stepId: string;
    parentTaskId: string;
    task: ImpactPathwayTask;
    modal?: NgbActiveModal
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
   * @param modal
   *    the active modal
   */
  constructor(impactPathwayId: string, stepId: string, parentTaskId: string, task: ImpactPathwayTask, modal?: NgbActiveModal) {
    this.payload = { impactPathwayId, stepId, parentTaskId, task, modal };
  }
}

/**
 * An ngrx action for generate error
 */
export class AddImpactPathwaySubTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_ERROR;
  payload: {
    modal?: NgbActiveModal;
  };

  /**
   * Create a new AddImpactPathwaySubTaskErrorAction
   *
   * @param modal
   *    the active modal
   */
  constructor(modal?: NgbActiveModal) {
    this.payload = { modal };
  }
}

/**
 * An ngrx action for removing task
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
 * An ngrx action for remove success
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
 * An ngrx action for remove error
 */
export class RemoveImpactPathwayTaskErrorAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_ERROR;
}

/**
 * An ngrx action for removing task
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
 * An ngrx action for remove success
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
 * An ngrx action to patch a ImpactPathway's metadata
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
    this.payload = { impactPathwayId, oldImpactPathway, metadata, metadataIndex, value};
  }
}

/**
 * An ngrx action to patch a ImpactPathway's metadata
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
    this.payload = { impactPathwayId, oldImpactPathway, item};
  }
}

/**
 * An ngrx action for patch error
 */
export class PatchImpactPathwayMetadataErrorAction implements Action {
  type = ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_METADATA_ERROR;
}

/**
 * An ngrx action to patch a task's metadata
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
    this.payload = { impactPathwayId, stepId, taskId, oldTask, metadata, metadataIndex, value, parentTaskId};
  }
}

/**
 * An ngrx action to patch a task's metadata
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
    this.payload = { impactPathwayId, stepId, taskId, oldTask, item, parentTaskId};
  }
}

/**
 * An ngrx action for patch error
 */
export class PatchImpactPathwayTaskMetadataErrorAction implements Action {
  type = ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_TASK_METADATA_ERROR;
}

/**
 * An ngrx action to update a task
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
 * An ngrx action to update a task
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
 * An ngrx action to update a task
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
 * An ngrx action to enable editing of relation between task
 */
export class AddImpactPathwayTaskRelationAction implements Action {
  type = ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_RELATION;
  payload: {
    targetImpactPathwayTaskId: string
  };

  /**
   * Create a new AddImpactPathwayTaskRelationAction
   *
   * @param targetImpactPathwayTaskId
   *    the impact pathway task's id
   */
  constructor(targetImpactPathwayTaskId: string) {
    this.payload = { targetImpactPathwayTaskId };
  }
}

/**
 * An ngrx action to enable editing of relation between task
 */
export class RemoveImpactPathwayTaskRelationAction implements Action {
  type = ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_RELATION;
  payload: {
    targetImpactPathwayTaskId: string;
  };

  /**
   * Create a new RemoveImpactPathwayTaskRelationAction
   *
   * @param targetImpactPathwayTaskId
   *    the impact pathway task's id
   */
  constructor(targetImpactPathwayTaskId: string) {
    this.payload = { targetImpactPathwayTaskId };
  }
}

/**
 * An ngrx action to enable editing of relation between task
 */
export class EditImpactPathwayTaskRelationsAction implements Action {
  type = ImpactPathwayActionTypes.EDIT_IMPACT_PATHWAY_TASK_RELATIONS;
  payload: {
    impactPathwayStepId: string;
    selectedTwoWay: boolean;
    impactPathwayTaskId: string;
  };

  /**
   * Create a new EditImpactPathwayTaskRelationsAction
   *
   * @param impactPathwayStepId
   *    the impact pathway step's id
   * @param selectedTwoWay
   *    if is two way relation or not
   * @param impactPathwayTaskId
   *    the impact pathway task's id
   */
  constructor(impactPathwayStepId: string, selectedTwoWay: boolean, impactPathwayTaskId: string) {
    this.payload = { impactPathwayStepId, selectedTwoWay, impactPathwayTaskId };
  }
}

/**
 * An ngrx action to save relation between task
 */
export class SaveImpactPathwayTaskRelationsAction implements Action {
  type = ImpactPathwayActionTypes.SAVE_IMPACT_PATHWAY_TASK_RELATIONS;

}

/**
 * An ngrx action to change the state of the visualization of relations
 */
export class ToogleImpactPathwayTaskRelationsViewAction implements Action {
  type = ImpactPathwayActionTypes.TOGGLE_IMPACT_PATHWAY_TASK_RELATIONS_VIEW;

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
  | AddImpactPathwaySubTaskAction
  | AddImpactPathwaySubTaskErrorAction
  | AddImpactPathwaySubTaskSuccessAction
  | AddImpactPathwayTaskRelationAction
  | EditImpactPathwayTaskRelationsAction
  | RemoveImpactPathwayTaskRelationAction
  | SaveImpactPathwayTaskRelationsAction
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
  | NormalizeImpactPathwayObjectsOnRehydrateAction
  | RemoveImpactPathwayTaskAction
  | RemoveImpactPathwayTaskErrorAction
  | RemoveImpactPathwayTaskSuccessAction
  | RemoveImpactPathwaySubTaskAction
  | RemoveImpactPathwaySubTaskSuccessAction
  | PatchImpactPathwayMetadataAction
  | PatchImpactPathwayMetadataErrorAction
  | PatchImpactPathwayMetadataSuccessAction
  | PatchImpactPathwayTaskMetadataAction
  | PatchImpactPathwayTaskMetadataErrorAction
  | PatchImpactPathwayTaskMetadataSuccessAction
  | UpdateImpactPathwayAction
  | UpdateImpactPathwayTaskAction
  | UpdateImpactPathwaySubTaskAction;
