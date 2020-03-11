import { remove } from 'lodash';

import { Workpackage } from './models/workpackage-step.model';
import {
  AddWorkpackageStepSuccessAction,
  AddWorkpackageSuccessAction,
  InitWorkingplanSuccessAction,
  RemoveWorkpackageAction,
  RemoveWorkpackageStepAction,
  RemoveWorkpackageStepSuccessAction,
  RemoveWorkpackageSuccessAction, UpdateWorkpackageAction,
  WorkingPlanActions,
  WorkpackageActionTypes
} from './working-plan.actions';
import { ImpactPathwayState } from '../impact-pathway/impact-pathway.reducer';

export enum ChartDateViewType {
  day = 'day',
  month = 'month',
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
  chartDateView: ChartDateViewType;
}

const workpackageInitialState: WorkingPlanState = {
  workpackages: {},
  workpackageToRemove: '',
  loaded: false,
  processing: false,
  chartDateView: ChartDateViewType.day
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
    case WorkpackageActionTypes.GENERATE_WORKPACKAGE_ERROR: {
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
  const newWorpackage = Object.assign({}, state.workpackages[action.payload.workpackageId], {
    steps: remove(state.workpackages[action.payload.workpackageId].steps, (innerTask) => {
      return innerTask.id !== action.payload.workpackageStepId;
    })
  });

  return Object.assign({}, state, {
    workpackages: Object.assign({}, state.workpackages, {
      [action.payload.workpackageId]: newWorpackage
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
      [action.payload.workpackage.id]: action.payload.workpackage
    }),
    processing: false
  })
}
