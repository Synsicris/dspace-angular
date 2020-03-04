import { Workpackage } from './models/workpackage-step.model';
import {
  AddWorkpackageSuccessAction,
  RetrieveAllWorkpackagesSuccessAction,
  WorkingPlanActions,
  WorkpackageActionTypes
} from './working-plan.actions';
import { ImpactPathwayState } from '../impact-pathway/impact-pathway.reducer';

/**
 * An interface to represent impact pathways object entries
 */
export interface WorkpackageEntries {
  [workpackageId: string]: Workpackage;
}

/**
 * The Impact Pathways State
 */
export interface WorkingPlanState {
  workpackages: WorkpackageEntries;
  loaded: boolean;
  processing: boolean;
}

const workpackageInitialState: WorkingPlanState = {
  workpackages: {},
  loaded: false,
  processing: false,
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

    case WorkpackageActionTypes.RETRIEVE_ALL_WORKPACKAGES: {
      return Object.assign({}, workpackageInitialState, {
        processing: true
      });
    }

    case WorkpackageActionTypes.GENERATE_WORKPACKAGE: {
      return Object.assign({}, state, {
        processing: true
      });
    }

    case WorkpackageActionTypes.ADD_WORKPACKAGE_SUCCESS: {
      return addWorkpackage(state, action as AddWorkpackageSuccessAction);
    }

    case WorkpackageActionTypes.ADD_WORKPACKAGE_ERROR:
    case WorkpackageActionTypes.GENERATE_WORKPACKAGE_ERROR: {
      return Object.assign({}, state, {
        processing: false
      });
    }

    case WorkpackageActionTypes.RETRIEVE_ALL_WORKPACKAGES_SUCCESS: {
      return initWorkpackages(state, action as RetrieveAllWorkpackagesSuccessAction);
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
 * Init a workpackages objects.
 *
 * @param state
 *    the current state
 * @param action
 *    an RetrieveAllWorkpackagesSuccessAction
 * @return WorkingPlanState
 *    the new state.
 */
function addWorkpackage(state: WorkingPlanState, action: AddWorkpackageSuccessAction): WorkingPlanState {
  const workpackages = Object.assign({}, state.workpackages, {
    [action.payload.workpackage.id]: action.payload.workpackage
  });

  return Object.assign({}, state, {
    workpackages: workpackages,
    processing: false,
    loaded: true
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
function initWorkpackages(state: WorkingPlanState, action: RetrieveAllWorkpackagesSuccessAction): WorkingPlanState {
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
