import { createSelector, MemoizedSelector } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { isNotEmpty } from '../../shared/empty.util';
import { WorkingPlanState } from './working-plan.reducer';
import { Workpackage } from './models/workpackage-step.model';

function workpackageKeySelector<T>(key: string, selector): MemoizedSelector<AppState, Workpackage> {
  return createSelector(selector, (state: WorkingPlanState) => {
    if (isNotEmpty(state) && isNotEmpty(state.workpackages)) {
      return state.workpackages[key];
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
const _getWorkingPlanState = (state: any) => state.core.workingplan;

/**
 * Returns the impact pathway state.
 * @function impactPathwayStateSelector
 * @return {ImpactPathwayState}
 */
export const workingPlanStateSelector = createSelector(_getWorkingPlanState,
  (state: WorkingPlanState) => state
);

/**
 * Returns all the impact pathway entries.
 * @function impactPathwayObjectsSelector
 * @return {ImpactPathwayEntries}
 */
export const workpackagesSelector = createSelector(workingPlanStateSelector,
  (state: WorkingPlanState) => state.workpackages
);

/**
 * Returns true if working plan objects are loaded.
 * @function isWorkingPlanLoadedSelector
 * @return {boolean}
 */
export const isWorkingPlanLoadedSelector = createSelector(_getWorkingPlanState,
  (state: WorkingPlanState) => state.loaded
);

/**
 * Returns true if the user a operation is processing.
 * @function isWorkingPlanProcessingSelector
 * @return {boolean}
 */
export const isWorkingPlanProcessingSelector = createSelector(_getWorkingPlanState,
  (state: WorkingPlanState) => state.processing
);

/**
 * Returns workpackage id to remove.
 * @function workpackageToRemoveSelector
 * @return {boolean}
 */
export const workpackageToRemoveSelector = createSelector(_getWorkingPlanState,
  (state: WorkingPlanState) => state.workpackageToRemove
);

/**
 * Returns chart date view.
 * @function chartDateViewSelector
 * @return {boolean}
 */
export const chartDateViewSelector = createSelector(_getWorkingPlanState,
  (state: WorkingPlanState) => state.chartDateView
);

/**
 * Returns the Workpackage object.
 * @function workpackageByIDSelector
 * @param {string} workpackageId
 * @return {Workpackage}
 */
export function workpackageByIDSelector(workpackageId: string): MemoizedSelector<AppState, Workpackage> {
  return workpackageKeySelector<Workpackage>(workpackageId, workingPlanStateSelector);
}
