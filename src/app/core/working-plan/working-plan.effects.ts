import { Injectable } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';

import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  AddWorkpackageAction,
  AddWorkpackageErrorAction,
  AddWorkpackageSuccessAction,
  GenerateWorkpackageErrorAction,
  GenerateWorkpackageSuccessAction,
  RetrieveAllWorkpackagesErrorAction,
  RetrieveAllWorkpackagesSuccessAction,
  WorkpackageActionTypes
} from './working-plan.actions';
import { WorkingPlanService } from './working-plan.service';
import { Workpackage } from './models/workpackage-step.model';
import { GenerateImpactPathwayTaskAction } from '../impact-pathway/impact-pathway.actions';
import { Item } from '../shared/item.model';

/**
 * Provides effect methods for jsonPatch Operations actions
 */
@Injectable()
export class WorkingPlanEffects {

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() generateWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.GENERATE_WORKPACKAGE),
    switchMap((action: GenerateImpactPathwayTaskAction) => {
      return this.workingPlanService.generateWorkpackageItem(
        action.payload.metadata).pipe(
        map((item: Item) => new GenerateWorkpackageSuccessAction(
          item,
          action.payload.modal)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new GenerateWorkpackageErrorAction(action.payload.modal))
        }));
    }));

  /**
   * Dispatch an AddImpactPathwayTaskAction
   */
  @Effect() generateWorkpackageSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.GENERATE_WORKPACKAGE_SUCCESS),
    map((action: GenerateWorkpackageSuccessAction) => {
      return new AddWorkpackageAction(action.payload.item.id, action.payload.modal)
    }));

  /**
   * Add workpackage
   */
  @Effect() addWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.ADD_WORKPACKAGE),
    concatMap((action: AddWorkpackageAction) => {
      return this.workingPlanService.getWorkpackageItemById(action.payload.workpackageId).pipe(
        map((workpackageItem: Item) => {
          return this.workingPlanService.initWorkpackageFromItem(workpackageItem);
        }),
        map((workpackage: Workpackage) => {
          return new AddWorkpackageSuccessAction(
            workpackage,
            action.payload.modal);
        }),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new AddWorkpackageErrorAction(action.payload.modal))
        }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addTaskSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.ADD_WORKPACKAGE_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.task.create.success'))
    }),
    tap((action: AddWorkpackageSuccessAction) => {
      if (action.payload.modal) {
        action.payload.modal.close();
      }
    }));

  /**
   * Show a notification on error
   */
  @Effect({ dispatch: false }) generateTaskError$ = this.actions$.pipe(
    ofType(
      WorkpackageActionTypes.ADD_WORKPACKAGE_ERROR,
      WorkpackageActionTypes.GENERATE_WORKPACKAGE_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.task.create.error'))
    }),
    tap((action: any) => {
      if (action.payload.modal) {
        action.payload.modal.close();
      }
    }));

  /**
   * Dispatches a FlushPatchOperationsAction for every dispatched CommitPatchOperationsAction
   */
  @Effect() retrieveAllWorkpackages$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.RETRIEVE_ALL_WORKPACKAGES),
    switchMap(() => {
      return this.workingPlanService.searchForAvailableWorpackages().pipe(
        map((workpackages: Workpackage[]) => new RetrieveAllWorkpackagesSuccessAction(workpackages)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new RetrieveAllWorkpackagesErrorAction())
        }));
    }));

  constructor(
    private actions$: Actions,
    private notificationsService: NotificationsService,
    private store$: Store<any>,
    private translate: TranslateService,
    private workingPlanService: WorkingPlanService
  ) {
  }

}
