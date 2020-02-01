import { Injectable } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';

import {
  AddImpactPathwayTaskAction, AddImpactPathwayTaskErrorAction, AddImpactPathwayTaskSuccessAction,
  GenerateImpactPathwayAction,
  GenerateImpactPathwayErrorAction,
  GenerateImpactPathwaySuccessAction,
  GenerateImpactPathwayTaskAction,
  GenerateImpactPathwayTaskErrorAction,
  GenerateImpactPathwayTaskSuccessAction,
  ImpactPathwayActionTypes,
  InitImpactPathwayAction,
  InitImpactPathwayErrorAction,
  InitImpactPathwaySuccessAction, NormalizeImpactPathwayObjectsOnRehydrateAction
} from './impact-pathway.actions';
import { ImpactPathwayService } from './impact-pathway.service';
import { Item } from '../shared/item.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ImpactPathway } from './models/impact-pathway.model';
import { isNotEmpty } from '../../shared/empty.util';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { StoreActionTypes } from '../../store.actions';
import { ResetObjectCacheTimestampsAction } from '../cache/object-cache.actions';

/**
 * Provides effect methods for jsonPatch Operations actions
 */
@Injectable()
export class ImpactPathwayEffects {

  /**
   * Dispatches a FlushPatchOperationsAction for every dispatched CommitPatchOperationsAction
   */
  @Effect() generate$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY),
    switchMap((action: GenerateImpactPathwayAction) => {
      return this.impactPathwayService.generateImpactPathwayItem(action.payload.name).pipe(
        tap(() => {
          if (action.payload.modal) {
            action.payload.modal.close();
          }
        }),
        map((item: Item) => new GenerateImpactPathwaySuccessAction(item)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new GenerateImpactPathwayErrorAction())
        }));
    }));

  /**
   * Show a notification on success and redirect to impact pathway edit page
   */
  @Effect({dispatch: false}) generateSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.create.success'))
    }),
    tap((action: GenerateImpactPathwaySuccessAction) => {
      this.impactPathwayService.redirectToEditPage(action.payload.item.id)
    }));

  /**
   * Show a notification on error
   */
  @Effect({dispatch: false}) generateError$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.create.error'))
    }));

  /**
   * Dispatches a FlushPatchOperationsAction for every dispatched CommitPatchOperationsAction
   */
  @Effect() init$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.INIT_IMPACT_PATHWAY),
    switchMap((action: InitImpactPathwayAction) => {
      return this.impactPathwayService.initImpactPathway(action.payload.item).pipe(
        map((object: ImpactPathway) => {
          if (isNotEmpty(object)) {
            return new InitImpactPathwaySuccessAction(object.id, object)
          } else {
            return new InitImpactPathwayErrorAction()
          }
        }));
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() generateTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK),
    switchMap((action: GenerateImpactPathwayTaskAction) => {
      return this.impactPathwayService.generateImpactPathwayTaskItem(
        action.payload.stepId,
        action.payload.taskType,
        action.payload.title,
        action.payload.description).pipe(
        tap((i) => {
          console.log('task!!!!!!!!!!!!!1', i);
          if (action.payload.modal) {
            action.payload.modal.close();
          }
        }),
        map((item: Item) => new GenerateImpactPathwayTaskSuccessAction(action.payload.impactPathwayId, action.payload.stepId, item)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new GenerateImpactPathwayTaskErrorAction())
        }));
    }));

  /**
   * Dispatch an AddImpactPathwayTaskAction
   */
  @Effect() generateTaskSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_SUCCESS),
    map((action: GenerateImpactPathwayTaskSuccessAction) => {
      return new AddImpactPathwayTaskAction(action.payload.impactPathwayId, action.payload.stepId, action.payload.item)
    }));

  /**
   * Show a notification on error
   */
  @Effect({dispatch: false}) generateTaskError$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_ERROR, ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.create.error'))
    }));

  /**
   * Add task to a step
   */
  @Effect() addTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK),
    switchMap((action: AddImpactPathwayTaskAction) => {
      return this.impactPathwayService.addTaskToStep(
        action.payload.stepId,
        action.payload.item).pipe(
          map(() => {
            return this.impactPathwayService.initImpactPathwayTask(action.payload.stepId, action.payload.item);
          }),
          map((task: ImpactPathwayTask) => {
            return new AddImpactPathwayTaskSuccessAction(action.payload.impactPathwayId, action.payload.stepId, task);
          }),
          catchError((error: Error) => {
            console.error(error.message);
            return observableOf(new AddImpactPathwayTaskErrorAction())
          }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({dispatch: false}) addTaskSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.create.success'))
    }));

  /**
   * When the store is rehydrated objects in the state lose the prototypes,
   * so restore them
   */
  @Effect() normalizeObjectsOnRehydrate = this.actions$
    .pipe(ofType(StoreActionTypes.REHYDRATE),
      map(() => new NormalizeImpactPathwayObjectsOnRehydrateAction())
    );

  constructor(
    private actions$: Actions,
    private impactPathwayService: ImpactPathwayService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {}

}
