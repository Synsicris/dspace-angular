import { Injectable } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';

import {
  AddImpactPathwaySubTaskAction,
  AddImpactPathwaySubTaskSuccessAction,
  AddImpactPathwayTaskAction,
  AddImpactPathwayTaskErrorAction,
  AddImpactPathwayTaskSuccessAction,
  CompleteEditingImpactPathwayTaskLinksAction,
  GenerateImpactPathwayAction,
  GenerateImpactPathwayErrorAction,
  GenerateImpactPathwaySubTaskAction,
  GenerateImpactPathwaySubTaskSuccessAction,
  GenerateImpactPathwaySuccessAction,
  GenerateImpactPathwayTaskAction,
  GenerateImpactPathwayTaskErrorAction,
  GenerateImpactPathwayTaskSuccessAction,
  ImpactPathwayActionTypes,
  InitImpactPathwayAction,
  InitImpactPathwayErrorAction,
  InitImpactPathwaySuccessAction,
  NormalizeImpactPathwayObjectsOnRehydrateAction,
  PatchImpactPathwayMetadataAction,
  PatchImpactPathwayMetadataErrorAction,
  PatchImpactPathwayMetadataSuccessAction,
  PatchImpactPathwayTaskMetadataAction,
  PatchImpactPathwayTaskMetadataErrorAction,
  PatchImpactPathwayTaskMetadataSuccessAction,
  RemoveImpactPathwaySubTaskAction,
  RemoveImpactPathwaySubTaskSuccessAction,
  RemoveImpactPathwayTaskAction,
  RemoveImpactPathwayTaskErrorAction,
  RemoveImpactPathwayTaskSuccessAction,
  SaveImpactPathwayTaskLinksAction,
  SaveImpactPathwayTaskLinksErrorAction,
  SaveImpactPathwayTaskLinksSuccessAction,
  UpdateImpactPathwayAction,
  UpdateImpactPathwaySubTaskAction,
  UpdateImpactPathwayTaskAction
} from './impact-pathway.actions';
import { ImpactPathwayService } from './impact-pathway.service';
import { Item } from '../shared/item.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ImpactPathway } from './models/impact-pathway.model';
import { isNotEmpty } from '../../shared/empty.util';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { StoreActionTypes } from '../../store.actions';
import { ImpactPathwayState } from './impact-pathway.reducer';
import { ImpactPathwayLinksService } from './impact-pathway-links.service';

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
      return this.impactPathwayService.generateImpactPathwayItem(action.payload.name, '').pipe(
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
  @Effect({ dispatch: false }) generateSuccess$ = this.actions$.pipe(
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
  @Effect({ dispatch: false }) generateError$ = this.actions$.pipe(
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
        action.payload.metadata).pipe(
        map((item: Item) => new GenerateImpactPathwayTaskSuccessAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          item,
          action.payload.modal)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new GenerateImpactPathwayTaskErrorAction(action.payload.modal))
        }));
    }));

  /**
   * Dispatch an AddImpactPathwayTaskAction
   */
  @Effect() generateTaskSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_SUCCESS),
    map((action: GenerateImpactPathwayTaskSuccessAction) => {
      return new AddImpactPathwayTaskAction(
        action.payload.impactPathwayId,
        action.payload.stepId,
        action.payload.item.id,
        action.payload.modal)
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) generateTaskError$ = this.actions$.pipe(
    ofType(
      ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_ERROR,
      ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_ERROR,
      ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_TASK_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.task.create.error'))
    }),
    tap((action: AddImpactPathwaySubTaskAction) => {
      if (action.payload.modal) {
        action.payload.modal.close();
      }
    }));

  /**
   * Add task to a step
   */
  @Effect() addTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK),
    concatMap((action: AddImpactPathwayTaskAction) => {
      return this.impactPathwayService.linkTaskToParent(
        action.payload.stepId,
        action.payload.taskId).pipe(
        map((taskItem: Item) => {
          return this.impactPathwayService.initImpactPathwayTask(taskItem, action.payload.stepId);
        }),
        map((task: ImpactPathwayTask) => {
          return new AddImpactPathwayTaskSuccessAction(
            action.payload.impactPathwayId,
            action.payload.stepId,
            task,
            action.payload.modal);
        }),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new AddImpactPathwayTaskErrorAction(action.payload.modal))
        }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addTaskSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_SUCCESS),
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
  @Effect() generateSubTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK),
    switchMap((action: GenerateImpactPathwaySubTaskAction) => {
      return this.impactPathwayService.generateImpactPathwayTaskItem(
        action.payload.parentTaskId,
        action.payload.taskType,
        action.payload.metadata).pipe(
        map((item: Item) => new GenerateImpactPathwaySubTaskSuccessAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          action.payload.parentTaskId,
          item,
          action.payload.modal)
        ),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new GenerateImpactPathwayTaskErrorAction(action.payload.modal))
        }));
    }));

  /**
   * Dispatch an AddImpactPathwayTaskAction
   */
  @Effect() generateSubTaskSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK_SUCCESS),
    map((action: GenerateImpactPathwaySubTaskSuccessAction) => {
      return new AddImpactPathwaySubTaskAction(
        action.payload.impactPathwayId,
        action.payload.stepId,
        action.payload.parentTaskId,
        action.payload.item.id,
        action.payload.modal)
    }));

  /**
   * Add sub-task to a task
   */
  @Effect() addSubTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK),
    mergeMap((action: AddImpactPathwaySubTaskAction) => {
      return this.impactPathwayService.linkTaskToParent(
        action.payload.parentTaskId,
        action.payload.taskId).pipe(
        map((taskItem: Item) => {
          return this.impactPathwayService.initImpactPathwayTask(taskItem, action.payload.parentTaskId);
        }),
        map((task: ImpactPathwayTask) => {
          return new AddImpactPathwaySubTaskSuccessAction(
            action.payload.impactPathwayId,
            action.payload.stepId,
            action.payload.parentTaskId,
            task,
            action.payload.modal);
        }),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new AddImpactPathwayTaskErrorAction(action.payload.modal))
        }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addSubTaskSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.task.create.success'))
    }),
    tap((action: AddImpactPathwaySubTaskSuccessAction) => {
      if (action.payload.modal) {
        action.payload.modal.close();
      }
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK),
    switchMap((action: RemoveImpactPathwayTaskAction) => {
      return this.impactPathwayService.unlinkTaskFromParent(
        action.payload.parentId,
        action.payload.taskId,
        action.payload.taskPosition).pipe(
        map(() => new RemoveImpactPathwayTaskSuccessAction(
          action.payload.impactPathwayId,
          action.payload.parentId,
          action.payload.taskId)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new RemoveImpactPathwayTaskErrorAction())
        }));
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeSubTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUB_TASK),
    switchMap((action: RemoveImpactPathwaySubTaskAction) => {
      return this.impactPathwayService.unlinkTaskFromParent(
        action.payload.parentTaskId,
        action.payload.taskId,
        action.payload.taskPosition).pipe(
        map(() => new RemoveImpactPathwaySubTaskSuccessAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          action.payload.parentTaskId,
          action.payload.taskId)),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new RemoveImpactPathwayTaskErrorAction())
        }));
    }));

  /**
   * Patch an impactPathway task and dispatch PatchImpactPathwayMetadataSuccessAction
   */
  @Effect() patchMetadataImpactPathway$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_METADATA),
    switchMap((action: PatchImpactPathwayMetadataAction) => {
      return this.impactPathwayService.updateMetadataItem(
        action.payload.impactPathwayId,
        action.payload.metadata,
        action.payload.metadataIndex,
        action.payload.value
      ).pipe(
        map((item: Item) => new PatchImpactPathwayMetadataSuccessAction(
          action.payload.impactPathwayId,
          action.payload.oldImpactPathway,
          item
        )),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new PatchImpactPathwayMetadataErrorAction())
        }));
    }));

  /**
   * Update an impactPathway object
   */
  @Effect() patchMetadataImpactPathwaySuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_METADATA_SUCCESS),
    map((action: PatchImpactPathwayMetadataSuccessAction) => {
      return new UpdateImpactPathwayAction(
        action.payload.impactPathwayId,
        this.impactPathwayService.updateImpactPathway(action.payload.item, action.payload.oldImpactPathway)
      )
    })
  );

  /**
   * Patch an impactPathway task and dispatch PatchImpactPathwayTaskMetadataSuccessAction
   */
  @Effect() patchMetadataTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_TASK_METADATA),
    switchMap((action: PatchImpactPathwayTaskMetadataAction) => {
      return this.impactPathwayService.updateMetadataItem(
        action.payload.taskId,
        action.payload.metadata,
        action.payload.metadataIndex,
        action.payload.value
      ).pipe(
        map((item: Item) => new PatchImpactPathwayTaskMetadataSuccessAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          action.payload.taskId,
          action.payload.oldTask,
          item,
          action.payload.parentTaskId
        )),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new PatchImpactPathwayTaskMetadataErrorAction())
        }));
    }));

  /**
   * update an impactPathway task object
   */
  @Effect() patchMetadataSuccessTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_TASK_METADATA_SUCCESS),
    map((action: PatchImpactPathwayTaskMetadataSuccessAction) => {
      if (isNotEmpty(action.payload.parentTaskId)) {
        return new UpdateImpactPathwaySubTaskAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          action.payload.parentTaskId,
          action.payload.taskId,
          this.impactPathwayService.updateImpactPathwayTask(action.payload.item, action.payload.oldTask)
        )
      } else {
        return new UpdateImpactPathwayTaskAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          action.payload.taskId,
          this.impactPathwayService.updateImpactPathwayTask(action.payload.item, action.payload.oldTask)
        )
      }
    })
  );

  /**
   * Patch an impactPathway task and dispatch PatchImpactPathwayTaskMetadataSuccessAction
   */
  @Effect() patchTaskRelations$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.SAVE_IMPACT_PATHWAY_TASK_LINKS),
    switchMap((action: SaveImpactPathwayTaskLinksAction) => {
      return this.impactPathwayLinksService.saveLinks(
        action.payload.impactPathwayTaskId,
        action.payload.toSave,
        action.payload.toDelete
      ).pipe(
        map(() => new SaveImpactPathwayTaskLinksSuccessAction()),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new SaveImpactPathwayTaskLinksErrorAction())
        }));
    })
  );

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) patchMetadataError$ = this.actions$.pipe(
    ofType(
      ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_TASK_METADATA_ERROR,
      ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_METADATA_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.patch.metadata.error'))
    }));

  /**
   * update impactPathway task relations
   */
  @Effect() completeEditingTaskRelations$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.COMPLETE_EDITING_IMPACT_PATHWAY_TASK_LINKS),
    withLatestFrom(this.store$),
    map(([action, currentState]: [CompleteEditingImpactPathwayTaskLinksAction, any]) => {
      const impactPathwayState: ImpactPathwayState = currentState.core.impactPathway;
      return new SaveImpactPathwayTaskLinksAction(
        impactPathwayState.links.selectedTaskId,
        impactPathwayState.links.toSave,
        impactPathwayState.links.toDelete
      )
    })
  );

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
    private impactPathwayLinksService: ImpactPathwayLinksService,
    private notificationsService: NotificationsService,
    private store$: Store<any>,
    private translate: TranslateService
  ) {
  }

}
