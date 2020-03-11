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
  AddWorkpackageStepAction,
  AddWorkpackageStepErrorAction,
  AddWorkpackageStepSuccessAction,
  AddWorkpackageSuccessAction,
  GenerateWorkpackageErrorAction,
  GenerateWorkpackageStepAction,
  GenerateWorkpackageStepErrorAction,
  GenerateWorkpackageStepSuccessAction,
  GenerateWorkpackageSuccessAction,
  InitWorkingplanAction,
  InitWorkingplanSuccessAction,
  RemoveWorkpackageAction,
  RemoveWorkpackageErrorAction,
  RemoveWorkpackageStepAction,
  RemoveWorkpackageStepErrorAction,
  RemoveWorkpackageStepSuccessAction,
  RemoveWorkpackageSuccessAction,
  RetrieveAllWorkpackagesErrorAction,
  UpdateWorkpackageAction,
  UpdateWorkpackageErrorAction, UpdateWorkpackageStepAction, UpdateWorkpackageStepErrorAction,
  UpdateWorkpackageSuccessAction,
  WorkpackageActionTypes
} from './working-plan.actions';
import { WorkingPlanService } from './working-plan.service';
import { Workpackage, WorkpackageStep } from './models/workpackage-step.model';
import {
  AddImpactPathwaySubTaskAction,
  GenerateImpactPathwayTaskAction,
  InitImpactPathwayErrorAction
} from '../impact-pathway/impact-pathway.actions';
import { Item } from '../shared/item.model';
import { isNotEmpty } from '../../shared/empty.util';
import { ItemAuthorityRelationService } from '../shared/item-authority-relation.service';

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
  @Effect({ dispatch: false }) generateAndAddErrors$ = this.actions$.pipe(
    ofType(
      WorkpackageActionTypes.ADD_WORKPACKAGE_ERROR,
      WorkpackageActionTypes.GENERATE_WORKPACKAGE_ERROR,
      WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.task.create.error'))
    }),
    tap((action: any) => {
      if (action.payload.modal) {
        action.payload.modal.close();
      }
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() generateStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP),
    switchMap((action: GenerateWorkpackageStepAction) => {
      return this.workingPlanService.generateWorkpackageStepItem(
        action.payload.parentId,
        action.payload.workpackageStepType,
        action.payload.metadata).pipe(
        map((item: Item) => new GenerateWorkpackageStepSuccessAction(
          action.payload.parentId,
          item,
          action.payload.modal)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new GenerateWorkpackageStepErrorAction(action.payload.modal))
        }));
    }));

  /**
   * Dispatch an AddImpactPathwayTaskAction
   */
  @Effect() generateStepSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP_SUCCESS),
    map((action: GenerateWorkpackageStepSuccessAction) => {
      return new AddWorkpackageStepAction(
        action.payload.parentId,
        action.payload.item.id,
        action.payload.modal)
    }));

  /**
   * Add task to a step
   */
  @Effect() addStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.ADD_WORKPACKAGE_STEP),
    concatMap((action: AddWorkpackageStepAction) => {
      return this.itemAuthorityRelationService.linkItemToParent(
        action.payload.parentId,
        action.payload.workpackageStepId,
        'workingplan.relation.parent',
        'workingplan.relation.step').pipe(
        map((taskItem: Item) => {
          return this.workingPlanService.initWorkpackageStepFromItem(taskItem, action.payload.parentId);
        }),
        map((step: WorkpackageStep) => {
          return new AddWorkpackageStepSuccessAction(
            action.payload.parentId,
            step,
            action.payload.modal);
        }),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new AddWorkpackageStepErrorAction(action.payload.modal))
        }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addStepSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.ADD_WORKPACKAGE_STEP_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.task.create.success'))
    }),
    tap((action: AddImpactPathwaySubTaskAction) => {
      if (action.payload.modal) {
        action.payload.modal.close();
      }
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.REMOVE_WORKPACKAGE),
    switchMap((action: RemoveWorkpackageAction) => {
      return this.itemAuthorityRelationService.unlinkParentItemFromChildren(
        action.payload.workpackageId,
        'workingplan.relation.parent',
        'workingplan.relation.step').pipe(
        map(() => new RemoveWorkpackageSuccessAction(
          action.payload.workpackageId)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new RemoveWorkpackageErrorAction())
        }));
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.REMOVE_WORKPACKAGE_STEP),
    switchMap((action: RemoveWorkpackageStepAction) => {
      return this.itemAuthorityRelationService.unlinkItemFromParent(
        action.payload.workpackageId,
        action.payload.workpackageStepId,
        'workingplan.relation.parent',
        'workingplan.relation.step').pipe(
        map(() => new RemoveWorkpackageStepSuccessAction(
          action.payload.workpackageId,
          action.payload.workpackageStepId)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new RemoveWorkpackageStepErrorAction())
        }));
    }));

  /**
   * Retrieve all workpackages for this workingplan
   */
  @Effect() retrieveAllWorkpackages$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.RETRIEVE_ALL_WORKPACKAGES),
    switchMap(() => {
      return this.workingPlanService.searchForAvailableWorpackages().pipe(
        map((items: Item[]) => new InitWorkingplanAction(items)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new RetrieveAllWorkpackagesErrorAction())
        }));
    }));

  /**
   * Add workpackages to workingplan state
   */
  @Effect() init$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.INIT_WORKINGPLAN),
    switchMap((action: InitWorkingplanAction) => {
      return this.workingPlanService.initWorkingPlan(action.payload.items).pipe(
        map((workpackages: Workpackage[]) => {
          if (isNotEmpty(workpackages)) {
            return new InitWorkingplanSuccessAction(workpackages)
          } else {
            return new InitImpactPathwayErrorAction()
          }
        }));
    }));

  /**
   * Update a workpackage into the state
   */
  @Effect() updateWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.UPDATE_WORKPACKAGE),
    switchMap((action: UpdateWorkpackageAction) => {
      return this.workingPlanService.updateMetadataItem(
        action.payload.workpackageId,
        action.payload.metadatumViewList
      ).pipe(
        map((items: Item) => new UpdateWorkpackageSuccessAction()),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new UpdateWorkpackageErrorAction(action.payload.workpackageId))
        }));
    }));

  /**
   * Update a workpackage into the state
   */
  @Effect() updateWorkpackageStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP),
    switchMap((action: UpdateWorkpackageStepAction) => {
      return this.workingPlanService.updateMetadataItem(
        action.payload.workpackageStepId,
        action.payload.metadatumViewList
      ).pipe(
        map((items: Item) => new UpdateWorkpackageSuccessAction()),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new UpdateWorkpackageStepErrorAction(
            action.payload.workpackageId,
            action.payload.workpackageStepId
          ))
        }));
    }));

  constructor(
    private actions$: Actions,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private notificationsService: NotificationsService,
    private store$: Store<any>,
    private translate: TranslateService,
    private workingPlanService: WorkingPlanService
  ) {
  }

}
