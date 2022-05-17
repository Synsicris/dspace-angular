import { Injectable } from '@angular/core';

import { from as observableFrom, of as observableOf } from 'rxjs';
import {
  catchError,
  concatMap,
  debounceTime,
  map,
  mergeMap,
  reduce,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
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
  ClearWorkingPlanAction,
  GenerateWorkpackageAction,
  GenerateWorkpackageErrorAction,
  GenerateWorkpackageStepAction,
  GenerateWorkpackageStepErrorAction,
  GenerateWorkpackageStepSuccessAction,
  GenerateWorkpackageSuccessAction,
  InitCompareAction,
  InitCompareErrorAction,
  InitCompareSuccessAction,
  InitWorkingplanAction,
  InitWorkingplanErrorAction,
  InitWorkingplanSuccessAction,
  MoveWorkpackageAction,
  MoveWorkpackageStepAction,
  RemoveWorkpackageAction,
  RemoveWorkpackageErrorAction,
  RemoveWorkpackageStepAction,
  RemoveWorkpackageStepErrorAction,
  RemoveWorkpackageStepSuccessAction,
  RemoveWorkpackageSuccessAction,
  RetrieveAllLinkedWorkingPlanObjectsAction,
  RetrieveAllLinkedWorkingPlanObjectsErrorAction,
  SaveWorkpackageOrderAction,
  SaveWorkpackageOrderErrorAction,
  SaveWorkpackageOrderSuccessAction,
  SaveWorkpackageStepsOrderAction,
  SaveWorkpackageStepsOrderErrorAction,
  UpdateAllWorkpackageAction,
  UpdateAllWorkpackageErrorAction,
  UpdateAllWorkpackageStepAction,
  UpdateAllWorkpackageStepErrorAction,
  UpdateAllWorkpackageStepSuccessAction,
  UpdateAllWorkpackageSuccessAction,
  UpdateWorkpackageAction,
  UpdateWorkpackageErrorAction,
  UpdateWorkpackageStepAction,
  UpdateWorkpackageStepErrorAction,
  UpdateWorkpackageStepSuccessAction,
  UpdateWorkpackageSuccessAction,
  WorkpackageActionTypes
} from './working-plan.actions';
import { WorkingPlanService } from './working-plan.service';
import { Workpackage, WorkpackageSearchItem, WorkpackageStep } from './models/workpackage-step.model';
import { Item } from '../../core/shared/item.model';
import { ItemAuthorityRelationService } from '../../core/shared/item-authority-relation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubmissionObjectActionTypes } from '../../submission/objects/submission-objects.actions';
import { environment } from '../../../environments/environment';
import { WpActionPackage, WpStepActionPackage } from './working-plan-state.service';
import { ComparedVersionItem, ProjectVersionService } from '../../core/project/project-version.service';

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
    switchMap((action: GenerateWorkpackageAction) => {
      return this.workingPlanService.generateWorkpackageItem(
        action.payload.projectId,
        action.payload.entityType,
        action.payload.metadata,
        action.payload.place).pipe(
        map((searchItem: Item) => new GenerateWorkpackageSuccessAction(
          action.payload.projectId,
          searchItem,
          searchItem.id)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new GenerateWorkpackageErrorAction());
        }));
    }));

  /**
   * Dispatch an AddImpactPathwayTaskAction
   */
  @Effect() generateWorkpackageSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.GENERATE_WORKPACKAGE_SUCCESS),
    map((action: GenerateWorkpackageSuccessAction) => {
      return new AddWorkpackageAction(action.payload.projectId,  action.payload.item.id, action.payload.workspaceItemId);
    }));

  /**
   * Add workpackage
   */
  @Effect() addWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.ADD_WORKPACKAGE),
    withLatestFrom(this.store$),
    concatMap(([action, state]: [AddWorkpackageAction, any]) => {
      return this.workingPlanService.linkWorkingPlanObject(
        state.workingplan.workingplanId,
        action.payload.workpackageId,
        action.payload.place
      ).pipe(
        debounceTime(200),
        map((item: Item) => {
          return new RetrieveAllLinkedWorkingPlanObjectsAction(
            action.payload.projectId,
            state.workingplan.workingplanId,
            state.workingplan.sortOption,
            item.uuid);
        }),
        tap(() => {
          this.store$.dispatch(new AddWorkpackageSuccessAction());
        }),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new AddWorkpackageErrorAction());
        }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addTaskSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.ADD_WORKPACKAGE_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.task.create.success'));
    }),
    tap((action: AddWorkpackageSuccessAction) => {
      this.modalService.dismissAll();
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
      this.notificationsService.error(null, this.translate.get('impact-pathway.task.create.error'));
    }),
    tap((action: any) => {
      this.modalService.dismissAll();
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() generateStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.GENERATE_WORKPACKAGE_STEP),
    switchMap((action: GenerateWorkpackageStepAction) => {
      return this.workingPlanService.generateWorkpackageStepItem(
        action.payload.projectId,
        action.payload.parentId,
        action.payload.workpackageStepType,
        action.payload.metadata).pipe(
        map((searchItem: Item) => new GenerateWorkpackageStepSuccessAction(
          action.payload.parentId,
          searchItem,
          searchItem.id)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new GenerateWorkpackageStepErrorAction());
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
        action.payload.workspaceItemId);
    }));

  /**
   * Add task to a step
   */
  @Effect() addStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.ADD_WORKPACKAGE_STEP),
    concatMap((action: AddWorkpackageStepAction) => {
      return this.itemAuthorityRelationService.addLinkedItemToParent(
        this.workingPlanService.getWorkingPlanEditSectionName(),
        this.workingPlanService.getWorkingPlanEditMode(),
        action.payload.parentId,
        action.payload.workpackageStepId,
        environment.workingPlan.workingPlanStepRelationMetadata).pipe(
        map((taskItem: Item) => {
          return this.workingPlanService.initWorkpackageStepFromItem(
            taskItem,
            action.payload.workspaceItemId,
            action.payload.parentId
          );
        }),
        map((step: WorkpackageStep) => {
          return new AddWorkpackageStepSuccessAction(
            action.payload.parentId,
            step);
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new AddWorkpackageStepErrorAction());
        }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addStepSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.ADD_WORKPACKAGE_STEP_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('impact-pathway.task.create.success'));
    }),
    tap((action: AddWorkpackageStepSuccessAction) => {
      this.modalService.dismissAll();
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.REMOVE_WORKPACKAGE),
    withLatestFrom(this.store$),
    switchMap(([action, state]: [RemoveWorkpackageAction, any]) => {
      return this.workingPlanService.unlinkWorkingPlanObject(
        state.workingplan.workingplanId,
        action.payload.workpackageId
      ).pipe(
        map(() => new RemoveWorkpackageSuccessAction(action.payload.workpackageId)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RemoveWorkpackageErrorAction());
        }));
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.REMOVE_WORKPACKAGE_STEP),
    switchMap((action: RemoveWorkpackageStepAction) => {
      return this.itemAuthorityRelationService.removeChildRelationFromParent(
        this.workingPlanService.getWorkingPlanEditSectionName(),
        this.workingPlanService.getWorkingPlanEditMode(),
        action.payload.workpackageId,
        action.payload.workpackageStepId,
        environment.workingPlan.workingPlanStepRelationMetadata
      ).pipe(
        map(() => new RemoveWorkpackageStepSuccessAction(
          action.payload.workpackageId,
          action.payload.workpackageStepId)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RemoveWorkpackageStepErrorAction());
        }));
    }));

  /**
   * Retrieve all workpackages for this workingplan
   */
  @Effect() retrieveAllWorkpackages$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.RETRIEVE_ALL_LINKED_WORKINGPLAN_OBJECTS),
    switchMap((action: RetrieveAllLinkedWorkingPlanObjectsAction) => {
      return this.workingPlanService.searchForLinkedWorkingPlanObjects(action.payload.projectId, action.payload.sortOption).pipe(
        map((items: WorkpackageSearchItem[]) => {
          return new InitWorkingplanAction(action.payload.workingplanId, items, action.payload.sortOption);
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new RetrieveAllLinkedWorkingPlanObjectsErrorAction());
        }));
    }));

  /**
   * Add workpackages to workingplan state
   */
  @Effect() initCompare$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.INIT_COMPARE),
    withLatestFrom(this.store$),
    switchMap(([action, state]: [InitCompareAction, any]) => {
      return this.projectVersionService.compareItemChildrenByMetadata(
        state.workingplan.workingplanId,
        action.payload.compareWorkingplanId,
        environment.workingPlan.workingPlanStepRelationMetadata
      ).pipe(
        switchMap((compareItemList: ComparedVersionItem[]) => this.workingPlanService.initCompareWorkingPlan(compareItemList)),
        map((workpackages: Workpackage[]) => new InitCompareSuccessAction(workpackages)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new InitCompareErrorAction());
        }));
    }));

  /**
   * Add workpackages to workingplan state
   */
  @Effect() init$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.INIT_WORKINGPLAN),
    switchMap((action: InitWorkingplanAction) => {
      return this.workingPlanService.initWorkingPlan(action.payload.items).pipe(
        map((workpackages: Workpackage[]) => new InitWorkingplanSuccessAction(action.payload.workingplanId, workpackages, action.payload.sortOption)),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new InitWorkingplanErrorAction());
        }));
    }));

  /**
   * Init workingplan objects place
   */
  @Effect({dispatch: false}) initSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.INIT_WORKINGPLAN_SUCCESS),
    withLatestFrom(this.store$),
    switchMap(([action, state]: [InitWorkingplanSuccessAction, any]) => {
      return this.workingPlanService.updateWorkpackagePlace(
        action.payload.workingplanId,
        state.workingplan.workpackages,
        action.payload.sortOption);
    }));

  /**
   * Update a workpackage into the state
   */
  @Effect() updateWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.UPDATE_WORKPACKAGE),
    mergeMap((action: UpdateWorkpackageAction) => {
      return this.workingPlanService.updateMetadataItem(
        action.payload.workpackageId,
        action.payload.metadatumViewList
      ).pipe(
        map(() => new UpdateWorkpackageSuccessAction(
          action.payload.workpackageId,
          action.payload.workpackage,
          action.payload.metadatumViewList
        )),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new UpdateWorkpackageErrorAction(action.payload.workpackageId));
        }));
    }));

  /**
   * Update all workpackages into the state
   */
  @Effect() updateAllWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE),
    concatMap((action: UpdateAllWorkpackageAction) => {
      return observableFrom(action.payload.wpActionPackage).pipe(
        concatMap((wp: WpActionPackage) => {
          return this.workingPlanService.updateMetadataItem(
            wp.workpackageId,
            wp.metadatumViewList
          );
        }),
        reduce((acc: any, value: any) => [...acc, value], []),
        map(() => new UpdateAllWorkpackageSuccessAction(
          action.payload.wpActionPackage,
          action.payload.wpStepsActionPackage
        )),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new UpdateAllWorkpackageErrorAction(action.payload.wpActionPackage));
        })
      );
    }));

  /**
   * Update all workpackages into the state
   */
  @Effect() updateAllWorkpackageSuccess$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_SUCCESS),
    map((action: UpdateAllWorkpackageSuccessAction) => new UpdateAllWorkpackageStepAction(
      action.payload.wpStepsActionPackage
    )));

  /**
   * Update a workpackage into the state
   */
  @Effect() updateWorkpackageStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP),
    mergeMap((action: UpdateWorkpackageStepAction) => {
      return this.workingPlanService.updateMetadataItem(
        action.payload.workpackageStepId,
        action.payload.metadatumViewList
      ).pipe(
        map(() => new UpdateWorkpackageStepSuccessAction(
          action.payload.workpackageId,
          action.payload.workpackageStepId,
          action.payload.workpackageStep,
          action.payload.metadatumViewList
        )),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new UpdateWorkpackageStepErrorAction(
            action.payload.workpackageId,
            action.payload.workpackageStepId
          ));
        }));
    }));

  /**
   * Update a workpackage into the state
   */
  @Effect() updateAllWorkpackageStep$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_STEP),
    concatMap((action: UpdateAllWorkpackageStepAction) => {
      return observableFrom(action.payload.wpStepActionPackage).pipe(
        concatMap((wp: WpStepActionPackage) => {
          return this.workingPlanService.updateMetadataItem(
            wp.workpackageStepId,
            wp.metadatumViewList
          );
        }),
        reduce((acc: any, value: any) => [...acc, value], []),
        map(() => new UpdateAllWorkpackageStepSuccessAction(
          action.payload.wpStepActionPackage
        )),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new UpdateAllWorkpackageStepErrorAction(action.payload.wpStepActionPackage));
        })
      );
    }));

  /**
   * Init workingplan objects place
   */
  @Effect({dispatch: false}) updateError$ = this.actions$.pipe(
    ofType(
      WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_ERROR,
      WorkpackageActionTypes.UPDATE_ALL_WORKPACKAGE_STEP_ERROR,
      WorkpackageActionTypes.UPDATE_WORKPACKAGE_ERROR,
      WorkpackageActionTypes.UPDATE_WORKPACKAGE_STEP_ERROR
    ),
    tap(() => {
      this.notificationsService.error(
        null,
        this.translate.get('working-plan.chart.update.error'),
        {timeOut: 0, clickToClose: false}
      );
    }));

  /**
   * Dispatch a [SaveWorkpackageOrderAction]
   */
  @Effect() moveWorkpackage$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.MOVE_WORKPACKAGE),
    withLatestFrom(this.store$),
    map(([action, state]: [MoveWorkpackageAction, any]) => {
      return new SaveWorkpackageOrderAction(state.workingplan.workpackages);
    }));

  /**
   * Dispatch a [SaveWorkpackageOrderSuccessAction] or a [SaveWorkpackageOrderErrorAction] on error
   */
  @Effect() updateWorkpackagesPlace$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.SAVE_WORKPACKAGE_ORDER),
    withLatestFrom(this.store$),
    switchMap(([action, state]: [SaveWorkpackageOrderAction, any]) => {
      return this.workingPlanService.updateWorkpackagePlace(
        state.workingplan.workingplanId,
        state.workingplan.workpackages).pipe(
        map(() => new SaveWorkpackageOrderSuccessAction()),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new SaveWorkpackageOrderErrorAction(action.payload.oldWorkpackageEntries));
        }));
    }));

  /**
   * Dispatch a [SaveWorkpackageOrderAction]
   */
  @Effect() moveWorkpackageSteps$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.MOVE_WORKPACKAGE_STEP),
    withLatestFrom(this.store$),
    map(([action, state]: [MoveWorkpackageStepAction, any]) => {
      return new SaveWorkpackageStepsOrderAction(
        action.payload.workpackageId,
        state.workingplan.workpackages[action.payload.workpackageId],
        action.payload.workpackage.steps
      );
    }));

  /**
   * Dispatch a [SaveWorkpackageOrderSuccessAction] or a [SaveWorkpackageOrderErrorAction] on error
   */
  @Effect() updateWorkpackageStepsPlace$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.SAVE_WORKPACKAGE_STEPS_ORDER),
    withLatestFrom(this.store$),
    switchMap(([action, state]: [SaveWorkpackageStepsOrderAction, any]) => {
      return this.workingPlanService.updateWorkpackageStepsPlace(
        action.payload.workpackageId,
        state.workingplan.workpackages[action.payload.workpackageId].steps
      ).pipe(
        map(() => new SaveWorkpackageOrderSuccessAction()),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new SaveWorkpackageStepsOrderErrorAction(
            action.payload.workpackageId,
            action.payload.previousStepsState
          ));
        }));
    }));

  /**
   * Show a notification on error
   */
  @Effect({ dispatch: false }) moveError$ = this.actions$.pipe(
    ofType(WorkpackageActionTypes.SAVE_WORKPACKAGE_ORDER_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('working-plan.chart.move.error'));
    }));

  /**
   * Clear state on submission discard
   */
  @Effect() clearState$ = this.actions$.pipe(
    ofType(SubmissionObjectActionTypes.DISCARD_SUBMISSION),
    map(() => new ClearWorkingPlanAction()));

  constructor(
    private actions$: Actions,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private projectVersionService: ProjectVersionService,
    private store$: Store<any>,
    private translate: TranslateService,
    private workingPlanService: WorkingPlanService
  ) {
  }

}
