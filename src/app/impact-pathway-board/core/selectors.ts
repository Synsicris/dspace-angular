import { createSelector, MemoizedSelector } from '@ngrx/store';

import { ImpactPathwayState } from './impact-pathway.reducer';
import { AppState } from '../../app.reducer';
import { isNotEmpty } from '../../shared/empty.util';
import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';

function impactPathwayKeySelector<T>(key: string, selector): MemoizedSelector<AppState, ImpactPathway> {
  return createSelector(selector, (state: ImpactPathwayState) => {
    if (isNotEmpty(state) && isNotEmpty(state.objects)) {
      return state.objects[key];
    } else {
      return undefined;
    }
  });
}
function impactPathwaySubTaskCollapsableSelector<T>(key: string, stepId: string, selector): MemoizedSelector<AppState, ImpactPathwayTask> {
  return createSelector(selector, (state: ImpactPathwayState) => {
    if (isNotEmpty(state) && isNotEmpty(state.collapsed) && isNotEmpty(state.collapsed[key]) && isNotEmpty(state.collapsed[key][stepId])) {
      return state.collapsed[key][stepId];
    } else {
      return true;
    }
  });
}

/**
 * Returns the imapct pathway state.
 * @function _getImpactPathwayState
 * @param {AppState} state Top level state.
 * @return {ImpactPathwayState}
 */
const _getImpactPathwayState = (state: any) => state.impactPathway;

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
 * Returns true if the user a operation is processing.
 * @function isImpactPathwayProcessingSelector
 * @return {boolean}
 */
export const isImpactPathwayCompareProcessingSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.compareProcessing
);

/**
 * Returns true if the user a delete operation is processing.
 * @function isImpactPathwayRemovingSelector
 * @return {boolean}
 */
export const isImpactPathwayRemovingSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.removing
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
 * @return {ImpactPathwayLinks}
 */
export const impactPathwayRelationsSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.links
);

/**
 * Returns the ImpactPathwayState object.
 * @function exploitationPlanByIDSelector
 * @param {string} exploitationPlanId
 * @return {ImpactPathwayState}
 */
export function impactPathwaySubTaskCollapsable(impactPathwayStepId: string, impactPathwayTaskId: string): MemoizedSelector<AppState, ImpactPathwayTask> {
  return impactPathwaySubTaskCollapsableSelector<ImpactPathwayTask>(impactPathwayStepId, impactPathwayTaskId, impactPathwayStateSelector);
}

/**
 * Returns true if compare mose id active.
 * @function isCompareMode
 * @return {boolean}
 */
export const isCompareMode = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.compareMode || false
);

/**
 * Returns the compare ImpactPathway Id.
 * @function compareImpactPathwayId
 * @return {string}
 */
export const compareImpactPathwayIdSelector = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.compareImpactPathwayId || null
);

/**
 * Returns the compare ImpactPathway step Id.
 * @function compareImpactPathwayStepId
 * @return {string}
 */
export const compareImpactPathwayStepId = createSelector(_getImpactPathwayState,
  (state: ImpactPathwayState) => state.compareImpactPathwayStepId || null
);

