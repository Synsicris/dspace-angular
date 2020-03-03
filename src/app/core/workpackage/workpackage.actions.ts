import { Action } from '@ngrx/store';

import { type } from '../../shared/ngrx/type';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const WorkpackageActionTypes = {
  NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE: type('dspace/core/impactpathway/NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE'),
};

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to normalize state object on rehydrate
 */
export class NormalizeWorkpackageObjectsOnRehydrateAction implements Action {
  type = WorkpackageActionTypes.NORMALIZE_WORKPACKAGE_OBJECTS_ON_REHYDRATE;
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type WorkpackageActions
  = NormalizeWorkpackageObjectsOnRehydrateAction;
