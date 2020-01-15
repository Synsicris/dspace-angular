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
export const ImpactPathwayActionTypes = {
  NEW_IMPACT_PATHWAY_OPERATION: type('dspace/core/impactpathway/NEW_IMPACT_PATHWAY_OPERATION'),
};

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to commit the current transaction
 */
export class NewImpactPathwayAction implements Action {
  type = ImpactPathwayActionTypes.NEW_IMPACT_PATHWAY_OPERATION;
  payload: {
    resourceType: string;
    resourceId: string;
  };

  /**
   * Create a new NewImpactPathwayAction
   *
   * @param resourceType
   *    the resource's type
   * @param resourceId
   *    the resource's ID
   */
  constructor(resourceType: string, resourceId: string) {
    this.payload = { resourceType, resourceId };
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type ImpactPathwayActions
  = NewImpactPathwayAction;
