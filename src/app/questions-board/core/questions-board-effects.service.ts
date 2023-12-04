import { Injectable } from '@angular/core';

import { from, of as observableOf, of } from 'rxjs';
import { catchError, concatMap, delay, filter, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { StoreActionTypes } from '../../store.actions';
import { ItemAuthorityRelationService } from '../../core/shared/item-authority-relation.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  AddQuestionsBoardTaskAction,
  AddQuestionsBoardTaskErrorAction,
  AddQuestionsBoardTaskSuccessAction,
  ClearQuestionBoardStepsAction,
  ClearQuestionBoardStepsErrorAction,
  ClearQuestionBoardStepsSuccessAction,
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
  RemoveAllUploadedFilesFromQuestionsboardAction,
  RemoveAllUploadedFilesFromQuestionsboardErrorAction,
  RemoveAllUploadedFilesFromQuestionsboardSuccessAction,
  RemoveQuestionsBoardTaskAction,
  RemoveQuestionsBoardTaskErrorAction,
  RemoveQuestionsBoardTaskSuccessAction,
  UpdateQuestionsBoardStepAction,
  UploadFilesToQuestionBoardAction,
} from './questions-board.actions';
import { QuestionsBoardService } from './questions-board.service';
import { isNotEmpty } from '../../shared/empty.util';
import { QuestionsBoard } from './models/questions-board.model';
import { Item } from '../../core/shared/item.model';
import { ProjectItemService } from '../../core/project/project-item.service';
import { RemoteData } from '../../core/data/remote-data';
import { ItemDataService } from '../../core/data/item-data.service';
import { QuestionsBoardTask } from './models/questions-board-task.model';
import { ComparedVersionItem, ProjectVersionService } from '../../core/project/project-version.service';
import { QuestionsBoardStep } from './models/questions-board-step.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { QuestionsBoardStateService } from './questions-board-state.service';
import {
  WorkspaceitemSectionUploadFileObject
} from 'src/app/core/submission/models/workspaceitem-section-upload-file.model';

/**
 * Provides effect methods for jsonPatch Operations actions
 */
@Injectable({
  providedIn: 'any'
})
export class QuestionsBoardEffects {

  /**
   * Add task to a step
   */
  addTask$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK),
    concatMap((action: AddQuestionsBoardTaskAction) => {
      return this.itemAuthorityRelationService.addLinkedItemToParentAndReturnChild(
        this.questionsBoardService.getQuestionsBoardEditFormSection(),
        this.questionsBoardService.getQuestionsBoardEditMode(),
        action.payload.stepId,
        action.payload.taskId,
        this.questionsBoardService.getQuestionsBoardRelationTasksMetadata()).pipe(
          map((taskItem: Item) => {
            return this.questionsBoardService.initQuestionsBoardTask(taskItem, action.payload.stepId);
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
    })));

  /**
   * Show a notification on success
   */
  addTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK_SUCCESS),
    tap(() => {
      this.notificationsService.success(null, this.translate.get('exploitation-plan.task.create.success'));
    }),
    tap(() => {
      this.modalService.dismissAll();
    })), { dispatch: false });

  /**
   * Generate an impactPathway task and dispatches
   */
  generateTask$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK),
    switchMap((action: GenerateQuestionsBoardTaskAction) => {
      return this.projectItemService.generateEntityItemWithinProject(
        this.questionsBoardService.getQuestionsBoardTaskFormSection(),
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
    })));

  /**
   * Dispatch an AddImpactPathwayTaskAction
   */
  generateTaskSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK_SUCCESS),
    map((action: GenerateQuestionsBoardTaskSuccessAction) => {
      return new AddQuestionsBoardTaskAction(
        action.payload.questionsBoardId,
        action.payload.stepId,
        action.payload.item.id);
    })));

  /**
   * Show a notification on success
   */
  generateTaskError$ = createEffect(() => this.actions$.pipe(
    ofType(
      QuestionsBoardActionTypes.ADD_QUESTIONS_BOARD_TASK_ERROR,
      QuestionsBoardActionTypes.GENERATE_QUESTIONS_BOARD_TASK_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('exploitation-plan.task.create.error'));
    }),
    tap(() => {
      this.modalService.dismissAll();
    })), { dispatch: false });

  /**
   * Initialize questions board and dispatch a InitQuestionsBoardSuccessAction or a InitQuestionsBoardErrorAction on error
   */
  init$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.INIT_QUESTIONS_BOARD),
    tap((action: InitQuestionsBoardAction) => this.questionsBoardService.setConfig(action.payload.config)),
    delay(200),
    switchMap((action: InitQuestionsBoardAction) => {
      return this.questionsBoardService.initQuestionsBoard(action.payload.item).pipe(
        map((object: QuestionsBoard) => {
          if (isNotEmpty(object)) {
            return new InitQuestionsBoardSuccessAction(object.id, object);
          } else {
            return new InitQuestionsBoardErrorAction();
          }
        }));
    })));

  /**
   * Patch an impactPathway task and dispatch PatchImpactPathwayTaskMetadataSuccessAction
   */
  patchMetadataTask$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA),
    switchMap((action: PatchQuestionsBoardStepMetadataAction) => {
      return this.itemService.updateItemMetadata(
        action.payload.stepId,
        this.questionsBoardService.getQuestionsBoardEditMode(),
        this.questionsBoardService.getQuestionsBoardEditFormSection(),
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
    })));

  /**
   * Update an impactPathway object
   */
  patchMetadataImpactPathwaySuccess$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA_SUCCESS),
    map((action: PatchQuestionsBoardStepMetadataSuccessAction) => {
      return new UpdateQuestionsBoardStepAction(
        action.payload.questionsBoardId,
        this.questionsBoardService.updateQuestionsBoardStep(action.payload.item, action.payload.oldStep)
      );
    })
  ));

  /**
   * Show a notification on error
   */
  patchMetadataError$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.PATCH_QUESTIONS_BOARD_STEP_METADATA_ERROR),
    tap(() => {
      this.notificationsService.error(null, this.translate.get('exploitation-plan.patch.metadata.error'));
    })), { dispatch: false });

  /**
   * Generate an impactPathway task and dispatches
   */
  removeTask$ = createEffect(() =>  this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.REMOVE_QUESTIONS_BOARD_TASK),
    switchMap((action: RemoveQuestionsBoardTaskAction) => {
      return this.itemAuthorityRelationService.removeChildRelationFromParent(
        this.questionsBoardService.getQuestionsBoardEditFormSection(),
        this.questionsBoardService.getQuestionsBoardEditMode(),
        action.payload.parentId,
        action.payload.taskId,
        this.questionsBoardService.getQuestionsBoardRelationTasksMetadata()).pipe(
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
    })));

  /**
   * Update an impactPathway object
   */
  UpdateImpactPathway$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.UPDATE_QUESTIONS_BOARD_STEP),
    tap(() => this.modalService.dismissAll())
  ), { dispatch: false });

  /**
   * When the store is rehydrated objects in the state lose the prototypes,
   * so restore them
   */
  normalizeObjectsOnRehydrate = createEffect(() => this.actions$
    .pipe(ofType(StoreActionTypes.REHYDRATE),
      map(() => new NormalizeQuestionsBoardObjectsOnRehydrateAction())
    ));

  /**
   * Order tasks on a questions board step
   */
  orderSubTasks$ = createEffect(() =>  this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.ORDER_QUESTIONS_BOARD_TASK),
    switchMap((action: OrderQuestionsBoardTasksAction) => {
      const tasks: Pick<MetadataValue, 'authority' | 'value'>[] =
        action.payload.currentTasks.map((task: QuestionsBoardTask) => ({
          authority: task.id,
          value: task.title
        }));
      return this.itemAuthorityRelationService.orderRelations(
        this.questionsBoardService.getQuestionsBoardEditFormSection(),
        this.questionsBoardService.getQuestionsBoardEditMode(),
        action.payload.stepId,
        tasks,
        this.questionsBoardService.getQuestionsBoardRelationTasksMetadata()
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
  ));

  /**
   * Initialize compare of questions board and its children
   */
  initCompare$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.INIT_COMPARE_QUESTIONS_BOARD),
    switchMap((action: InitCompareAction) =>
      this.projectVersionService.compareItemChildrenByMetadata(
        action.payload.questionsBoardId,
        action.payload.compareQuestionsBoardId,
        this.questionsBoardService.getQuestionsBoardRelationStepsMetadata()
      ).pipe(
        switchMap((compareItemList: ComparedVersionItem[]) => this.questionsBoardService.initCompareQuestionsBoardSteps(compareItemList, action.payload.questionsBoardId)),
        map((steps: QuestionsBoardStep[]) => new InitCompareSuccessAction(action.payload.activeQuestionBoardId, steps)),
        catchError((error: Error) => {
          if (error) {
            this.notificationsService.error(null, this.translate.get('exploitation-plan.compare.error'));
            console.error(error);
          }
          return observableOf(new InitCompareErrorAction());
        }))
    )));

  addUploadStepToQuestionBoard$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.UPLOAD_FILES_TO_QUESTION_BOARD),
    take(1),
    map((action: UploadFilesToQuestionBoardAction) =>
       new UploadFilesToQuestionBoardAction(
        action.payload.questionsBoardId,
        action.payload.files
      )
    )
  ));

  /**
   * Remove all the tasks from all the steps of a questions board.
   * Get all the steps from the questions board (store) and remove all the tasks
   * by sending a PATCH request to the REST API for each step.
   */
  patchClearSteps$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.CLEAR_QUESTION_BOARD_STEPS),
    switchMap((action: ClearQuestionBoardStepsAction) => {
      return this.questionsBoardStateService.getQuestionsBoardStep(action.payload.questionsBoardId).pipe(
        take(1),
        switchMap((steps: QuestionsBoardStep[]) => from(steps)),
        filter((step: QuestionsBoardStep) => step.tasks.length > 0 || isNotEmpty(step.description)),
        concatMap((step: QuestionsBoardStep) =>
          this.questionsBoardService.removeAllTasksFromStep(
            this.questionsBoardService.getQuestionsBoardEditFormSection(),
            this.questionsBoardService.getQuestionsBoardEditMode(),
            step.id,
            this.questionsBoardService.getQuestionsBoardRelationTasksMetadata(),
            this.questionsBoardService.getQuestionsBoardDescriptionMetadata(),
            step.tasks.length > 0,
            isNotEmpty(step.description)
          )
        ),
        map((item: Item) => {
          this.notificationsService.success(null, this.translate.get('questions-board.clear-all-board.success', { step: item.firstMetadataValue('dc.title') }));
          return new ClearQuestionBoardStepsSuccessAction(action.payload.questionsBoardId);
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return of(new ClearQuestionBoardStepsErrorAction()).pipe(
            tap(() => {
              this.notificationsService.error(null, this.translate.get('questions-board.clear-all-board.error'));
            })
          );
        })
      );
    })));

  /**
   * Remove all uploaded files from a questions board
   * Get all files from the questions board (store) and remove them one by one
   * by sending a PATCH request to the REST API for all the files with the respective path
   */
  patchRemoveAllUploadedFiles$ = createEffect(() => this.actions$.pipe(
    ofType(QuestionsBoardActionTypes.DELETE_ALL_UPLOADED_FILES_FROM_QUESTION_BOARD),
    switchMap((action: RemoveAllUploadedFilesFromQuestionsboardAction) => {
      return this.questionsBoardStateService.getFilesFromQuestionsBoard(action.payload.questionsBoardId).pipe(
        take(1),
        switchMap((files: WorkspaceitemSectionUploadFileObject[]) => from(files)),
        mergeMap((file: WorkspaceitemSectionUploadFileObject) =>
          this.questionsBoardService.removeBitstreamsFromQuestionBoard(
            action.payload.questionsBoardId,
            action.payload.uploadStepConfiguration)),
        map(() => {
          this.notificationsService.success(null, this.translate.get('questions-board.clear-upload-files.success'));
          return new RemoveAllUploadedFilesFromQuestionsboardSuccessAction(action.payload.questionsBoardId);
        }),
        catchError((error: Error) => {
          if (error) {
            console.error(error.message);
          }
          return of(new RemoveAllUploadedFilesFromQuestionsboardErrorAction()).pipe(
            tap(() => {
              this.notificationsService.error(null, this.translate.get('questions-board.clear-upload-files.error'));
            })
          );
        })
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private questionsBoardService: QuestionsBoardService,
    private questionsBoardStateService: QuestionsBoardStateService,
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
