import { createSelector, MemoizedSelector } from '@ngrx/store';

import { ImpactPathwayState } from './impact-pathway.reducer';
import { AppState } from '../../app.reducer';
import { isNotEmpty } from '../../shared/empty.util';
import { ImpactPathway } from './models/impact-pathway.model';

function impactPathwayKeySelector<T>(key: string, selector): MemoizedSelector<AppState, ImpactPathway> {
  return createSelector(selector, (state: ImpactPathwayState) => {
    if (isNotEmpty(state) && isNotEmpty(state.objects)) {
      return state.objects[key];
    } else {
      return undefined;
    }
  });
}

/**
 * Returns the imapct pathway state.
 * @function _getImpactPathwayState
 * @param {AppState} state Top level state.
 * @return {ImpactPathwayState}
 */
const _getImpactPathwayState = (state: any) => state.core.impactPathway;

/**
 * Returns the impact pathway state.
 * @function impactPathwayStateSelector
 * @return {ImpactPathwayState}
 */
export const impactPathwayStateSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state
);

/**
 * Returns all the impact pathway entries.
 * @function impactPathwayObjectsSelector
 * @return {ImpactPathwayEntries}
 */
export const impactPathwayObjectsSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.objects
);

/**
 * Returns true if impact pathway objects are loaded.
 * @function isImpactPathwayLoadedSelector
 * @return {boolean}
 */
export const isImpactPathwayLoadedSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.loaded
);

/**
 * Returns true if the user a operation is processing.
 * @function isImpactPathwayProcessingSelector
 * @return {boolean}
 */
export const isImpactPathwayProcessingSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.processing
);

/**
 * Returns the ImpactPathway object.
 * @function impactPathwayByIDSelector
 * @param {string} impactPathwayId
 * @return {ImpactPathway}
 */
export function impactPathwayByIDSelector(impactPathwayId: string): MemoizedSelector<AppState, ImpactPathway> {
  return impactPathwayKeySelector<ImpactPathway>(impactPathwayId, impactPathwayStateSelector);
}

/**
 * Returns the impact pathway relations object.
 * @function impactPathwayRelationsSelector
 * @return {ImpactPathwayRelations}
 */
export const impactPathwayRelationsSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.relations
);
