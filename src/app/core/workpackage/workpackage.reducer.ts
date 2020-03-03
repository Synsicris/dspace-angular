import { WorkpackageStep } from './models/workpackage-step.model';
import { WorkpackageActions, WorkpackageActionTypes } from './workpackage.actions';

/**
 * An interface to represent impact pathways object entries
 */
export interface WorkpackageEntries {
  [workpackageId: string]: WorkpackageStep;
}

/**
 * The Impact Pathways State
 */
export interface WorkpackageState {
  objects: WorkpackageEntries;
  loaded: boolean;
  processing: boolean;
}

const workpackageInitialState: WorkpackageState = {
  objects: {},
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
export function workpackageReducer(state = workpackageInitialState, action: WorkpackageActions): WorkpackageState {
  switch (action.type) {

    case WorkpackageActionTypes.NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE: {
      return state
    }

    default: {
      return state;
    }
  }
}
