import { findIndex, get, remove } from 'lodash';

import { Workpackage } from './models/workpackage-step.model';
import {
  AddWorkpackageStepSuccessAction,
  AddWorkpackageSuccessAction,
  InitWorkingplanSuccessAction, MoveWorkpackageAction, MoveWorkpackageStepAction,
  RemoveWorkpackageAction,
  RemoveWorkpackageStepAction,
  RemoveWorkpackageStepSuccessAction,
  RemoveWorkpackageSuccessAction, SaveWorkpackageStepsOrderErrorAction,
  UpdateWorkpackageAction,
  UpdateWorkpackageStepAction,
  WorkingPlanActions,
  WorkpackageActionTypes
} from './working-plan.actions';
import { ImpactPathwayState } from '../impact-pathway/impact-pathway.reducer';

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
  loaded: boolean;
  processing: boolean;
  moving: boolean;
  chartDateView: ChartDateViewType;
}

const workpackageInitialState: WorkingPlanState = {
  workpackages: {},
  workpackageToRemove: '',
  loaded: false,
  processing: false,
  moving: false,
  chartDateView: ChartDateViewType.month
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

    case WorkpackageActionTypes.RETRIEVE_ALL_WORKPACKAGES: {
      return Object.assign({}, workpackageInitialState, {
        processing: true
      });
    }

    case WorkpackageActionTypes.GENERATE_WORKPACKAGE:
    case WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP:
    case WorkpackageActionTypes.ADD_WORKPACKAGE_STEP: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case WorkpackageActionTypes.ADD_WORKPACKAGE_SUCCESS: {
      return addWorkpackage(state, action as AddWorkpackageSuccessAction);
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
      return updateWorkpackage(state, action as UpdateWorkpackageAction);
    }

    case WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP: {
      return updateWorkpackageStep(state, action as UpdateWorkpackageStepAction);
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
      return state
    }

    default: {
      return state;
    }
  }
}

/**
 * Add a workpackage object.
 *
 * @param state
 *    the current state
 * @param action
 *    an AddWorkpackageSuccessAction
 * @return WorkingPlanState
 *    the new state.
 */
function addWorkpackage(state: WorkingPlanState, action: AddWorkpackageSuccessAction): WorkingPlanState {
  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackage.id]: action.payload.workpackage
    }),
    processing: false
  })
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
    processing: false
  })
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
    loaded: true
  })
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
  })
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
  })
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
function updateWorkpackage(state: WorkingPlanState, action: UpdateWorkpackageAction): WorkingPlanState {
  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackageId]: action.payload.workpackage
    }),
    processing: false
  })
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
function updateWorkpackageStep(state: WorkingPlanState, action: UpdateWorkpackageStepAction): WorkingPlanState {

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
  })
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
  const toMove = get(state.workpackages, action.payload.workpackageId);
  const oldValue = get(state.workpackages, Object.keys(state.workpackages)[action.payload.newIndex])

  const newWorpackages = {};

  Object.keys(state.workpackages)
    .forEach((workpackageId, index) => {
      if (index === action.payload.oldIndex) {
        newWorpackages[oldValue.id] = oldValue;
      } else if (index === action.payload.newIndex) {
        newWorpackages[toMove.id] = toMove;
      } else {
        newWorpackages[workpackageId] = state.workpackages[workpackageId]
      }
    });

  return Object.assign({}, state, {
    workpackages: newWorpackages,
    moving: true
  })
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
  const toMove = state.workpackages[action.payload.workpackageId].steps[action.payload.oldIndex];
  const oldValue = state.workpackages[action.payload.workpackageId].steps[action.payload.newIndex];
  const newSteps = [...state.workpackages[action.payload.workpackageId].steps];

  newSteps[action.payload.newIndex] = toMove;
  newSteps[action.payload.oldIndex] = oldValue;

  const newWorpackage = Object.assign({}, state.workpackages[action.payload.workpackageId], {
    steps: newSteps
  });

  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackageId]: newWorpackage
    }),
    moving: true
  })
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
  })
}
