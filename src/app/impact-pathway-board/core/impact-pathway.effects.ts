import { Injectable } from '@angular/core';

import { from as observableFrom, of as observableOf } from 'rxjs';
import { catchError, concatMap, map, mergeMap, reduce, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  AddImpactPathwaySubTaskAction,
  AddImpactPathwaySubTaskSuccessAction,
  AddImpactPathwayTaskAction,
  AddImpactPathwayTaskErrorAction,
  AddImpactPathwayTaskSuccessAction,
  ClearImpactPathwayAction,
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
  MoveImpactPathwaySubTaskAction,
  MoveImpactPathwaySubTaskErrorAction,
  MoveImpactPathwaySubTaskSuccessAction,
  NormalizeImpactPathwayObjectsOnRehydrateAction,
  OrderImpactPathwaySubTasksAction,
  OrderImpactPathwaySubTasksErrorAction,
  OrderImpactPathwaySubTasksSuccessAction,
  OrderImpactPathwayTasksAction,
  OrderImpactPathwayTasksErrorAction,
  OrderImpactPathwayTasksSuccessAction,
  PatchImpactPathwayMetadataAction,
  PatchImpactPathwayMetadataErrorAction,
  PatchImpactPathwayMetadataSuccessAction,
  PatchImpactPathwayTaskMetadataAction,
  PatchImpactPathwayTaskMetadataErrorAction,
  PatchImpactPathwayTaskMetadataSuccessAction,
  RemoveImpactPathwayAction,
  RemoveImpactPathwayErrorAction,
  RemoveImpactPathwayStepAction,
  RemoveImpactPathwayStepErrorAction,
  RemoveImpactPathwayStepSuccessAction,
  RemoveImpactPathwaySubTaskAction,
  RemoveImpactPathwaySubTaskSuccessAction,
  RemoveImpactPathwaySuccessAction,
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
import { Item } from '../../core/shared/item.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ImpactPathway } from './models/impact-pathway.model';
import { isNotEmpty } from '../../shared/empty.util';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { StoreActionTypes } from '../../store.actions';
import { ImpactPathwayState } from './impact-pathway.reducer';
import { ImpactPathwayLinksService } from './impact-pathway-links.service';
import { ItemAuthorityRelationService } from '../../core/shared/item-authority-relation.service';
import { ImpactPathwayLinksMap } from './models/impact-pathway-task-links-map';
import { environment } from '../../../environments/environment';
import { MetadataValue } from '../../core/shared/metadata.models';
import { SubmissionObjectActionTypes } from '../../submission/objects/submission-objects.actions';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';

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
      return this.impactPathwayService.generateImpactPathwayItem(action.payload.projectId, action.payload.name, '').pipe(
        tap(() => {
          this.modalService.dismissAll();
        }),
        map((item: Item) => new GenerateImpactPathwaySuccessAction(action.payload.projectId, item)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new GenerateImpactPathwayErrorAction());
        }));
    }));

  /**
   * Show a notification on success and redirect to impact pathway edit page
   */
  @Effect({ dispatch: false }) generateSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.create.success'));
    }),
    tap((action: GenerateImpactPathwaySuccessAction) => {
      this.impactPathwayService.redirectToEditPage(action.payload.projectId ,action.payload.item.id);
    }));

  /**
   * Show a notification on error
   */
  @Effect({ dispatch: false }) generateError$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.create.error'));
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
            return new InitImpactPathwaySuccessAction(object.id, object);
          } else {
            return new InitImpactPathwayErrorAction();
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
        action.payload.projectId,
        action.payload.stepId,
        action.payload.taskType,
        action.payload.metadata).pipe(
        map((item: Item) => new GenerateImpactPathwayTaskSuccessAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          item)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new GenerateImpactPathwayTaskErrorAction());
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
        action.payload.item.id);
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
      this.notificationsService.error(null, this.translate.get('impact-pathway.task.create.error'));
    }),
    tap((action: AddImpactPathwaySubTaskAction) => {
      this.modalService.dismissAll();
    }));

  /**
   * Add task to a step
   */
  @Effect() addTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK),
    concatMap((action: AddImpactPathwayTaskAction) => {
      return this.itemAuthorityRelationService.addLinkedItemToParent(
        action.payload.stepId,
        action.payload.taskId,
        environment.impactPathway.impactPathwayTaskRelationMetadata).pipe(
        map((taskItem: Item) => {
          return this.impactPathwayService.initImpactPathwayTask(taskItem, action.payload.stepId);
        }),
        map((task: ImpactPathwayTask) => {
          return new AddImpactPathwayTaskSuccessAction(
            action.payload.impactPathwayId,
            action.payload.stepId,
            task);
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new AddImpactPathwayTaskErrorAction());
        }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addTaskSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_TASK_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.task.create.success'));
    }),
    tap((action: AddImpactPathwaySubTaskAction) => {
      this.modalService.dismissAll();
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() generateSubTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.GENERATE_IMPACT_PATHWAY_SUB_TASK),
    switchMap((action: GenerateImpactPathwaySubTaskAction) => {
      return this.impactPathwayService.generateImpactPathwayTaskItem(
        action.payload.projectId,
        action.payload.parentTaskId,
        action.payload.taskType,
        action.payload.metadata).pipe(
        map((item: Item) => new GenerateImpactPathwaySubTaskSuccessAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          action.payload.parentTaskId,
          item)
        ),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new GenerateImpactPathwayTaskErrorAction());
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
        action.payload.item.id);
    }));

  /**
   * Add sub-task to a task
   */
  @Effect() addSubTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK),
    concatMap((action: AddImpactPathwaySubTaskAction) => {
      return this.itemAuthorityRelationService.addLinkedItemToParent(
        action.payload.parentTaskId,
        action.payload.taskId,
        environment.impactPathway.impactPathwayTaskRelationMetadata
      ).pipe(
        map((taskItem: Item) => {
          return this.impactPathwayService.initImpactPathwayTask(taskItem, action.payload.parentTaskId);
        }),
        map((task: ImpactPathwayTask) => {
          return new AddImpactPathwaySubTaskSuccessAction(
            action.payload.impactPathwayId,
            action.payload.stepId,
            action.payload.parentTaskId,
            task);
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new AddImpactPathwayTaskErrorAction());
        }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addSubTaskSuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ADD_IMPACT_PATHWAY_SUB_TASK_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.task.create.success'));
    }),
    tap((action: AddImpactPathwaySubTaskSuccessAction) => {
      this.modalService.dismissAll();
    }));

  /**
   * Remove an impactPathway and dispatches RemoveImpactPathwayStepActions
   */
  @Effect() removeImpactPathway$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY),
    switchMap((action: RemoveImpactPathwayAction) => {
      return this.impactPathwayService.retrieveObjectItem(
        action.payload.impactPathwayId
      ).pipe(
        tap((item: Item) => this.impactPathwayService.addImpactPathwayToBeRemovedList(item.id)),
        mergeMap((item: Item) => {
          const actions = item.findMetadataSortedByPlace(environment.impactPathway.impactPathwayStepRelationMetadata)
            .map((relationMetadata: MetadataValue) => new RemoveImpactPathwayStepAction(
              item.id,
              relationMetadata.authority
            )
          );
          return [...actions, new RemoveImpactPathwaySuccessAction(
            action.payload.projectId,
            item.self)];
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RemoveImpactPathwayErrorAction());
        }));
    }));

  /**
   * Remove an impactPathway and dispatches RemoveImpactPathwayStepActions
   */
  @Effect({ dispatch: false }) removeImpactPathwaySuccess$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUCCESS),
    tap((action: RemoveImpactPathwaySuccessAction) => {
      this.impactPathwayService.removeByHref(action.payload.impactPathwayId);
      this.notificationsService.success(null, this.translate.get('impact-pathway.remove.success'));
      this.impactPathwayService.redirectToProjectPage(action.payload.projectId);
    }),
  );

  /**
   * Remove an impactPathway and dispatches RemoveImpactPathwayStepActions
   */
  @Effect() removeImpactPathwayStep$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_STEP),
    concatMap((action: RemoveImpactPathwayStepAction) => {
      return this.impactPathwayService.retrieveObjectItem(action.payload.stepId).pipe(
        mergeMap((parentItem: Item) => {
          return observableFrom(parentItem.findMetadataSortedByPlace(environment.impactPathway.impactPathwayTaskRelationMetadata)).pipe(
            concatMap((relationMetadata: MetadataValue) => this.itemAuthorityRelationService.removeParentRelationFromChild(
              action.payload.stepId,
              relationMetadata.authority,
              environment.impactPathway.impactPathwayParentRelationMetadata
            )),
            reduce((acc: any, value: any) => [...acc, value], []),
            map(() => parentItem)
          );
        }),
        map((parentItem: Item) => this.impactPathwayService.removeByHref(parentItem.self)),
        map(() => new RemoveImpactPathwayStepSuccessAction(
          action.payload.impactPathwayId,
          action.payload.stepId
        )),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message || error);
          }
          return observableOf(new RemoveImpactPathwayStepErrorAction());
        }));
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_TASK),
    switchMap((action: RemoveImpactPathwayTaskAction) => {
      return this.itemAuthorityRelationService.removeChildRelationFromParent(
        action.payload.parentId,
        action.payload.taskId,
        environment.impactPathway.impactPathwayTaskRelationMetadata
      ).pipe(
        map(() => new RemoveImpactPathwayTaskSuccessAction(
          action.payload.impactPathwayId,
          action.payload.parentId,
          action.payload.taskId)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RemoveImpactPathwayTaskErrorAction());
        }));
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeSubTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.REMOVE_IMPACT_PATHWAY_SUB_TASK),
    switchMap((action: RemoveImpactPathwaySubTaskAction) => {
      return this.itemAuthorityRelationService.removeChildRelationFromParent(
        action.payload.parentTaskId,
        action.payload.taskId,
        environment.impactPathway.impactPathwayTaskRelationMetadata
      ).pipe(
        map(() => new RemoveImpactPathwaySubTaskSuccessAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          action.payload.parentTaskId,
          action.payload.taskId)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RemoveImpactPathwayTaskErrorAction());
        }));
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() moveSubTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.MOVE_IMPACT_PATHWAY_SUB_TASK),
    switchMap((action: MoveImpactPathwaySubTaskAction) => {
      return this.impactPathwayService.moveSubTask(
        action.payload.parentTaskId,
        action.payload.newParentTaskId,
        action.payload.taskId
      ).pipe(
        map(() => new MoveImpactPathwaySubTaskSuccessAction()),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new MoveImpactPathwaySubTaskErrorAction(
            action.payload.impactPathwayId,
            action.payload.stepId,
            action.payload.parentTaskId,
            action.payload.newParentTaskId,
            action.payload.taskId
          ));
        }));
    }));

  /**
   * Show a notification on error
   */
  @Effect({ dispatch: false }) moveSubTaskError$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.MOVE_IMPACT_PATHWAY_SUB_TASK_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.move.task.error'));
    }));

  /**
   * Order tasks on an impactPathway step
   */
  @Effect() orderTasks$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_TASKS),
    switchMap((action: OrderImpactPathwayTasksAction) => {
      const taskIds: string[] = action.payload.currentTasks.map((task: ImpactPathwayTask) => task.id);
      return this.impactPathwayService.orderTasks(action.payload.stepId, taskIds).pipe(
        map(() => new OrderImpactPathwayTasksSuccessAction()),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new OrderImpactPathwayTasksErrorAction(
            action.payload.impactPathwayId,
            action.payload.stepId,
            action.payload.previousTasks
          ));
        })
      );
    })
  );

  /**
   * Show a notification on error
   */
  @Effect({ dispatch: false }) orderTasksError$ = this.actions$.pipe(
    ofType(
      ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_TASKS_ERROR,
      ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_SUB_TASKS_ERROR
    ),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('impact-pathway.move.task.error'));
    }));

  /**
   * Order tasks on an impactPathway step
   */
  @Effect() orderSubTasks$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.ORDER_IMPACT_PATHWAY_SUB_TASKS),
    switchMap((action: OrderImpactPathwaySubTasksAction) => {
      const taskIds: string[] = action.payload.currentTasks.map((task: ImpactPathwayTask) => task.id);
      return this.impactPathwayService.orderTasks(action.payload.parentTaskId, taskIds).pipe(
        map(() => new OrderImpactPathwaySubTasksSuccessAction()),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new OrderImpactPathwaySubTasksErrorAction(
            action.payload.impactPathwayId,
            action.payload.stepId,
            action.payload.parentTaskId,
            action.payload.previousTasks
          ));
        })
      );
    })
  );

  /**
   * Patch an impactPathway task and dispatch PatchImpactPathwayMetadataSuccessAction
   */
  @Effect() patchMetadataImpactPathway$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_METADATA),
    switchMap((action: PatchImpactPathwayMetadataAction) => {
      return this.itemService.updateItemMetadata(
        action.payload.impactPathwayId,
        action.payload.metadata,
        action.payload.metadataIndex,
        action.payload.value
      ).pipe(
        map((response: RemoteData<Item>) => {
          if (response.hasSucceeded) {
            return new PatchImpactPathwayMetadataSuccessAction(
              action.payload.impactPathwayId,
              action.payload.oldImpactPathway,
              response.payload
            );
          } else {
            if (response.errorMessage) {
              console.error(response.errorMessage);
            }
            return new PatchImpactPathwayMetadataErrorAction();
          }
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new PatchImpactPathwayMetadataErrorAction());
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
      );
    })
  );

  /**
   * Update an impactPathway object
   */
  @Effect({ dispatch: false }) UpdateImpactPathway$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.UPDATE_IMPACT_PATHWAY, ImpactPathwayActionTypes.UPDATE_IMPACT_PATHWAY_TASK),
    tap((action: AddImpactPathwaySubTaskAction) => {
      this.modalService.dismissAll();
    })
  );

  /**
   * Patch an impactPathway task and dispatch PatchImpactPathwayTaskMetadataSuccessAction
   */
  @Effect() patchMetadataTask$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.PATCH_IMPACT_PATHWAY_TASK_METADATA),
    switchMap((action: PatchImpactPathwayTaskMetadataAction) => {
      return this.itemService.updateItemMetadata(
        action.payload.taskId,
        action.payload.metadata,
        action.payload.metadataIndex,
        action.payload.value
      ).pipe(
        map((response: RemoteData<Item>) => {
          if (response.hasSucceeded) {
            return new PatchImpactPathwayTaskMetadataSuccessAction(
              action.payload.impactPathwayId,
              action.payload.stepId,
              action.payload.taskId,
              action.payload.oldTask,
              response.payload,
              action.payload.parentTaskId
            );
          } else {
            if (response.errorMessage) {
              console.error(response.errorMessage);
            }
            return new PatchImpactPathwayTaskMetadataErrorAction();
          }
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new PatchImpactPathwayTaskMetadataErrorAction());
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
        );
      } else {
        return new UpdateImpactPathwayTaskAction(
          action.payload.impactPathwayId,
          action.payload.stepId,
          action.payload.taskId,
          this.impactPathwayService.updateImpactPathwayTask(action.payload.item, action.payload.oldTask)
        );
      }
    })
  );

  /**
   * Patch an impactPathway task and dispatch PatchImpactPathwayTaskMetadataSuccessAction
   */
  @Effect() patchTaskRelations$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.SAVE_IMPACT_PATHWAY_TASK_LINKS),
    concatMap((action: SaveImpactPathwayTaskLinksAction) => {
      if (isNotEmpty(action.payload.toSave) || isNotEmpty(action.payload.toDelete)) {
        return this.impactPathwayLinksService.saveLinks(
          action.payload.impactPathwayTaskId,
          action.payload.toSave,
          action.payload.toDelete
        ).pipe(
          map(() => new SaveImpactPathwayTaskLinksSuccessAction()),
          catchError((error: Error) => {
            if (error) {
              console.error(error.message);
            }
            return observableOf(new SaveImpactPathwayTaskLinksErrorAction());
          }));
      } else {
        return observableOf(new SaveImpactPathwayTaskLinksSuccessAction());
      }
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
      this.notificationsService.error(null, this.translate.get('impact-pathway.patch.metadata.error'));
    }));

  /**
   * update impactPathway task relations
   */
  @Effect({ dispatch: false }) completeEditingTaskRelations$ = this.actions$.pipe(
    ofType(ImpactPathwayActionTypes.COMPLETE_EDITING_IMPACT_PATHWAY_TASK_LINKS),
    withLatestFrom(this.store$),
    map(([action, currentState]: [CompleteEditingImpactPathwayTaskLinksAction, any]) => {
      const impactPathwayState: ImpactPathwayState = currentState.core.impactPathway;
      const linksMap: ImpactPathwayLinksMap = this.impactPathwayLinksService.createMapOfLinksToFetch(impactPathwayState.links.toSave,
        impactPathwayState.links.toDelete
      );

      Object.keys(linksMap).forEach((taskId) => {
        this.impactPathwayLinksService.dispatchSaveImpactPathwayTaskLinksAction(
          taskId,
          linksMap[taskId].toSave,
          linksMap[taskId].toDelete
        );
      });
    })
  );

  /**
   * Clear state on submission discard
   */
  @Effect() clearState$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION),
    map(() => new ClearImpactPathwayAction()));

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
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private itemService: ItemDataService,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private store$: Store<any>,
    private translate: TranslateService
  ) {
  }

}
