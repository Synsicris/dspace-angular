
import { JsonPatchOperationsState } from '../json-patch/json-patch-operations.reducer';
import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayActions, ImpactPathwayActionTypes } from './impact-pathway.actions';

/**
 * An interface to represent impact pathways object entries
 */
export interface ImpactPathwayEntries {
  [impactPathwayId: string]: ImpactPathway;
}

/**
 * The Impact Pathways State
 */
export interface ImpactPathwaysState {
  impactPathways: ImpactPathwayEntries;
  loading: boolean;
}

const initialState: ImpactPathwaysState = Object.create({
  impactPathways: {},
  loading: true
});

/**
 * The Impact Pathways Reducer
 *
 * @param state
 *    the current state
 * @param action
 *    the action to perform on the state
 * @return ImpactPathwaysState
 *    the new state
 */
export function impactPathwayReducer(state = initialState, action: ImpactPathwayActions): ImpactPathwaysState {
  switch (action.type) {

    case ImpactPathwayActionTypes.NEW_IMPACT_PATHWAY_OPERATION: {
      return state;
    }

    default: {
      return state;
    }
  }
}
