import { ImpactPathway } from './models/impact-pathway.model';
import {
  AddImpactPathwaySubTaskSuccessAction,
  AddImpactPathwayTaskSuccessAction,
  ImpactPathwayActions,
  ImpactPathwayActionTypes,
  InitImpactPathwaySuccessAction
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

/**
 * The Impact Pathways State
 */
export interface ImpactPathwayState {
  objects: ImpactPathwayEntries;
  loaded: boolean;
  processing: boolean;
}

const initialState: ImpactPathwayState = Object.create({
  objects: {},
  loaded: false,
  processing: true
});

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
export function impactPathwayReducer(state = initialState, action: ImpactPathwayActions): ImpactPathwayState {
  switch (action.type) {

    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_ERROR:
    case ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_ERROR:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_ERROR:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUCCESS:
    case ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_ERROR:
    case ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY_ERROR: {
      return Object.assign({}, state, {
        processing: false
      });
    }

    case ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY: {
      return Object.assign({}, state, {
        processing: true
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
    const impactPathwayKeys: string[] = Object.keys(state.objects);
    const normImpactPathways: ImpactPathwayEntries = {};

    Object.keys(state.objects).forEach((key) => {
      normImpactPathways[key] = Object.assign(new ImpactPathway(), {}, state.objects[key]);
      normImpactPathways[key].steps = state.objects[key].steps
        .map((step) => {
          const normStep: ImpactPathwayStep = Object.assign(new ImpactPathwayStep(), {}, step);
          normStep.tasks = normStep.tasks
            .map((task) => {
              const normTask: ImpactPathwayTask = Object.assign(new ImpactPathwayTask(), {}, task);
              normTask.tasks = normStep.tasks.map((subTask) => Object.assign(new ImpactPathwayTask(), {}, subTask))
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
