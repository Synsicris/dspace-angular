import { Injectable } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { StoreActionTypes } from '../../store.actions';
import { ItemAuthorityRelationService } from '../../core/shared/item-authority-relation.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  AddQuestionsBoardTaskAction,
  AddQuestionsBoardTaskErrorAction,
  AddQuestionsBoardTaskSuccessAction,
  GenerateQuestionsBoardTaskAction,
  GenerateQuestionsBoardTaskErrorAction,
  GenerateQuestionsBoardTaskSuccessAction,
  InitCompareAction,
  InitCompareErrorAction,
  InitCompareSuccessAction,
  InitQuestionsBoardAction,
  InitQuestionsBoardErrorAction,
  InitQuestionsBoardSuccessAction,
  NormalizeQuestionsBoardObjectsOnRehydrateAction,
  OrderQuestionsBoardTasksAction,
  OrderQuestionsBoardTasksErrorAction,
  OrderQuestionsBoardTasksSuccessAction,
  PatchQuestionsBoardStepMetadataAction,
  PatchQuestionsBoardStepMetadataErrorAction,
  PatchQuestionsBoardStepMetadataSuccessAction,
  QuestionsBoardActionTypes,
  RemoveQuestionsBoardTaskAction,
  RemoveQuestionsBoardTaskErrorAction,
  RemoveQuestionsBoardTaskSuccessAction,
  UpdateQuestionsBoardStepAction,
} from './questions-board.actions';
import { QuestionsBoardService } from './questions-board.service';
import { isNotEmpty } from '../../shared/empty.util';
import { QuestionsBoard } from './models/questions-board.model';
import { Item } from '../../core/shared/item.model';
import { environment } from '../../../environments/environment';
import { ProjectItemService } from '../../core/project/project-item.service';
import { RemoteData } from '../../core/data/remote-data';
import { ItemDataService } from '../../core/data/item-data.service';
import { QuestionsBoardTask } from './models/questions-board-task.model';
import { ComparedVersionItem, ProjectVersionService } from '../../core/project/project-version.service';
import { QuestionsBoardStep } from './models/questions-board-step.model';

/**
 * Provides effect methods for jsonPatch Operations actions
 */
@Injectable()
export class QuestionsBoardEffects {

  /**
   * Add task to a step
   */
  @Effect() addTask$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK),
    concatMap((action: AddQuestionsBoardTaskAction) => {
      return this.itemAuthorityRelationService.addLinkedItemToParent(
        this.exploitationPlanService.getExploitationPlanEditFormSection(),
        this.exploitationPlanService.getExploitationPlanEditMode(),
        action.payload.stepId,
        action.payload.taskId,
        environment.exploitationPlan.exploitationPlanTaskRelationMetadata).pipe(
          map((taskItem: Item) => {
            return this.exploitationPlanService.initExploitationPlanTask(taskItem, action.payload.stepId);
          }),
          map((task: QuestionsBoardTask) => {
            return new AddQuestionsBoardTaskSuccessAction(
              action.payload.questionsBoardId,
              action.payload.stepId,
              task);
          }),
          catchError((error: Error) => {
            if (error) {
              console.error(error.message);
            }
            return observableOf(new AddQuestionsBoardTaskErrorAction());
          }));
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) addTaskSuccess$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('exploitation-plan.task.create.success'));
    }),
    tap(() => {
      this.modalService.dismissAll();
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() generateTask$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK),
    switchMap((action: GenerateQuestionsBoardTaskAction) => {
      return this.projectItemService.generateEntityItemWithinProject(
        this.exploitationPlanService.getExploitationPlanTaskFormSection(),
        action.payload.projectId,
        action.payload.taskType,
        action.payload.metadata).pipe(
          map((item: Item) => new GenerateQuestionsBoardTaskSuccessAction(
            action.payload.questionsBoardId,
            action.payload.stepId,
            item)),
          catchError((error: Error) => {
            if (error) {
              console.error(error.message);
            }
            return observableOf(new GenerateQuestionsBoardTaskErrorAction());
          }));
    }));

  /**
   * Dispatch an AddImpactPathwayTaskAction
   */
  @Effect() generateTaskSuccess$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK_SUCCESS),
    map((action: GenerateQuestionsBoardTaskSuccessAction) => {
      return new AddQuestionsBoardTaskAction(
        action.payload.questionsBoardId,
        action.payload.stepId,
        action.payload.item.id);
    }));

  /**
   * Show a notification on success
   */
  @Effect({ dispatch: false }) generateTaskError$ = this.actions$.pipe(
    ofType(
      QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK_ERROR,
      QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('exploitation-plan.task.create.error'));
    }),
    tap(() => {
      this.modalService.dismissAll();
    }));

  /**
   * Initialize Exploitation Plan and dispatch a InitQuestionsBoardSuccessAction or a InitQuestionsBoardErrorAction on error
   */
  @Effect() init$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.INIT_QUESTIONS_BOARD),
    switchMap((action: InitQuestionsBoardAction) => {
      return this.exploitationPlanService.initExploitationPlan(action.payload.item).pipe(
        map((object: QuestionsBoard) => {
          if (isNotEmpty(object)) {
            return new InitQuestionsBoardSuccessAction(object.id, object);
          } else {
            return new InitQuestionsBoardErrorAction();
          }
        }));
    }));

  /**
   * Patch an impactPathway task and dispatch PatchImpactPathwayTaskMetadataSuccessAction
   */
  @Effect() patchMetadataTask$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA),
    switchMap((action: PatchQuestionsBoardStepMetadataAction) => {
      return this.itemService.updateItemMetadata(
        action.payload.stepId,
        this.exploitationPlanService.getExploitationPlanEditMode(),
        this.exploitationPlanService.getExploitationPlanEditFormSection(),
        action.payload.metadata,
        action.payload.metadataIndex,
        action.payload.value
      ).pipe(
        map((response: RemoteData<Item>) => {
          if (response.hasSucceeded) {
            return new PatchQuestionsBoardStepMetadataSuccessAction(
              action.payload.questionsBoardId,
              action.payload.stepId,
              action.payload.oldStep,
              response.payload
            );
          } else {
            if (response.errorMessage) {
              console.error(response.errorMessage);
            }
            return new PatchQuestionsBoardStepMetadataErrorAction();
          }
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return observableOf(new PatchQuestionsBoardStepMetadataErrorAction());
        }));
    }));

  /**
   * Update an impactPathway object
   */
  @Effect() patchMetadataImpactPathwaySuccess$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA_SUCCESS),
    map((action: PatchQuestionsBoardStepMetadataSuccessAction) => {
      return new UpdateQuestionsBoardStepAction(
        action.payload.questionsBoardId,
        this.exploitationPlanService.updateExploitationPlanStep(action.payload.item, action.payload.oldStep)
      );
    })
  );

  /**
   * Show a notification on error
   */
  @Effect({ dispatch: false }) patchMetadataError$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('exploitation-plan.patch.metadata.error'));
    }));

  /**
   * Generate an impactPathway task and dispatches
   */
  @Effect() removeTask$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.REMOVE_QUESTIONS_BOARD_TASK),
    switchMap((action: RemoveQuestionsBoardTaskAction) => {
      return this.itemAuthorityRelationService.removeChildRelationFromParent(
        this.exploitationPlanService.getExploitationPlanEditFormSection(),
        this.exploitationPlanService.getExploitationPlanEditMode(),
        action.payload.parentId,
        action.payload.taskId,
        environment.exploitationPlan.exploitationPlanTaskRelationMetadata).pipe(
          map(() => new RemoveQuestionsBoardTaskSuccessAction(
            action.payload.questionsBoardId,
            action.payload.parentId,
            action.payload.taskId)),
          catchError((error: Error) => {
            if (error) {
              console.error(error.message);
            }
            return observableOf(new RemoveQuestionsBoardTaskErrorAction());
          }));
    }));

  /**
   * Update an impactPathway object
   */
  @Effect({ dispatch: false }) UpdateImpactPathway$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.UPDATE_QUESTIONS_BOARD_STEP),
    tap(() => this.modalService.dismissAll())
  );

  /**
   * When the store is rehydrated objects in the state lose the prototypes,
   * so restore them
   */
  @Effect() normalizeObjectsOnRehydrate = this.actions$
    .pipe(ofType(StoreActionTypes.REHYDRATE),
      map(() => new NormalizeQuestionsBoardObjectsOnRehydrateAction())
    );

  /**
   * Order tasks on an ExploitationPlan step
   */
  @Effect() orderSubTasks$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.ORDER_QUESTIONS_BOARD_TASK),
    switchMap((action: OrderQuestionsBoardTasksAction) => {
      const taskIds: string[] = action.payload.currentTasks.map((task: QuestionsBoardTask) => task.id);
      return this.itemAuthorityRelationService.orderRelations(
        this.exploitationPlanService.getExploitationPlanEditFormSection(),
        this.exploitationPlanService.getExploitationPlanEditMode(),
        action.payload.stepId,
        taskIds,
        environment.exploitationPlan.exploitationPlanTaskRelationMetadata
      ).pipe(
        map(() => new OrderQuestionsBoardTasksSuccessAction()),
        catchError((error: Error) => {
          console.error(error.message);
          return observableOf(new OrderQuestionsBoardTasksErrorAction(
            action.payload.questionsBoardId,
            action.payload.stepId,
            action.payload.currentTasks,
            action.payload.previousTasks
          ));
        })
      );
    })
  );


  /**
   * Initialize compare of exploitation plan and copares its children
   */
  @Effect() initCompare$ = this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.INIT_COMPARE_QUESTIONS_BOARD),
    withLatestFrom(this.store$),
    switchMap(([action, state]: [InitCompareAction, any]) => {
      let exploitationPlanId;
      let versionItemId;
      if (action.payload.isVersionOf) {
        versionItemId = action.payload.questionsBoardId;
        exploitationPlanId = action.payload.compareQuestionsBoardId;
      } else {
        exploitationPlanId = action.payload.questionsBoardId;
        versionItemId = action.payload.compareQuestionsBoardId;
      }
      return this.projectVersionService.compareItemChildrenByMetadata(
        exploitationPlanId,
        versionItemId,
        environment.exploitationPlan.exploitationPlanStepRelationMetadata
      ).pipe(
        switchMap((compareItemList: ComparedVersionItem[]) => this.exploitationPlanService.initCompareExploitationPlanSteps(compareItemList, action.payload.questionsBoardId)),
        map((steps: QuestionsBoardStep[]) => new InitCompareSuccessAction(action.payload.questionsBoardId, steps)),
        catchError((error: Error) => {
          if (error) {
            this.notificationsService.error(null, this.translate.get('exploitation-plan.compare.error'));
          }
          return observableOf(new InitCompareErrorAction());
        }));
    }));


  constructor(
    private actions$: Actions,
    private exploitationPlanService: QuestionsBoardService,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private itemService: ItemDataService,
    private projectItemService: ProjectItemService,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private store$: Store<any>,
    private projectVersionService: ProjectVersionService,
    private translate: TranslateService
  ) {
  }

}
