import { difference, findIndex } from 'lodash';

import { ImpactPathway } from './models/impact-pathway.model';
import {
  AddImpactPathwaySubTaskSuccessAction,
  AddImpactPathwayTaskLinkAction,
  AddImpactPathwayTaskLinksAction,
  AddImpactPathwayTaskSuccessAction,
  EditImpactPathwayTaskLinksAction,
  ImpactPathwayActions,
  ImpactPathwayActionTypes,
  InitImpactPathwaySuccessAction,
  MoveImpactPathwaySubTaskAction,
  MoveImpactPathwaySubTaskErrorAction,
  OrderImpactPathwaySubTasksAction,
  OrderImpactPathwaySubTasksErrorAction,
  OrderImpactPathwayTasksAction,
  OrderImpactPathwayTasksErrorAction,
  RemoveImpactPathwaySubTaskSuccessAction,
  RemoveImpactPathwaySuccessAction,
  RemoveImpactPathwayTaskLinkAction,
  RemoveImpactPathwayTaskSuccessAction,
  SetImpactPathwayTargetTaskAction,
  UpdateImpactPathwayAction,
  UpdateImpactPathwaySubTaskAction,
  UpdateImpactPathwayTaskAction,
  SetImpactPathwaySubTaskCollapseAction,
  ClearImpactPathwaySubtaskCollapseAction
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

export interface ImpactPathwayLink {
  from: string;
  fromTaskId: string;
  to: string;
  toTaskId: string;
  toTaskUniqueId: string;
  toTaskTitle?: string;
  twoWay: boolean;
}

export interface ImpactPathwayLinks {
  showLinks: boolean;
  editing: boolean;
  selectedTaskHTMLId: string;
  selectedTaskId: string;
  selectedTwoWay: boolean;
  relatedImpactPathwayId: string;
  relatedStepId: string;
  stored: ImpactPathwayLink[];
  toSave: ImpactPathwayLink[];
  toDelete: ImpactPathwayLink[];
}

/**
 * The Impact Pathways State
 */
export interface ImpactPathwayState {
  objects: ImpactPathwayEntries;
  loaded: boolean;
  processing: boolean;
  removing: boolean;
  targetTaskId: string;
  links: ImpactPathwayLinks;
  collapsed: any;
}

const impactPathwayInitialState: ImpactPathwayState = {
  objects: {},
  loaded: false,
  processing: false,
  removing: false,
  targetTaskId: '',
  links: {
    showLinks: true,
    editing: false,
    selectedTaskHTMLId: '',
    selectedTaskId: '',
    selectedTwoWay: false,
    relatedImpactPathwayId: '',
    relatedStepId: '',
    stored: [],
    toSave: [],
    toDelete: []
  },
  collapsed: {}
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

    case ImpactPathwayActionTypes.CLEAR_IMPACT_PATHWAY:
      return impactPathwayInitialState;

    case ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY: {
      return Object.assign({}, impactPathwayInitialState, {
        processing: true,
        targetTaskId: (action.payload && (action as any).payload.withTarget) ? state.targetTaskId : ''
      });
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK:
    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK:
    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY: {
      return Object.assign({}, state, {
        removing: true
      });
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUCCESS: {
      return removeImpactPathway(state, action as RemoveImpactPathwaySuccessAction);
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_ERROR:
    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_STEP_ERROR: {
      return Object.assign({}, state, {
        removing: false
      });
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_ERROR:
    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_ERROR:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_ERROR:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUCCESS:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_ERROR:
    case ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY_ERROR:
    case ImpactPathwayActionTypes.MOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS:
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

    case ImpactPathwayActionTypes.MOVE_IMPACT_PATHWAY_SUB_TASK: {
      return moveImpactPathwaySubTask(
        state,
        (action as MoveImpactPathwaySubTaskAction).payload.impactPathwayId,
        (action as MoveImpactPathwaySubTaskAction).payload.stepId,
        (action as MoveImpactPathwaySubTaskAction).payload.parentTaskId,
        (action as MoveImpactPathwaySubTaskAction).payload.newParentTaskId,
        (action as MoveImpactPathwaySubTaskAction).payload.taskId,
        true);
    }

    case ImpactPathwayActionTypes.MOVE_IMPACT_PATHWAY_SUB_TASK_ERROR: {
      return moveImpactPathwaySubTask(
        state,
        (action as MoveImpactPathwaySubTaskErrorAction).payload.impactPathwayId,
        (action as MoveImpactPathwaySubTaskErrorAction).payload.stepId,
        (action as MoveImpactPathwaySubTaskErrorAction).payload.currentParentTaskId,
        (action as MoveImpactPathwaySubTaskErrorAction).payload.previousParentTaskId,
        (action as MoveImpactPathwaySubTaskErrorAction).payload.taskId,
        false);
    }

    case ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_TASKS: {
      return setImpactPathwayTasks(
        state,
        (action as OrderImpactPathwayTasksAction).payload.impactPathwayId,
        (action as OrderImpactPathwayTasksAction).payload.stepId,
        (action as OrderImpactPathwayTasksAction).payload.currentTasks
      );
    }

    case ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_TASKS_ERROR: {
      return setImpactPathwayTasks(
        state,
        (action as OrderImpactPathwayTasksErrorAction).payload.impactPathwayId,
        (action as OrderImpactPathwayTasksErrorAction).payload.stepId,
        (action as OrderImpactPathwayTasksErrorAction).payload.previousTasks
      );
    }

    case ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_SUB_TASKS: {
      return setImpactPathwaySubTasks(
        state,
        (action as OrderImpactPathwaySubTasksAction).payload.impactPathwayId,
        (action as OrderImpactPathwaySubTasksAction).payload.stepId,
        (action as OrderImpactPathwaySubTasksAction).payload.parentTaskId,
        (action as OrderImpactPathwaySubTasksAction).payload.currentTasks
      );
    }

    case ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_SUB_TASKS_ERROR: {
      return setImpactPathwaySubTasks(
        state,
        (action as OrderImpactPathwaySubTasksErrorAction).payload.impactPathwayId,
        (action as OrderImpactPathwaySubTasksErrorAction).payload.stepId,
        (action as OrderImpactPathwaySubTasksErrorAction).payload.parentTaskId,
        (action as OrderImpactPathwaySubTasksErrorAction).payload.previousTasks
      );
    }

    case ImpactPathwayActionTypes.SET_IMPACT_PATHWAY_SUBTASK_COLLAPSE: {
      return SetImpactPathwaySubTaskCollapse(
        state,
        (action as SetImpactPathwaySubTaskCollapseAction).payload.impactPathwayStepId,
        (action as SetImpactPathwaySubTaskCollapseAction).payload.impactPathwayTaskId,
        (action as SetImpactPathwaySubTaskCollapseAction).payload.value
      );
    }

    case ImpactPathwayActionTypes.CLEAR_IMPACT_PATHWAY_SUBTASK_COLLAPSE: {
      return clearImpactPathwaySubTaskCollapse(
        state
      );
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_LINK: {
      return addImpactPathwayTaskRelation(state, action as AddImpactPathwayTaskLinkAction);
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_LINK: {
      return removeImpactPathwayTaskRelation(state, action as RemoveImpactPathwayTaskLinkAction);
    }

    case ImpactPathwayActionTypes.EDIT_IMPACT_PATHWAY_TASK_LINKS: {
      return Object.assign({}, state, {
        links: Object.assign({}, state.links, {
          showLinks: true,
          editing: true,
          selectedTaskHTMLId: (action as EditImpactPathwayTaskLinksAction).payload.impactPathwayTaskHTMLId,
          selectedTaskId: (action as EditImpactPathwayTaskLinksAction).payload.impactPathwayTaskId,
          selectedTwoWay: (action as EditImpactPathwayTaskLinksAction).payload.selectedTwoWay,
          relatedStepId: (action as EditImpactPathwayTaskLinksAction).payload.impactPathwayStepId
        }),
      });
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_LINKS: {
      return Object.assign({}, state, {
        links: Object.assign({}, state.links, {
          stored: [...state.links.stored, ...(action as AddImpactPathwayTaskLinksAction).payload.links]
        }),
      });
    }

    case ImpactPathwayActionTypes.COMPLETE_EDITING_IMPACT_PATHWAY_TASK_LINKS: {
      return Object.assign({}, state, {
        links: Object.assign({}, state.links, {
          editing: false
        }),
      });
    }

    case ImpactPathwayActionTypes.SAVE_IMPACT_PATHWAY_TASK_LINKS_SUCCESS: {
      return Object.assign({}, state, {
        links: Object.assign({}, state.links, {
          editing: false,
          selectedTaskHTMLId: '',
          selectedTaskId: '',
          relatedStepId: '',
          stored: difference([...state.links.stored, ...state.links.toSave], state.links.toDelete),
          toSave: [],
          toDelete: []
        }),
      });
    }

    case ImpactPathwayActionTypes.TOGGLE_IMPACT_PATHWAY_TASK_LINKS_VIEW: {
      return Object.assign({}, state, {
        links: Object.assign({}, state.links, {
          showLinks: !state.links.showLinks
        }),
      });
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK_SUCCESS: {
      return RemoveImpactPathwayTaskFromImpactPathwayStep(state, action as RemoveImpactPathwayTaskSuccessAction);
    }

    case ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUB_TASK_SUCCESS: {
      return RemoveImpactPathwaySubTaskFromImpactPathwayTask(state, action as RemoveImpactPathwaySubTaskSuccessAction);
    }

    case ImpactPathwayActionTypes.UPDATE_IMPACT_PATHWAY: {
      return replaceImpactPathway(state, action as UpdateImpactPathwayAction);
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

    case ImpactPathwayActionTypes.SET_IMPACT_PATHWAY_TARGET_TASK: {
      return Object.assign({}, state, {
        targetTaskId: (action as SetImpactPathwayTargetTaskAction).payload.targetTaskId
      });
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
  });
}

/**
 * Remove a impact pathway object.
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveImpactPathwaySuccessAction
 * @return ImpactPathwayState
 *    the new state.
 */
function removeImpactPathway(state: ImpactPathwayState, action: RemoveImpactPathwaySuccessAction): ImpactPathwayState {
  const newObjects = {};

  Object.keys(state.objects)
    .filter((impcatPathwayId) => impcatPathwayId !== action.payload.impactPathwayId)
    .map((impcatPathwayId) => newObjects[impcatPathwayId] = state.objects[impcatPathwayId]);

  return Object.assign({}, state, {
    objects: newObjects,
    removing: false,
    loaded: false
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
function replaceImpactPathway(state: ImpactPathwayState, action: UpdateImpactPathwayAction): ImpactPathwayState {
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [action.payload.impactPathwayId]: action.payload.impactPathway
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
 * @param impactPathwayId
 *    the impactPathway's Id
 * @param stepId
 *    the impactPathway step's Id
 * @param previousParentTaskId
 *    the impactPathway task's Id from where remove sub-task
 * @param newParentTaskId
 *    the impactPathway task's Id to where add sub-task
 * @param taskId
 *    the impactPathway task's Id to move
 * @param processing
 *    is processing flag
 * @return ImpactPathwayState
 *    the new state.
 */
function moveImpactPathwaySubTask(
  state: ImpactPathwayState,
  impactPathwayId: string,
  stepId: string,
  previousParentTaskId: string,
  newParentTaskId: string,
  taskId: string,
  processing: boolean
): ImpactPathwayState {

  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[impactPathwayId].getStep(stepId);
  const stepIndex: number = newState.objects[impactPathwayId].getStepIndex(stepId);
  const parentTask: ImpactPathwayTask = step.getTask(previousParentTaskId);
  const parentTaskIndex: number = step.getTaskIndex(previousParentTaskId);
  const taskToMove: ImpactPathwayTask = parentTask.getSubTask(taskId);
  const newParentTask = Object.assign(new ImpactPathwayTask(), parentTask, {
    tasks: [...parentTask.tasks]
  });
  newParentTask.removeSubTask(taskId);
  let newTaskList = step.tasks.slice(0);
  newTaskList[parentTaskIndex] = newParentTask;

  const moveParentTask: ImpactPathwayTask = step.getTask(newParentTaskId);
  const moveParentTaskIndex: number = step.getTaskIndex(newParentTaskId);
  const newMoveParentTask = Object.assign(new ImpactPathwayTask(), moveParentTask, {
    tasks: [...moveParentTask.tasks, taskToMove]
  });

  newTaskList = newTaskList.slice(0);
  newTaskList[moveParentTaskIndex] = newMoveParentTask;

  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: newTaskList
  });
  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[impactPathwayId], {
    steps: newState.objects[impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [impactPathwayId]: newImpactPathway
    }),
    processing: processing
  });
}

/**
 * Revert task list of a step
 *
 * @param state
 *    the current state
 * @param impactPathwayId
 *    the impactPathway's Id
 * @param stepId
 *    the impactPathway step's Id
 * @param previousParentTasks
 *    the impactPathway task list to revert
 * @return ImpactPathwayState
 *    the new state.
 */
function setImpactPathwayTasks(
  state: ImpactPathwayState,
  impactPathwayId: string,
  stepId: string,
  previousParentTasks: ImpactPathwayTask[],
) {
  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[impactPathwayId].getStep(stepId);
  const stepIndex: number = newState.objects[impactPathwayId].getStepIndex(stepId);
  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: [...previousParentTasks]
  });
  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[impactPathwayId], {
    steps: newState.objects[impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [impactPathwayId]: newImpactPathway
    })
  });
}

/**
 * Revert task list of a step
 *
 * @param state
 *    the current state
 * @param impactPathwayId
 *    the impactPathway's Id
 * @param stepId
 *    the impactPathway step's Id
 * @param previousParentTasks
 *    the impactPathway task list to revert
 * @return ImpactPathwayState
 *    the new state.
 */
function setImpactPathwaySubTasks(
  state: ImpactPathwayState,
  impactPathwayId: string,
  stepId: string,
  parentTaskId: string,
  previousParentTasks: ImpactPathwayTask[],
) {
  const newState = Object.assign({}, state);
  const step: ImpactPathwayStep = newState.objects[impactPathwayId].getStep(stepId);
  const stepIndex: number = newState.objects[impactPathwayId].getStepIndex(stepId);
  const parentTask: ImpactPathwayTask = step.getTask(parentTaskId);
  const parentTaskIndex: number = step.getTaskIndex(parentTaskId);

  const newParentTask = Object.assign(new ImpactPathwayTask(), parentTask, {
    tasks: [...previousParentTasks]
  });

  const newTaskList = step.tasks.slice(0);
  newTaskList[parentTaskIndex] = newParentTask;

  const newStep = Object.assign(new ImpactPathwayStep(), step, {
    tasks: newTaskList
  });

  const newImpactPathway = Object.assign(new ImpactPathway(), state.objects[impactPathwayId], {
    steps: newState.objects[impactPathwayId].steps.map((stepEntry, index) => {
      return (index === stepIndex) ? newStep : stepEntry;
    })
  });
  return Object.assign({}, state, {
    objects: Object.assign({}, state.objects, {
      [impactPathwayId]: newImpactPathway
    })
  });
}

/**
 * Add a new task relation
 *
 * @param state
 *    the current state
 * @param action
 *    an AddImpactPathwayTaskLinkAction
 * @return ImpactPathwayState
 *    the new state.
 */
function addImpactPathwayTaskRelation(state: ImpactPathwayState, action: AddImpactPathwayTaskLinkAction): ImpactPathwayState {
  return Object.assign({}, state, {
    links: Object.assign({}, state.links, {
      toSave: [...state.links.toSave, {
        from: state.links.selectedTaskHTMLId,
        fromTaskId: state.links.selectedTaskId,
        to: action.payload.targetImpactPathwayTaskHTMLId,
        toTaskId: action.payload.targetImpactPathwayTaskId,
        toTaskUniqueId: `${action.payload.targetImpactPathwayId}:${action.payload.targetImpactPathwayStepId}`,
        toTaskTitle: action.payload.targetImpactPathwayTaskTitle,
        twoWay: state.links.selectedTwoWay
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
 *    an RemoveImpactPathwayTaskLinkAction
 * @return ImpactPathwayState
 *    the new state.
 */
function removeImpactPathwayTaskRelation(state: ImpactPathwayState, action: RemoveImpactPathwayTaskLinkAction): ImpactPathwayState {
  const newToDeleteList = [...state.links.toDelete];
  const newToSaveList = state.links.toSave.filter((relation) => {
    return !(relation.from === state.links.selectedTaskHTMLId && relation.to === action.payload.targetImpactPathwayTaskHTMLId);
  });

  const relationIndex = findIndex(state.links.stored, (link) => {
    if (!link.twoWay) {
      return link.to === action.payload.targetImpactPathwayTaskHTMLId;
    } else {
      return (link.from === action.payload.targetImpactPathwayTaskHTMLId
        || link.to === action.payload.targetImpactPathwayTaskHTMLId);
    }
  });

  if (relationIndex !== -1) {
    newToDeleteList.push(state.links.stored[relationIndex]);
  }

  return Object.assign({}, state, {
    links: Object.assign({}, state.links, {
      toSave: newToSaveList,
      toDelete: newToDeleteList
    }),
  });
}

  /**
   * Set the step collapsed value
   *
   * @param state
   *    the current state
   * @param impactPathwayStepId
   *    the impactPathway step's Id
   * @param impactPathwayTaskId
   *    the impactPathway task's Id
   * @param value
   *    the value of collapsed
   * @return ImpactPathwayState
   *    the new state.
   */
  function SetImpactPathwaySubTaskCollapse(
    state: ImpactPathwayState,
    impactPathwayStepId: string,
    impactPathwayTaskId: string,
    value: boolean
  ) {
    const newState = Object.assign({}, state);
    let collapsed = Object.assign({}, state.collapsed);

    if (!collapsed[impactPathwayStepId]) {
      collapsed[impactPathwayStepId] = {};
    }

    const newCollapsedExplotationPlan = Object.assign({}, collapsed[impactPathwayStepId], {
      [impactPathwayTaskId]:value
    });

    collapsed = Object.assign({},collapsed,{ [impactPathwayStepId]: newCollapsedExplotationPlan});

    return Object.assign({}, state, { collapsed: collapsed }) as ImpactPathwayState;
  }

  /**
   * Clear the task collapsable
   *
   * @param state
   *    the current state
   * @return ImpactPathwayState
   *    the new state.
   */
  function clearImpactPathwaySubTaskCollapse(
    state: ImpactPathwayState,
  ) {
    return Object.assign({}, state, { collapsed: {} }) as ImpactPathwayState;
  }

