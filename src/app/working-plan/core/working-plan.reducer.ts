import { findIndex, remove } from 'lodash';

import { Workpackage } from './models/workpackage-step.model';
import {
  AddWorkpackageStepSuccessAction,
  InitWorkingplanSuccessAction,
  MoveWorkpackageAction,
  MoveWorkpackageStepAction,
  RemoveWorkpackageAction,
  RemoveWorkpackageStepAction,
  RemoveWorkpackageStepSuccessAction,
  RemoveWorkpackageSuccessAction,
  SaveWorkpackageStepsOrderErrorAction,
  UpdateAllWorkpackageStepSuccessAction,
  UpdateAllWorkpackageSuccessAction,
  UpdateWorkpackageAction,
  UpdateWorkpackageStepAction,
  UpdateWorkpackageStepSuccessAction,
  UpdateWorkpackageSuccessAction,
  WorkingPlanActions,
  WorkpackageActionTypes
} from './working-plan.actions';
import { WpActionPackage, WpStepActionPackage } from './working-plan-state.service';

export enum ChartDateViewType {
  day = 'day',
  month = 'month',
  quarter = 'quarter',
  year = 'year'
}

/**
 * An interface to represent Workpackages object entries
 */
export interface WorkpackageEntries {
  [workpackageId: string]: Workpackage;
}

/**
 * The Impact Pathways State
 */
export interface WorkingPlanState {
  workpackages: WorkpackageEntries;
  workpackageToRemove: string;
  workpackageToUpdate: string;
  loaded: boolean;
  processing: boolean;
  lastAddedNodes: string[];
  moving: boolean;
  chartDateView: ChartDateViewType;
  sortOption: string;
}

const workpackageInitialState: WorkingPlanState = {
  workpackages: {},
  workpackageToRemove: '',
  workpackageToUpdate: '',
  loaded: false,
  processing: false,
  lastAddedNodes: [],
  moving: false,
  chartDateView: ChartDateViewType.month,
  sortOption: ''
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
export function workingPlanReducer(state = workpackageInitialState, action: WorkingPlanActions): WorkingPlanState {
  switch (action.type) {

    case WorkpackageActionTypes.CHANGE_CHART_DATE_VIEW: {
      return Object.assign({}, state, {
        chartDateView: action.payload
      });
    }

    case WorkpackageActionTypes.RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS: {
      const lastAddedNodes = (action.payload.lastAddedId) ? [action.payload.lastAddedId] : [];
      console.log('RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS', lastAddedNodes);
      return Object.assign({}, workpackageInitialState, {
        processing: true,
        lastAddedNodes: lastAddedNodes
      });
    }

    case WorkpackageActionTypes.GENERATE_WORKPACKAGE:
    case WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP:
    case WorkpackageActionTypes.ADD_WORKPACKAGE_STEP: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case WorkpackageActionTypes.ADD_WORKPACKAGE_STEP_SUCCESS: {
      return addWorkpackageStep(state, action as AddWorkpackageStepSuccessAction);
    }

    case WorkpackageActionTypes.ADD_WORKPACKAGE_ERROR:
    case WorkpackageActionTypes.ADD_WORKPACKAGE_STEP_ERROR:
    case WorkpackageActionTypes.GENERATE_WORKPACKAGE_ERROR:
    case WorkpackageActionTypes.INIT_WORKINGPLAN_ERROR: {
      return Object.assign({}, state, {
        processing: false
      });
    }

    case WorkpackageActionTypes.REMOVE_WORKPACKAGE: {
      return Object.assign({}, state, {
        workpackageToRemove: (action as RemoveWorkpackageAction).payload.workpackageId,
        processing: true
      });
    }

    case WorkpackageActionTypes.REMOVE_WORKPACKAGE_STEP: {
      return Object.assign({}, state, {
        workpackageToRemove: (action as RemoveWorkpackageStepAction).payload.workpackageStepId,
        processing: true
      });
    }

    case WorkpackageActionTypes.REMOVE_WORKPACKAGE_SUCCESS: {
      return removeWorkpackage(state, action as RemoveWorkpackageSuccessAction);
    }

    case WorkpackageActionTypes.REMOVE_WORKPACKAGE_STEP_SUCCESS: {
      return removeWorkpackageStep(state, action as RemoveWorkpackageStepSuccessAction);
    }

    case WorkpackageActionTypes.REMOVE_WORKPACKAGE_ERROR:
    case WorkpackageActionTypes.REMOVE_WORKPACKAGE_STEP_ERROR: {
      return Object.assign({}, state, {
        workpackageToRemove: '',
        processing: false
      });
    }

    case WorkpackageActionTypes.INIT_WORKINGPLAN_SUCCESS: {
      return initWorkpackages(state, action as InitWorkingplanSuccessAction);
    }

    case WorkpackageActionTypes.UPDATE_WORKPACKAGE: {
      return Object.assign({}, state, {
        workpackageToUpdate: (action as UpdateWorkpackageAction).payload.workpackageId,
        processing: true
      });
    }

    case WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP: {
      return Object.assign({}, state, {
        workpackageToUpdate: (action as UpdateWorkpackageStepAction).payload.workpackageStepId,
        processing: true
      });
    }

    case WorkpackageActionTypes.UPDATE_WORKPACKAGE_SUCCESS: {
      return updateWorkpackage(state, action as UpdateWorkpackageSuccessAction);
    }

    case WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP_SUCCESS: {
      return updateWorkpackageStep(state, action as UpdateWorkpackageStepSuccessAction);
    }

    case WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_STEP: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_SUCCESS: {
      return updateAllWorkpackage(state, action as UpdateAllWorkpackageSuccessAction);
    }

    case WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_STEP_SUCCESS: {
      return updateAllWorkpackageStep(state, action as UpdateAllWorkpackageStepSuccessAction);
    }

    case WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_ERROR:
    case WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_STEP_ERROR: {
      return Object.assign({}, state, {
        processing: false
      });
    }

    case WorkpackageActionTypes.MOVE_WORKPACKAGE: {
      return moveWorkpackage(state, action as MoveWorkpackageAction);
    }

    case WorkpackageActionTypes.MOVE_WORKPACKAGE_STEP: {
      return moveWorkpackageStep(state, action as MoveWorkpackageStepAction);
    }

    case WorkpackageActionTypes.SAVE_WORKPACKAGE_ORDER_SUCCESS:
    case WorkpackageActionTypes.SAVE_WORKPACKAGE_STEPS_ORDER_SUCCESS: {
      return Object.assign({}, state, {
        moving: false
      });
    }

    case WorkpackageActionTypes.SAVE_WORKPACKAGE_ORDER_ERROR: {
      return Object.assign({}, state, {
        workpackages: action.payload.oldWorkpackageEntries,
        moving: false
      });
    }

    case WorkpackageActionTypes.SAVE_WORKPACKAGE_STEPS_ORDER_ERROR: {
      return revertWorkpackageStepOrder(state, action as SaveWorkpackageStepsOrderErrorAction);
    }

    case WorkpackageActionTypes.NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE: {
      return state;
    }

    default: {
      return state;
    }
  }
}

/**
 * Add a workpackage step object.
 *
 * @param state
 *    the current state
 * @param action
 *    an AddWorkpackageStepSuccessAction
 * @return WorkingPlanState
 *    the new state.
 */
function addWorkpackageStep(state: WorkingPlanState, action: AddWorkpackageStepSuccessAction): WorkingPlanState {
  const newWorpackage = Object.assign({}, state.workpackages[action.payload.parentId], {
    steps: [...state.workpackages[action.payload.parentId].steps, action.payload.workpackageStep]
  });

  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.parentId]: newWorpackage
    }),
    processing: false,
    lastAddedNodes: [...state.lastAddedNodes, action.payload.workpackageStep.id]
  });
}

/**
 * Init a workpackages objects.
 *
 * @param state
 *    the current state
 * @param action
 *    an RetrieveAllWorkpackagesSuccessAction
 * @return WorkingPlanState
 *    the new state.
 */
function initWorkpackages(state: WorkingPlanState, action: InitWorkingplanSuccessAction): WorkingPlanState {
  const workpackages = {};
  action.payload.workpackages.forEach((workpackage: Workpackage) => {
    workpackages[workpackage.id] = workpackage;
  });

  return Object.assign({}, state, {
    workpackages: workpackages,
    processing: false,
    loaded: true,
    sortOption: action.payload.sortOption
  });
}

/**
 * Remove a workpackage object.
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveWorkpackageSuccessAction
 * @return WorkingPlanState
 *    the new state.
 */
function removeWorkpackage(state: WorkingPlanState, action: RemoveWorkpackageSuccessAction): WorkingPlanState {
  const newWorpackages = {};

  Object.keys(state.workpackages)
    .filter((workpackageId) => workpackageId !== action.payload.workpackageId)
    .map((workpackageId) => newWorpackages[workpackageId] = state.workpackages[workpackageId]);

  return Object.assign({}, state, {
    workpackages: newWorpackages,
    workpackageToRemove: '',
    processing: false
  });
}

/**
 * Remove a workpackage step object.
 *
 * @param state
 *    the current state
 * @param action
 *    an RemoveWorkpackageStepSuccessAction
 * @return WorkingPlanState
 *    the new state.
 */
function removeWorkpackageStep(state: WorkingPlanState, action: RemoveWorkpackageStepSuccessAction): WorkingPlanState {
  const newSteps = remove([...state.workpackages[action.payload.workpackageId].steps], (innerTask) => {
    return innerTask.id !== action.payload.workpackageStepId;
  });

  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackageId]: Object.assign({}, state.workpackages[action.payload.workpackageId], {
        steps: newSteps
      })
    }),
    workpackageToRemove: '',
    processing: false
  });
}

/**
 * Update a workpackage object.
 *
 * @param state
 *    the current state
 * @param action
 *    an UpdateWorkpackageAction
 * @return WorkingPlanState
 *    the new state.
 */
function updateWorkpackage(state: WorkingPlanState, action: UpdateWorkpackageSuccessAction): WorkingPlanState {
  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackageId]: action.payload.workpackage
    }),
    processing: false
  });
}

/**
 * Update all the workpackage objects.
 *
 * @param state
 *    the current state
 * @param action
 *    an UpdateAllWorkpackageSuccessAction
 * @return WorkingPlanState
 *    the new state.
 */
function updateAllWorkpackage(state: WorkingPlanState, action: UpdateAllWorkpackageSuccessAction): WorkingPlanState {
  action.payload.wpActionPackage.forEach((wp: WpActionPackage) => {
    state = Object.assign({}, state, {
      workpackages: Object.assign({}, state.workpackages, {
        [wp.workpackageId]: wp.workpackage
      })
    });
  });
  return Object.assign({}, state, {
    processing: true
  });
}

/**
 * Update a workpackage step object.
 *
 * @param state
 *    the current state
 * @param action
 *    an UpdateWorkpackageAction
 * @return WorkingPlanState
 *    the new state.
 */
function updateWorkpackageStep(state: WorkingPlanState, action: UpdateWorkpackageStepSuccessAction): WorkingPlanState {
  const steps = [...state.workpackages[action.payload.workpackageId].steps];
  const stepIndex = findIndex(steps, { id: action.payload.workpackageStepId });
  steps[stepIndex] = action.payload.workpackageStep;
  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackageId]: Object.assign({}, state.workpackages[action.payload.workpackageId], {
        steps: steps
      })
    }),
    processing: false
  });
}

/**
 * Update all the workpackage step objects.
 *
 * @param state
 *    the current state
 * @param action
 *    an UpdateAllWorkpackageStepSuccessAction
 * @return WorkingPlanState
 *    the new state.
 */
 function updateAllWorkpackageStep(state: WorkingPlanState, action: UpdateAllWorkpackageStepSuccessAction): WorkingPlanState {
  let steps;
  let stepIndex;
  action.payload.wpStepActionPackage.forEach((wp: WpStepActionPackage) => {
    steps = [...state.workpackages[wp.workpackageId].steps];
    stepIndex = findIndex(steps, { id: wp.workpackageStepId });
    steps[stepIndex] = wp.workpackageStep;
    state = Object.assign({}, state, {
      workpackages: Object.assign({}, state.workpackages, {
        [wp.workpackageId]: Object.assign({}, state.workpackages[wp.workpackageId], {
          steps: steps
        })
      })
    });
  });
  return Object.assign({}, state, {
    processing: false
  });
}

/**
 * Change a workpackage object order.
 *
 * @param state
 *    the current state
 * @param action
 *    an MoveWorkpackageAction
 * @return WorkingPlanState
 *    the new state.
 */
function moveWorkpackage(state: WorkingPlanState, action: MoveWorkpackageAction) {
  const keys = [...Object.keys(state.workpackages)];
  const toMove = keys[action.payload.oldIndex];
  const newWorpackages = {};

  keys.splice(action.payload.oldIndex, 1);
  keys.splice(action.payload.newIndex, 0, toMove);

  // create object in base of the new order
  keys.forEach((key) => {
    newWorpackages[key] = state.workpackages[key];
  });

  return Object.assign({}, state, {
    workpackages: newWorpackages,
    moving: true
  });
}

/**
 * Change a workpackage step object order.
 *
 * @param state
 *    the current state
 * @param action
 *    an MoveWorkpackageStepAction
 * @return WorkingPlanState
 *    the new state.
 */
function moveWorkpackageStep(state: WorkingPlanState, action: MoveWorkpackageStepAction) {
  const newSteps = [...state.workpackages[action.payload.workpackageId].steps];
  const toMove = newSteps[action.payload.oldIndex];
  newSteps.splice(action.payload.oldIndex, 1);
  newSteps.splice(action.payload.newIndex, 0, toMove);

  const newWorpackage = Object.assign({}, state.workpackages[action.payload.workpackageId], {
    steps: newSteps
  });

  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackageId]: newWorpackage
    }),
    moving: true
  });
}

/**
 * Revert a workpackage step order.
 *
 * @param state
 *    the current state
 * @param action
 *    an SaveWorkpackageStepsOrderErrorAction
 * @return WorkingPlanState
 *    the new state.
 */
function revertWorkpackageStepOrder(state: WorkingPlanState, action: SaveWorkpackageStepsOrderErrorAction): WorkingPlanState {
  const newWorpackage = Object.assign({}, state.workpackages[action.payload.workpackageId], {
    steps: action.payload.previousStepsState
  });

  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackageId]: newWorpackage
    }),
    moving: false
  });
}
