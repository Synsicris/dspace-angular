import { findIndex } from 'lodash';

import { ImpactPathway } from './models/impact-pathway.model';
import {
  AddImpactPathwaySubTaskSuccessAction,
  AddImpactPathwayTaskRelationAction,
  AddImpactPathwayTaskSuccessAction,
  EditImpactPathwayTaskRelationsAction,
  ImpactPathwayActions,
  ImpactPathwayActionTypes,
  InitImpactPathwaySuccessAction,
  RemoveImpactPathwaySubTaskSuccessAction,
  RemoveImpactPathwayTaskRelationAction,
  RemoveImpactPathwayTaskSuccessAction,
  UpdateImpactPathwaySubTaskAction,
  UpdateImpactPathwayTaskAction
} from './impact-pathway.actions';
import { ImpactPathwayStep } from './models/impact-pathway-step.model';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { isNotEmpty } from '../../shared/empty.util';

/**
 * An interface to represent impact pathways object entries
 */
export interface ImpactPathwayEntries {
  [impactPathwayId: string]: ImpactPathway;
}

export interface ImpactPathwayRelation {
  from: string;
  to: string;
  twoWay: boolean
}

export interface ImpactPathwayRelations {
  showRelation: boolean;
  editing: boolean;
  selectedTaskId: string;
  selectedTwoWay: boolean;
  relatedStepId: string
  stored: ImpactPathwayRelation[];
  toSave: ImpactPathwayRelation[];
  toDelete: ImpactPathwayRelation[];
}

/**
 * The Impact Pathways State
 */
export interface ImpactPathwayState {
  objects: ImpactPathwayEntries;
  loaded: boolean;
  processing: boolean;
  relations: ImpactPathwayRelations;
}

const impactPathwayInitialState: ImpactPathwayState = {
  objects: {},
  loaded: false,
  processing: true,
  relations: {
    showRelation: true,
    editing: false,
    selectedTaskId: '',
    selectedTwoWay: false,
    relatedStepId: '',
    stored: [],
    toSave: [],
    toDelete: []
  }
};

/**
 * The Impact Pathways Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return ImpactPathwayState
 *    the new state
 */
export function impactPathwayReducer(state = impactPathwayInitialState, action: ImpactPathwayActions): ImpactPathwayState {
  switch (action.type) {

    case ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY: {
      return Object.assign({}, impactPathwayInitialState, {
        processing: true
      });
    }

    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK:
    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_ERROR:
    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_ERROR:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_ERROR:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUCCESS:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_ERROR:
    case ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY_ERROR:
    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_ERROR: {
      return Object.assign({}, state, {
        processing: false
      });
    }

    case ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY_SUCCESS: {
      return initImpactPathway(state, action as InitImpactPathwaySuccessAction);
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_SUCCESS: {
      return addImpactPathwayTaskToImpactPathwayStep(state, action as AddImpactPathwayTaskSuccessAction);
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS: {
      return addImpactPathwaySubTaskToImpactPathwayTask(state, action as AddImpactPathwaySubTaskSuccessAction);
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_RELATION: {
      return addImpactPathwayTaskRelation(state, action as AddImpactPathwayTaskRelationAction);
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_RELATION: {
      return removeImpactPathwayTaskRelation(state, action as RemoveImpactPathwayTaskRelationAction);
    }

    case ImpactPathwayActionTypes.EDIT_IMPACT_PATHWAY_TASK_RELATIONS: {
      return Object.assign({}, state, {
        relations: Object.assign({}, state.relations, {
          showRelation: true,
          editing: true,
          selectedTaskId: (action as EditImpactPathwayTaskRelationsAction).payload.impactPathwayTaskId,
          selectedTwoWay: (action as EditImpactPathwayTaskRelationsAction).payload.selectedTwoWay,
          relatedStepId: (action as EditImpactPathwayTaskRelationsAction).payload.impactPathwayStepId,
          toSave: state.relations.stored
        }),
      });
    }

    case ImpactPathwayActionTypes.SAVE_IMPACT_PATHWAY_TASK_RELATIONS: {
      return Object.assign({}, state, {
        relations: Object.assign({}, state.relations, {
          editing: false,
          selectedTaskId: '',
          relatedStepId: '',
          stored: state.relations.toSave,
          toSave: []
        }),
      });
    }

    case ImpactPathwayActionTypes.TOGGLE_IMPACT_PATHWAY_TASK_RELATIONS_VIEW: {
      return Object.assign({}, state, {
        relations: Object.assign({}, state.relations, {
          showRelation: !state.relations.showRelation
        }),
      });
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_SUCCESS: {
      return RemoveImpactPathwayTaskFromImpactPathwayStep(state, action as RemoveImpactPathwayTaskSuccessAction);
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS: {
      return RemoveImpactPathwaySubTaskFromImpactPathwayTask(state, action as RemoveImpactPathwaySubTaskSuccessAction);
    }

    case ImpactPathwayActionTypes.UPDATE_IMPACT_PATHWAY_TASK: {
      return replaceImpactPathwayTask(state, action as UpdateImpactPathwayTaskAction);
    }

    case ImpactPathwayActionTypes.UPDATE_IMPACT_PATHWAY_SUB_TASK: {
      return replaceImpactPathwaySubTask(state, action as UpdateImpactPathwaySubTaskAction);
    }

    case ImpactPathwayActionTypes.NORMALIZE_IMPACT_PATHWAY_OBJECTS_ON_REHYDRATE: {
      return normalizeImpactPathwayObjectsOnRehydrate(state);
    }

    default: {
      return state;
    }
  }
}

/**
 * Init a impact pathway object.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitImpactPathwaySuccessAction
 * @return ImpactPathwayState
 *    the new state.
 */
function initImpactPathway(state: ImpactPathwayState, action: InitImpactPathwaySuccessAction): ImpactPathwayState {
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [action.payload.id]: action.payload.impactPathwayObj
    }),
    processing: false,
    loaded: true
  })
}

/**
 * Init a impact pathway object.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitImpactPathwaySuccessAction
 * @return ImpactPathwayState
 *    the new state.
 */
function addImpactPathwayTaskToImpactPathwayStep(state: ImpactPathwayState, action: AddImpactPathwayTaskSuccessAction): ImpactPathwayState {
  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[action.payload.impactPathwayId].getStep(action.payload.stepId);
  const stepIndex: number = newState.objects[action.payload.impactPathwayId].getStepIndex(action.payload.stepId);
  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: [...step.tasks, action.payload.task]
  });
  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[action.payload.impactPathwayId], {
    steps: newState.objects[action.payload.impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [action.payload.impactPathwayId]: newImpactPathway
    }),
    processing: false
  });
}

function normalizeImpactPathwayObjectsOnRehydrate(state: ImpactPathwayState) {
  console.log('normalizeImpactPathwayObjectsOnRehydrate', state)
  if (isNotEmpty(state)) {
    const normImpactPathways: ImpactPathwayEntries = {};

    Object.keys(state.objects).forEach((key) => {
      normImpactPathways[key] = Object.assign(new ImpactPathway(), {}, state.objects[key]);
      normImpactPathways[key].steps = state.objects[key].steps
        .map((step) => {
          const normStep: ImpactPathwayStep = Object.assign(new ImpactPathwayStep(), {}, step);
          normStep.tasks = normStep.tasks
            .map((task) => {
              const normTask: ImpactPathwayTask = Object.assign(new ImpactPathwayTask(), {}, task);
              normTask.tasks = task.tasks.map((subTask) => Object.assign(new ImpactPathwayTask(), {}, subTask));
              return normTask;
            });
          return normStep;
        });
    });

    return Object.assign({}, state, {
      objects: Object.assign({}, state.objects, normImpactPathways)
    });
  } else {
    return state;
  }
}

/**
 * Init a impact pathway sub-task to parent.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitImpactPathwaySuccessAction
 * @return ImpactPathwayState
 *    the new state.
 */
function addImpactPathwaySubTaskToImpactPathwayTask(state: ImpactPathwayState, action: AddImpactPathwaySubTaskSuccessAction): ImpactPathwayState {
  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[action.payload.impactPathwayId].getStep(action.payload.stepId);
  const stepIndex: number = newState.objects[action.payload.impactPathwayId].getStepIndex(action.payload.stepId);
  const parentTask: ImpactPathwayTask = step.getTask(action.payload.parentTaskId);
  const parentTaskIndex: number = step.getTaskIndex(action.payload.parentTaskId);
  const newTask = Object.assign(new ImpactPathwayTask(), parentTask, {
    tasks: [...parentTask.tasks, action.payload.task]
  });
  const newTaskList = step.tasks.slice(0);
  newTaskList[parentTaskIndex] = newTask;

  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: newTaskList
  });
  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[action.payload.impactPathwayId], {
    steps: newState.objects[action.payload.impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [action.payload.impactPathwayId]: newImpactPathway
    }),
    processing: false
  });
}

/**
 * Remove task from step.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitImpactPathwaySuccessAction
 * @return ImpactPathwayState
 *    the new state.
 */
function RemoveImpactPathwayTaskFromImpactPathwayStep(state: ImpactPathwayState, action: RemoveImpactPathwayTaskSuccessAction): ImpactPathwayState {
  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[action.payload.impactPathwayId].getStep(action.payload.parentId);
  const stepIndex: number = newState.objects[action.payload.impactPathwayId].getStepIndex(action.payload.parentId);
  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: [...step.tasks]
  });
  newStep.removeTask(action.payload.taskId);
  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[action.payload.impactPathwayId], {
    steps: newState.objects[action.payload.impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [action.payload.impactPathwayId]: newImpactPathway
    }),
    processing: false
  });
}

/**
 * Remove sub-task from parent task.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitImpactPathwaySuccessAction
 * @return ImpactPathwayState
 *    the new state.
 */
function RemoveImpactPathwaySubTaskFromImpactPathwayTask(state: ImpactPathwayState, action: RemoveImpactPathwaySubTaskSuccessAction): ImpactPathwayState {
  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[action.payload.impactPathwayId].getStep(action.payload.stepId);
  const stepIndex: number = newState.objects[action.payload.impactPathwayId].getStepIndex(action.payload.stepId);
  const parentTask: ImpactPathwayTask = step.getTask(action.payload.parentTaskId);
  const parentTaskIndex: number = step.getTaskIndex(action.payload.parentTaskId);
  const newTask = Object.assign(new ImpactPathwayTask(), parentTask, {
    tasks: [...parentTask.tasks]
  });
  newTask.removeSubTask(action.payload.taskId);
  const newTaskList = step.tasks.slice(0);
  newTaskList[parentTaskIndex] = newTask;

  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: newTaskList
  });
  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[action.payload.impactPathwayId], {
    steps: newState.objects[action.payload.impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [action.payload.impactPathwayId]: newImpactPathway
    }),
    processing: false
  });
}

/**
 * Init a impact pathway object.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitImpactPathwaySuccessAction
 * @return ImpactPathwayState
 *    the new state.
 */
function replaceImpactPathwayTask(state: ImpactPathwayState, action: UpdateImpactPathwayTaskAction): ImpactPathwayState {
  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[action.payload.impactPathwayId].getStep(action.payload.stepId);
  const stepIndex: number = newState.objects[action.payload.impactPathwayId].getStepIndex(action.payload.stepId);
  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: [...step.tasks]
  });
  newStep.replaceTask(action.payload.taskId, action.payload.task);
  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[action.payload.impactPathwayId], {
    steps: newState.objects[action.payload.impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [action.payload.impactPathwayId]: newImpactPathway
    }),
    processing: false
  });
}

/**
 * Replace a task's sub-task.
 *
 * @param state
 *    the current state
 * @param action
 *    an InitImpactPathwaySuccessAction
 * @return ImpactPathwayState
 *    the new state.
 */
function replaceImpactPathwaySubTask(state: ImpactPathwayState, action: UpdateImpactPathwaySubTaskAction): ImpactPathwayState {
  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[action.payload.impactPathwayId].getStep(action.payload.stepId);
  const stepIndex: number = newState.objects[action.payload.impactPathwayId].getStepIndex(action.payload.stepId);
  const parentTask: ImpactPathwayTask = step.getTask(action.payload.parentTaskId);
  const parentTaskIndex: number = step.getTaskIndex(action.payload.parentTaskId);
  const newTask = Object.assign(new ImpactPathwayTask(), parentTask, {
    tasks: [...parentTask.tasks]
  });
  newTask.replaceSubTask(action.payload.taskId, action.payload.task);
  const newTaskList = step.tasks.slice(0);
  newTaskList[parentTaskIndex] = newTask;

  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: newTaskList
  });
  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[action.payload.impactPathwayId], {
    steps: newState.objects[action.payload.impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [action.payload.impactPathwayId]: newImpactPathway
    }),
    processing: false
  });
}

/**
 * Add a new task relation
 *
 * @param state
 *    the current state
 * @param action
 *    an AddImpactPathwayTaskRelationAction
 * @return ImpactPathwayState
 *    the new state.
 */
function addImpactPathwayTaskRelation(state: ImpactPathwayState, action: AddImpactPathwayTaskRelationAction): ImpactPathwayState {
  return Object.assign({}, state, {
    relations: Object.assign({}, state.relations, {
      toSave: [...state.relations.toSave, {
        from: state.relations.selectedTaskId,
        to: action.payload.targetImpactPathwayTaskId,
        twoWay: state.relations.selectedTwoWay
      }]
    }),
  });
}

/**
 * Remove task relation
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveImpactPathwayTaskRelationAction
 * @return ImpactPathwayState
 *    the new state.
 */
function removeImpactPathwayTaskRelation(state: ImpactPathwayState, action: RemoveImpactPathwayTaskRelationAction): ImpactPathwayState {
  const newToDeleteList = [...state.relations.toDelete];
  const newToSaveList = state.relations.toSave.filter((relation) => {
    return !(relation.from === state.relations.selectedTaskId && relation.to === action.payload.targetImpactPathwayTaskId);
  });

  const relationIndex = findIndex(state.relations.stored, { to: action.payload.targetImpactPathwayTaskId });
  if (relationIndex !== -1) {
    newToDeleteList.push(state.relations.stored[relationIndex]);
  }

  return Object.assign({}, state, {
    relations: Object.assign({}, state.relations, {
      toSave: newToSaveList,
      toDelete: newToDeleteList
    }),
  });
}
