import { difference, findIndex } from 'lodash';

import { ImpactPathway } from './models/impact-pathway.model';
import {
  AddImpactPathwaySubTaskSuccessAction, AddImpactPathwayTaskLinksAction,
  AddImpactPathwayTaskLinkAction,
  AddImpactPathwayTaskSuccessAction,
  EditImpactPathwayTaskLinksAction,
  ImpactPathwayActions,
  ImpactPathwayActionTypes,
  InitImpactPathwaySuccessAction,
  RemoveImpactPathwaySubTaskSuccessAction,
  RemoveImpactPathwayTaskLinkAction,
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

export interface ImpactPathwayLink {
  from: string;
  fromTaskId: string;
  to: string;
  toTaskId: string;
  toTaskUniqueId: string;
  toTaskTitle?: string;
  twoWay: boolean
}

export interface ImpactPathwayLinks {
  showLinks: boolean;
  editing: boolean;
  selectedTaskHTMLId: string;
  selectedTaskId: string;
  selectedTwoWay: boolean;
  relatedImpactPathwayId: string
  relatedStepId: string
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
  links: ImpactPathwayLinks;
}

const impactPathwayInitialState: ImpactPathwayState = {
  objects: {},
  loaded: false,
  processing: true,
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

  const relationIndex = findIndex(state.links.stored, { to: action.payload.targetImpactPathwayTaskHTMLId });
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
