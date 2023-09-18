import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest as combineLatestObservable,
  from as observableFrom,
  Observable,
  of as observableOf,
  throwError as observableThrowError,
  from
} from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  reduce,
  take,
  tap
} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayStep } from './models/impact-pathway-step.model';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull, isNull } from '../../shared/empty.util';
import { ItemDataService } from '../../core/data/item-data.service';
import { SubmissionService } from '../../submission/submission.service';
import { environment } from '../../../environments/environment';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { SubmissionJsonPatchOperationsService } from '../../core/submission/submission-json-patch-operations.service';
import { JsonPatchOperationsBuilder } from '../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../core/json-patch/builder/json-patch-operation-path-combiner';
import { Item } from '../../core/shared/item.model';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { RemoteData } from '../../core/data/remote-data';
import { VocabularyService } from '../../core/submission/vocabularies/vocabulary.service';
import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { MetadataMap, MetadataValue } from '../../core/shared/metadata.models';
import { Metadata } from '../../core/shared/metadata.utils';
import {
  compareImpactPathwayIdSelector,
  impactPathwayByIDSelector,
  impactPathwayObjectsSelector,
  impactPathwayStateSelector,
  impactPathwaySubTaskCollapsable,
  isCompareMode,
  isImpactPathwayCompareProcessingSelector,
  isImpactPathwayLoadedSelector,
  isImpactPathwayProcessingSelector,
  isImpactPathwayRemovingSelector
} from './selectors';
import { AppState } from '../../app.reducer';
import { ImpactPathwayEntries, ImpactPathwayLink, ImpactPathwayState } from './impact-pathway.reducer';
import { SubmissionFormsConfigDataService } from '../../core/config/submission-forms-config-data.service';
import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { ItemJsonPatchOperationsService } from '../../core/data/item-json-patch-operations.service';
import {
  AddImpactPathwaySubTaskAction,
  AddImpactPathwayTaskAction,
  AddImpactPathwayTaskLinksAction,
  ClearImpactPathwayAction,
  ClearImpactPathwaySubtaskCollapseAction,
  GenerateImpactPathwayAction,
  GenerateImpactPathwaySubTaskAction,
  GenerateImpactPathwayTaskAction,
  InitCompareAction,
  InitCompareStepTaskAction,
  MoveImpactPathwaySubTaskAction,
  OrderImpactPathwaySubTasksAction,
  OrderImpactPathwayTasksAction,
  PatchImpactPathwayMetadataAction,
  PatchImpactPathwayTaskMetadataAction,
  RemoveImpactPathwayAction,
  RemoveImpactPathwaySubTaskAction,
  RemoveImpactPathwayTaskAction,
  SetImpactPathwaySubTaskCollapseAction,
  SetImpactPathwayTargetTaskAction,
  StopCompareImpactPathwayAction,
  StopCompareImpactPathwayStepTaskAction,
  UpdateImpactPathwayAction,
  UpdateImpactPathwayTaskAction
} from './impact-pathway.actions';
import { ErrorResponse } from '../../core/cache/response.models';
import {
  getFinishedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getFirstSucceededRemoteListPayload,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { ItemAuthorityRelationService } from '../../core/shared/item-authority-relation.service';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { Collection } from '../../core/shared/collection.model';
import { RequestService } from '../../core/data/request.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { SearchResult } from '../../shared/search/models/search-result.model';
import { SearchService } from '../../core/shared/search/search.service';
import { NoContent } from '../../core/shared/NoContent.model';
import { ComparedVersionItem, ProjectVersionService } from '../../core/project/project-version.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { FindListOptions } from '../../core/data/find-list-options.model';

@Injectable()
export class ImpactPathwayService {

  private _currentSelectedTask: BehaviorSubject<ImpactPathwayTask> = new BehaviorSubject<ImpactPathwayTask>(null);

  private _isAdmin: boolean;

  private _onTheirWayToBeRemoved: string[] = [];

  constructor(
    private collectionService: CollectionDataService,
    private vocabularyService: VocabularyService,
    private formConfigService: SubmissionFormsConfigDataService,
    private itemService: ItemDataService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private submissionJsonPatchOperationsService: SubmissionJsonPatchOperationsService,
    private rdbService: RemoteDataBuildService,
    private requestService: RequestService,
    private router: Router,
    private searchService: SearchService,
    private submissionService: SubmissionService,
    private projectVersionService: ProjectVersionService,
    private collectionDataService: CollectionDataService,
    private store: Store<AppState>
  ) {
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  set isAdmin(value: boolean) {
    this._isAdmin = value;
  }

  addImpactPathwayToBeRemovedList(id: string) {
    this._onTheirWayToBeRemoved.push(id);
  }

  isImpactPathwayToBeRemoved(id: string): boolean {
    return this._onTheirWayToBeRemoved.includes(id);
  }

  dispatchAddImpactPathwaySubTaskAction(
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    taskId: string
  ) {
    this.store.dispatch(new AddImpactPathwaySubTaskAction(
      impactPathwayId,
      stepId,
      parentTaskId,
      taskId));
  }

  dispatchAddImpactPathwayTaskAction(
    impactPathwayId: string,
    stepId: string,
    taskId: string
  ) {
    this.store.dispatch(new AddImpactPathwayTaskAction(
      impactPathwayId,
      stepId,
      taskId));
  }

  dispatchGenerateImpactPathway(projectId: string, impactPathwayName: string) {
    this.store.dispatch(new GenerateImpactPathwayAction(projectId, impactPathwayName));
  }

  dispatchGenerateImpactPathwaySubTask(
    projectId: string,
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    type: string,
    metadataMap: MetadataMap
  ) {
    this.store.dispatch(new GenerateImpactPathwaySubTaskAction(
      projectId,
      impactPathwayId,
      stepId,
      parentTaskId,
      type,
      metadataMap));
  }

  dispatchGenerateImpactPathwayTask(
    projectId: string,
    impactPathwayId: string,
    stepId: string,
    type: string,
    metadataMap: MetadataMap
  ) {
    this.store.dispatch(new GenerateImpactPathwayTaskAction(
      projectId,
      impactPathwayId,
      stepId,
      type,
      metadataMap));
  }

  dispatchMoveSubTask(
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    newParentTaskId: string,
    taskId: string) {
    this.store.dispatch(new MoveImpactPathwaySubTaskAction(
      impactPathwayId,
      stepId,
      parentTaskId,
      newParentTaskId,
      taskId
    ));
  }

  dispatchPatchImpactPathwayMetadata(
    impactPathwayId: string,
    impactPathway: ImpactPathway,
    metadata: string,
    metadataIndex: number,
    value: any
  ) {
    this.store.dispatch(new PatchImpactPathwayMetadataAction(
      impactPathwayId,
      impactPathway,
      metadata,
      metadataIndex,
      value
    ));
  }

  dispatchPatchImpactPathwayTaskMetadata(
    impactPathwayId: string,
    stepId: string,
    taskId: string,
    task: ImpactPathwayTask,
    metadata: string,
    metadataIndex: number,
    value: any
  ) {
    this.store.dispatch(new PatchImpactPathwayTaskMetadataAction(
      impactPathwayId,
      stepId,
      taskId,
      task,
      metadata,
      metadataIndex,
      value
    ));
  }

  dispatchRemoveImpactPathwayAction(projectItemId: string, impactPathwayId: string) {
    this.store.dispatch(new RemoveImpactPathwayAction(projectItemId, impactPathwayId));
  }

  dispatchOrderTasks(
    impactPathwayId: string,
    stepId: string,
    currentTasks: ImpactPathwayTask[],
    previousTasks: ImpactPathwayTask[]
  ) {
    this.store.dispatch(new OrderImpactPathwayTasksAction(
      impactPathwayId,
      stepId,
      currentTasks,
      previousTasks
    ));
  }

  dispatchOrderSubTasks(
    impactPathwayId: string,
    stepId: string,
    parentTaskId: string,
    currentTasks: ImpactPathwayTask[],
    previousTasks: ImpactPathwayTask[]
  ) {
    this.store.dispatch(new OrderImpactPathwaySubTasksAction(
      impactPathwayId,
      stepId,
      parentTaskId,
      currentTasks,
      previousTasks
    ));
  }

  dispatchSetTargetTask(taskId: string) {
    this.store.dispatch(new SetImpactPathwayTargetTaskAction(taskId));
  }

  /**
   * Dispatch a new UpdateImpactPathwayAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param impactPathway
   *    the updated impact pathway
   */
  dispatchUpdateImpactPathway(impactPathwayId: string, impactPathway: ImpactPathway): void {
    this.store.dispatch(new UpdateImpactPathwayAction(impactPathwayId, impactPathway));
  }


  /**
   * Dispatch a new StopCompareImpactPathwayAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   */
  dispatchStopCompare(impactPathwayId: string) {
    this.store.dispatch(new StopCompareImpactPathwayAction(impactPathwayId));
  }

  /**
   * Initialize to compare the steps that were previously compared
   *
   * @param compareList
   *    the list of compared steps
   */
  initCompareImpactPathwaySteps(compareList: ComparedVersionItem[]): Observable<ImpactPathwayStep[]> {
    return observableFrom(compareList).pipe(
      concatMap((compareItem: ComparedVersionItem) => this.initCompareImpactPathwayTasksFromStep(
        compareItem.item.id,
        compareItem.item,
        compareItem.versionItem?.id).pipe(
          map((steps: ImpactPathwayStep[]) => this.initImpactPathwayStepFromCompareItem(
            compareItem,
            steps
          )),
        )),
      reduce((acc: any, value: any) => [...acc, value], []),
    );
  }

  /**
   * Prepare the impact pathway Links from the tasks of a step
   * on compare mode
   * @param step step to prepare the links from
   * @param impactPathwayId the impact pathway id
   */
  addImpactPathwayCompareLinksFromTaskItem(step: ImpactPathwayStep, impactPathwayId: string): Observable<RemoteData<Item>> {
    return from(step.tasks).pipe(
      mergeMap((task) => this.itemService.findById(task.id).pipe(
        getFinishedRemoteData(),
        tap((rd: RemoteData<Item>) => this.addImpactPathwayLinksFromTaskItem(rd.payload, impactPathwayId, step.id)),
      )),
    );
  }

  /**
   * Initialize to compare the steps that were previously compared
   *
   * @param impactPathwayStepId
   *    the step id
   * @param compareList
   *    the list of compared steps
   */
  initCompareImpactPathwayStepTasks(impactPathwayStepId: string, compareList: ComparedVersionItem[]): Observable<ImpactPathwayTask[]> {
    return observableFrom(compareList).pipe(
      concatMap((compareItem: ComparedVersionItem) => this.initCompareImpactPathwayTasksFromTask(
        compareItem.item.id,
        compareItem.item,
        compareItem.versionItem?.id).pipe(
        map((tasks: ImpactPathwayTask[]) => this.initImpactPathwayTaskFromCompareItem(
          compareItem,
          impactPathwayStepId,
          tasks
        ))
      )),
      reduce((acc: any, value: any) => [...acc, value], [])
    );
  }

  /**
   * Initialize to compare the tasks for a specific step
   *
   * @param targetImpactPathwayStepId
   *    the impact pathway's step id
   * @param targetItem
   *    the impact pathway's step compared item
   * @param versionedImpactPathwayStepId
   *    the impact pathway's step compared item with
   */
  initCompareImpactPathwayTasksFromStep(targetImpactPathwayStepId: string, targetItem: Item, versionedImpactPathwayStepId: string): Observable<ImpactPathwayStep[]> {
    return this.projectVersionService.compareItemChildrenByMetadata(
      targetImpactPathwayStepId,
      versionedImpactPathwayStepId,
      environment.impactPathway.impactPathwayTaskRelationMetadata).pipe(
      mergeMap((compareList: ComparedVersionItem[]) => {
        return observableFrom(compareList).pipe(
          concatMap((compareItem: ComparedVersionItem) => observableOf(this.initImpactPathwayTaskFromCompareItem(
            compareItem,
            targetImpactPathwayStepId)
          )),
          reduce((acc: any, value: any) => {
            if (isNotNull(value)) {
              return [...acc, value];
            } else {
              return acc;
            }
          }, [])
        );
      })
    );
  }

  /**
   * Initialize to compare the tasks for a specific step
   *
   * @param targetImpactPathwayTaskId
   *    the impact pathway's step id
   * @param targetItem
   *    the impact pathway's step compared item
   * @param versionedImpactPathwayTaskId
   *    the impact pathway's step compared item with
   */
  initCompareImpactPathwayTasksFromTask(targetImpactPathwayTaskId: string, targetItem: Item, versionedImpactPathwayTaskId: string): Observable<ImpactPathwayTask[]> {
    return this.projectVersionService.compareItemChildrenByMetadata(
      targetImpactPathwayTaskId,
      versionedImpactPathwayTaskId,
      environment.impactPathway.impactPathwayTaskRelationMetadata).pipe(
      mergeMap((compareList: ComparedVersionItem[]) => {
        return observableFrom(compareList).pipe(
          concatMap((compareItem: ComparedVersionItem) => observableOf(this.initImpactPathwayTaskFromCompareItem(
            compareItem,
            targetImpactPathwayTaskId)
          )),
          reduce((acc: any, value: any) => {
            if (isNotNull(value)) {
              return [...acc, value];
            } else {
              return acc;
            }
          }, [])
        );
      })
    );
  }

  /**
   * Initialize to construct the compared step
   *
   * @param compareObj
   *    the compared object
   * @param tasks
   *    the tasks or steps related to the object
   */
  public initImpactPathwayStepFromCompareItem(compareObj: ComparedVersionItem, tasks: ImpactPathwayStep[] | ImpactPathwayTask[] = []): ImpactPathwayStep {
    const type = compareObj.item.firstMetadataValue(environment.impactPathway.impactPathwayStepTypeMetadata);
    const parent = compareObj.item.firstMetadataValue(environment.impactPathway.impactPathwayParentRelationMetadata);
    return Object.assign(new ImpactPathwayStep(), {
      id: compareObj.item.id,
      parentId: parent,
      title: compareObj.item.name,
      type: type,
      tasks: tasks,
    });
  }

  /**
   * Initialize to construct the compared step
   *
   * @param compareObj
   *    the compared object
   * @param parentId
   *    id of linked parent pathway
   * @param tasks
   *    the tasks or steps related to the object
   */
  public initImpactPathwayTaskFromCompareItem(compareObj: ComparedVersionItem, parentId?: string, tasks: ImpactPathwayTask[] = []): ImpactPathwayTask {
    const type = compareObj.item.firstMetadataValue('dspace.entity.type');
    const description = compareObj.item.firstMetadataValue('dc.description');
    const status = compareObj.item.firstMetadataValue('synsicris.type.status');
    const internalStatus = compareObj.item.firstMetadataValue('synsicris.type.internal');
    return Object.assign(new ImpactPathwayTask(), {
      id: compareObj.item.id,
      compareId: compareObj.versionItem?.id,
      compareStatus: compareObj.status,
      parentId: parentId,
      title: compareObj.item.name,
      type: type,
      tasks: tasks,
      description: description,
      status: status,
      internalStatus: internalStatus
    });
  }

  /**
   * Dispatch a new InitCompareStepTaskAction
   *
   * @param impactPathwayId
   *    the id of impact pathway that the task belongs to
   * @param impactPathwayStepId
   *    the id of impact pathway step that the task belongs to
   * @param compareImpactPathwayStepId
   *    the impact pathway step's id to compare with the current one
   * @param activeImpactPathwayStepId
   *    the loaded impact pathway step's id
   */
  public initCompareImpactPathwayTask(impactPathwayId: string, impactPathwayStepId: string, compareImpactPathwayStepId: string, activeImpactPathwayStepId: string) {
    this.store.dispatch(new InitCompareStepTaskAction(impactPathwayId, impactPathwayStepId, compareImpactPathwayStepId, activeImpactPathwayStepId));
  }


  /**
   * Dispatch a new StopCompareImpactPathwayStepTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param impactPathwayStepId
   *    the impact pathway's step id
   * @param impactPathwayStepTaskId
   *    the impact pathway's step task id
   */
  dispatchStopCompareImpactPathwayTask(impactPathwayId, impactPathwayStepId, impactPathwayStepTaskId: string) {
    this.store.dispatch(new StopCompareImpactPathwayStepTaskAction(impactPathwayId, impactPathwayStepId, impactPathwayStepTaskId));
  }

  /**
   * Dispatch a new UpdateImpactPathwayTaskAction
   *
   * @param impactPathwayId
   *    the impact pathway's id
   * @param stepId
   *    the impact pathway step's id where to update task
   * @param taskId
   *    the Item id of the impact pathway task to add
   * @param task
   *    the updated impact pathway task
   */
  dispatchUpdateImpactPathwayTask(impactPathwayId: string, stepId: string, taskId: string, task: ImpactPathwayTask): void {
    this.store.dispatch(new UpdateImpactPathwayTaskAction(impactPathwayId, stepId, taskId, task));
  }

  dispatchSetImpactPathwaySubTaskCollapse(impactPathwayStepId: string, impactPathwayTaskId: string, value: boolean) {
    this.store.dispatch(new SetImpactPathwaySubTaskCollapseAction(impactPathwayStepId, impactPathwayTaskId, value));
  }

  dispatchClearCollapsable() {
    this.store.dispatch(new ClearImpactPathwaySubtaskCollapseAction());
  }

  /**
   * Dispatch a new InitCompareAction
   *
   * @param baseImpactPathwayId
   *    the base impact pathway's id
   * @param compareImpactPathwayId
   *    the impact pathway's id to compare with
   * @param activeImpactPathwayId
   *    the loaded impact pathway's
   */
  public dispatchInitCompare(baseImpactPathwayId: string, compareImpactPathwayId: string, activeImpactPathwayId: string) {
    this.store.dispatch(new InitCompareAction(baseImpactPathwayId, compareImpactPathwayId, activeImpactPathwayId));
  }


  /**
   * Check compareMode is true
   */
  public isCompareModeActive() {
    return this.store.pipe(select(isCompareMode));
  }

  /**
   * Check compareMode is true
   */
  public getCompareImpactPathwayId(): Observable<string> {
    return this.store.pipe(select(compareImpactPathwayIdSelector));
  }

  getCreateTaskFormConfigName(stepType: string, isObjectivePage: boolean): string {
    return isObjectivePage ? `impact_pathway_${stepType}_task_objective_form` : `impact_pathway_${stepType}_task_form`;
  }

  getSearchTaskConfigName(stepType: string, isObjectivePage: boolean): string {
    return isObjectivePage ? `impactpathway_${stepType}_objective_task_type` : `impactpathway_${stepType}_task_type`;
  }

  getTaskTypeAuthorityName(stepType: string, isObjectivePage: boolean): string {
    return isObjectivePage ? `impactpathway_${stepType}_task_objective_type` : `impactpathway_${stepType}_task_type`;
  }

  generateImpactPathwayItem(projectId: string, impactPathwayName: string, impactPathwayDescription: string): Observable<Item> {
    return this.createImpactPathwayWorkspaceItem(projectId, impactPathwayName, impactPathwayDescription).pipe(
      mergeMap((submission: SubmissionObject) => this.depositWorkspaceItem(submission)),
      getFirstSucceededRemoteDataPayload()
    );
  }

  /*  generateImpactPathwayTaskItem(projectId: string, taskType: string, metadata: MetadataMap): Observable<Item> {
      return this.createImpactPathwayTaskWorkspaceItem(projectId, taskType).pipe(
        mergeMap((submission: SubmissionObject) => observableOf(submission.item).pipe(
          tap(() => this.addWSIPatchOperationForImpactPathwayTask(metadata, this.getImpactPathwaysTaskFormSection())),
          delay(100),
          mergeMap((taskItem: Item) => this.executeSubmissionPatch(submission.id, this.getImpactPathwaysTaskFormSection()).pipe(
            mergeMap(() => this.depositWorkspaceItem(submission).pipe(
              getFirstSucceededRemoteDataPayload()
            ))
          ))
        ))
      );
    }*/

  getImpactPathwayStepIds(impactPathwayId: string): Observable<string[]> {
    return this.store.pipe(
      select(impactPathwayObjectsSelector),
      map((entries: ImpactPathwayEntries) => entries[impactPathwayId]),
      take(1),
      map((impactPathway: ImpactPathway) => impactPathway.steps.map((step: ImpactPathwayStep) => step.id))
    );
  }

  getImpactPathwayStepTaskFormHeader(stepType: string, isObjective = false): string {
    return isObjective ? `impact_pathway_${stepType}_task_objective_form` : `impact_pathway_${stepType}_task_form`;
  }

  getImpactPathwayStepTaskSearchHeader(stepType: string, isObjective = false): string {
    return isObjective ? `impact-pathway.${stepType}.task_objective_search.info` : `impact-pathway.${stepType}.task_search.info`;
  }

  getImpactPathwayFormConfig(): Observable<SubmissionFormModel> {
    const formName = 'impact_pathway_form';
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getImpactPathwayTaskEditFormConfig(stepType: string): Observable<SubmissionFormModel> {
    const formName = `impact_pathway_${stepType}_task_objective_edit_form`;
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getImpactPathwayStepTaskFormConfig(stepType: string, isObjective = false): Observable<SubmissionFormModel> {
    const formName = isObjective ? `impact_pathway_${stepType}_task_objective_form` : `impact_pathway_${stepType}_task_form`;
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getImpactPathwayStepTitle(stepId: string): Observable<string> {
    return this.itemService.findById(stepId).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => item.name)
    );
  }

  getImpactPathwayById(impactPathwayId: string): Observable<ImpactPathway> {
    return this.store.pipe(
      select(impactPathwayObjectsSelector),
      map((entries: ImpactPathwayEntries) => entries[impactPathwayId])
    );
  }

  getImpactPathways(): Observable<ImpactPathway[]> {
    return this.store.pipe(
      select(impactPathwayObjectsSelector),
      map((entries: ImpactPathwayEntries) => Object.keys(entries).map((key) => entries[key])),
      take(1)
    );
  }

  getImpactPathwayStepById(impactPathwayStepId: string): Observable<ImpactPathwayStep> {
    return this.store.pipe(
      select(impactPathwayObjectsSelector),
      map((entries: ImpactPathwayEntries) => Object.keys(entries)
        .filter((key) => entries[key].hasStep(impactPathwayStepId))
        .map((key) => entries[key]).pop()),
      filter((impactPathway: ImpactPathway) => isNotEmpty(impactPathway)),
      map((impactPathway: ImpactPathway) => impactPathway.getStep(impactPathwayStepId))
    );
  }

  getImpactPathwayTargetTask(): Observable<string> {
    return this.store.pipe(
      select(impactPathwayStateSelector),
      map((state: ImpactPathwayState) => state.targetTaskId),
      distinctUntilChanged()
    );
  }

  getImpactPathwayTasksByStepId(impactPathwayId: string, impactPathwayStepId: string): Observable<ImpactPathwayTask[]> {
    return this.store.pipe(
      select(impactPathwayByIDSelector(impactPathwayId)),
      filter((impactPathway: ImpactPathway) => isNotEmpty(impactPathway) && isNotEmpty(impactPathway.getStep(impactPathwayStepId))),
      map((impactPathway: ImpactPathway) => impactPathway.getStep(impactPathwayStepId)?.tasks)
    );
  }

  getImpactPathwayTaskById(impactPathwayId: string, impactPathwayStepId: string, taskId: string): Observable<ImpactPathwayTask> {
    return this.store.pipe(
      select(impactPathwayByIDSelector(impactPathwayId)),
      filter((impactPathway: ImpactPathway) => isNotEmpty(impactPathway) && isNotEmpty(impactPathway.getStep(impactPathwayStepId))),
      mergeMap((impactPathway: ImpactPathway) => impactPathway.getStep(impactPathwayStepId)?.tasks),
      filter((task: ImpactPathwayTask) => taskId === task?.id)
    );
  }

  getImpactPathwayTaskType(stepType: string, taskType: string, isObjective: boolean): Observable<string> {
    const name = isObjective ? `impactpathway_${stepType}_task_objective_type` : `impactpathway_${stepType}_task_type`;
    const vocabularyOptions: VocabularyOptions = new VocabularyOptions(name);

    return this.vocabularyService.getVocabularyEntryByValue(taskType, vocabularyOptions).pipe(
      map((entry: VocabularyEntry) => {
        if (isNull(entry)) {
          throw new Error(`No task type found for ${taskType}`);
        }

        return entry.display;
      }),
      catchError((error: Error) => observableOf(''))
    );
  }

  getImpactPathwaySubTasksByParentId(
    impactPathwayId: string,
    impactPathwayStepId: string,
    impactPathwayTaskId): Observable<ImpactPathwayTask[]> {
    return this.store.pipe(
      select(impactPathwayByIDSelector(impactPathwayId)),
      filter((impactPathway: ImpactPathway) => isNotEmpty(impactPathway)),
      map((impactPathway: ImpactPathway) => {
        return impactPathway.getStep(impactPathwayStepId).getTask(impactPathwayTaskId).tasks;
      })
    );
  }

  initImpactPathway(item: Item): Observable<ImpactPathway> {
    const description = item.firstMetadataValue('dc.description');
    return this.initImpactPathwaySteps(item.id, item).pipe(
      map((steps: ImpactPathwayStep[]) => {
        return new ImpactPathway(item.id, item.name, description, steps);
      })
    );
  }

  initImpactPathwaySteps(impactPathwayId: string, parentItem: Item): Observable<ImpactPathwayStep[]> {
    return observableFrom(Metadata.all(parentItem.metadata, environment.impactPathway.impactPathwayStepRelationMetadata)).pipe(
      concatMap((step: MetadataValue) => this.itemService.findById(step.authority).pipe(
        getFirstSucceededRemoteDataPayload(),
        mergeMap((stepItem: Item) => this.initImpactPathwayTasksFromParentItem(impactPathwayId, stepItem).pipe(
          map((tasks: ImpactPathwayTask[]) => this.initImpactPathwayStep(impactPathwayId, stepItem, tasks))
        )),
      )),
      reduce((acc: any, value: any) => [...acc, value], [])
    );
  }

  initImpactPathwayTasksFromParentItem(impactPathwayId: string, parentItem: Item, buildLinks = true): Observable<ImpactPathwayTask[]> {
    const relatedTaskMetadata = Metadata.all(parentItem.metadata, environment.impactPathway.impactPathwayTaskRelationMetadata);
    if (isEmpty(relatedTaskMetadata)) {
      return observableOf([]);
    } else {
      return observableFrom(Metadata.all(parentItem.metadata, environment.impactPathway.impactPathwayTaskRelationMetadata)).pipe(
        concatMap((task: MetadataValue) => this.itemService.findById(task.authority).pipe(
          getFinishedRemoteData(),
          mergeMap((rd: RemoteData<Item>) => {
            if (rd.hasSucceeded) {
              const taskItem = rd.payload;
              return this.initImpactPathwayTasksFromParentItem(impactPathwayId, taskItem, false).pipe(
                tap(() => {
                  if (buildLinks) {
                    this.addImpactPathwayLinksFromTaskItem(taskItem, impactPathwayId, parentItem.id);
                  }
                }),
                map((tasks: ImpactPathwayTask[]) => this.initImpactPathwayTask(taskItem, parentItem.id, tasks))
              );
            } else {
              if (rd.statusCode === 404) {
                // NOTE if a task is not found probably it has been deleted without unlinking it from parent step, so unlink it
                return this.itemAuthorityRelationService.removeChildRelationFromParent(
                  this.getImpactPathwaysEditFormSection(),
                  this.getImpactPathwaysEditMode(),
                  parentItem.id,
                  task.authority,
                  environment.impactPathway.impactPathwayTaskRelationMetadata
                ).pipe(mapTo(null));
              } else {
                return observableOf(null);
              }
            }
          })
        )),
        reduce((acc: any, value: any) => {
          if (isNotNull(value)) {
            return [...acc, value];
          } else {
            return acc;
          }
        }, [])
      );
    }
  }

  moveSubTask(previousParentTaskId: string, newParentTaskId: string, taskId: string): Observable<Item> {
    return this.itemAuthorityRelationService.removeChildRelationFromParent(
      this.getImpactPathwaysEditFormSection(),
      this.getImpactPathwaysEditMode(),
      previousParentTaskId,
      taskId,
      environment.impactPathway.impactPathwayTaskRelationMetadata).pipe(
        mergeMap(() => this.itemAuthorityRelationService.addLinkedItemToParentAndReturnChild(
          'metadata',
          null,
          newParentTaskId,
          taskId,
          environment.impactPathway.impactPathwayTaskRelationMetadata))
      );
  }

  orderTasks(parentTasksId: string, tasks: Pick<MetadataValue, 'authority' | 'value'>[]): Observable<Item> {
    return this.itemAuthorityRelationService.orderRelations(
      this.getImpactPathwaysEditFormSection(),
      this.getImpactPathwaysEditMode(),
      parentTasksId,
      tasks,
      environment.impactPathway.impactPathwayTaskRelationMetadata
    );
  }

  removeByItemId(itemId: string): Observable<boolean> {
    return this.itemService.delete(itemId).pipe(
      map((response: RemoteData<NoContent>) => response.isSuccess)
    );
  }

  removeByHref(href: string): Observable<boolean> {
    return this.itemService.deleteByHref(href).pipe(
      getFinishedRemoteData(),
      map((response: RemoteData<NoContent>) => response.isSuccess)
    );
  }

  setSelectedTask(task: ImpactPathwayTask): void {
    this._currentSelectedTask.next(task);
  }

  getSelectedTask(): Observable<ImpactPathwayTask> {
    return this._currentSelectedTask;
  }

  removeTaskFromStep(impactPathwayId: string, parentId: string, taskId: string, taskPosition: number): void {
    this.store.dispatch(new RemoveImpactPathwayTaskAction(impactPathwayId, parentId, taskId, taskPosition));
  }

  removeSubTaskFromTask(impactPathwayId: string, stepId: string, parentId: string, taskId: string, taskPosition: number): void {
    this.store.dispatch(new RemoveImpactPathwaySubTaskAction(impactPathwayId, stepId, parentId, taskId, taskPosition));
  }

  initImpactPathwayTask(taskItem: Item, parentId?: string, tasks: ImpactPathwayTask[] = []): ImpactPathwayTask {
    const type = taskItem.firstMetadataValue('dspace.entity.type');
    const description = taskItem.firstMetadataValue('dc.description');
    const internalStatus = taskItem.firstMetadataValue('synsicris.type.internal');
    const status = taskItem.firstMetadataValue('synsicris.type.status');

    return new ImpactPathwayTask(
      taskItem.id,
      type,
      parentId,
      taskItem.name,
      description,
      null,
      null,
      tasks,
      status,
      internalStatus
    );
  }

  updateImpactPathwayTask(newTaskItem: Item, oldTask: ImpactPathwayTask): ImpactPathwayTask {
    const description = newTaskItem.firstMetadataValue('dc.description');
    const internalStatus = newTaskItem.firstMetadataValue('synsicris.type.internal');
    const status = newTaskItem.firstMetadataValue('synsicris.type.status');

    return new ImpactPathwayTask(
      oldTask.id,
      oldTask.type,
      oldTask.parentId,
      newTaskItem.name,
      description,
      oldTask.compareId,
      oldTask.compareStatus,
      oldTask.tasks,
      status,
      internalStatus
    );
  }

  updateImpactPathway(newImpactPathwayItem: Item, oldImpactPathway: ImpactPathway): ImpactPathway {
    const description = newImpactPathwayItem.firstMetadataValue('dc.description');

    return new ImpactPathway(oldImpactPathway.id, newImpactPathwayItem.name, description, oldImpactPathway.steps);
  }

  isProcessing(): Observable<boolean> {
    return this.store.pipe(select(isImpactPathwayProcessingSelector));
  }

  isCompareProcessing(): Observable<boolean> {
    return this.store.pipe(select(isImpactPathwayCompareProcessingSelector));
  }

  isRemoving(): Observable<boolean> {
    return this.store.pipe(select(isImpactPathwayRemovingSelector));
  }

  initImpactPathwayStep(parentId: string, stepItem: Item, tasks: ImpactPathwayTask[]): ImpactPathwayStep {
    const type = stepItem.firstMetadataValue(environment.impactPathway.impactPathwayStepTypeMetadata);

    return new ImpactPathwayStep(parentId, stepItem.id, type, stepItem.name, tasks);
  }

  retrieveObjectItem(id: string): Observable<Item> {
    return this.itemService.findById(id).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }

  /**
   * Invalidate impact pathway result cache hit
   */
  public invalidateImpactPathwaysResultsCache() {
    this.requestService.setStaleByHrefSubstring(`configuration=${environment.impactPathway.impactPathwaysSearchConfigName}`);
  }

  retrieveImpactPathwaysByProject(projectId: string, options: PageInfo): Observable<PaginatedList<Item>> {
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = Object.assign(new PaginationComponentOptions(), {
      currentPage: options.currentPage,
      pageSize: options.elementsPerPage
    });

    const searchOptions = new PaginatedSearchOptions({
      configuration: environment.impactPathway.impactPathwaysSearchConfigName,
      scope: projectId,
      pagination: pagination,
      sort: sort
    });

    return this.searchService.search(searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => searchResult.indexableObject)
          .filter((item: Item) => !this.isImpactPathwayToBeRemoved(item.id));
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<Item>>) => rd.payload),
      take(1),
      distinctUntilChanged()
    );
  }

  checkAndRemoveRelations(itemId: string): Observable<Item> {
    return this.itemAuthorityRelationService.removeRelationFromParent(
      this.getImpactPathwaysEditFormSection(),
      this.getImpactPathwaysEditMode(),
      itemId,
      environment.impactPathway.impactPathwayParentRelationMetadata,
      environment.impactPathway.impactPathwayTaskRelationMetadata
    ).pipe(
      mergeMap(() => this.itemAuthorityRelationService.unlinkParentItemFromChildren(
        this.getImpactPathwaysEditFormSection(),
        this.getImpactPathwaysEditMode(),
        itemId,
        environment.impactPathway.impactPathwayParentRelationMetadata,
        environment.impactPathway.impactPathwayTaskRelationMetadata
      ))
    );
  }

  isImpactPathwayLoaded(): Observable<boolean> {
    return this.store.pipe(
      select(isImpactPathwayLoadedSelector),
      distinctUntilChanged()
    );
  }

  isImpactPathwayLoadedById(impactPathwayId: string): Observable<boolean> {
    const isLoaded$: Observable<boolean> = this.store.pipe(
      select(isImpactPathwayLoadedSelector)
    );

    const impactPathWay$: Observable<ImpactPathway> = this.store.pipe(
      select(impactPathwayByIDSelector(impactPathwayId))
    );

    return combineLatestObservable([isLoaded$, impactPathWay$]).pipe(
      map(([isLoaded, impactPathway]) => isLoaded && isNotEmpty(impactPathway)),
      take(1)
    );
  }

  redirectToEditPage(impactPathwayId: string) {
    this.router.navigate(['entities', 'impactpathway', impactPathwayId]);
  }

  redirectToProjectPage(projectItemId: string,) {
    this.router.navigate(['items', projectItemId]);
  }

  private createImpactPathwaySteps(projectId: string, impactPathwayId: string, impactPathwayName: string): Observable<Item[]> {
    const vocabularyOptions: VocabularyOptions = new VocabularyOptions(
      environment.impactPathway.impactPathwayStepTypeAuthority
    );
    const pageInfo: PageInfo = new PageInfo({
      elementsPerPage: 100,
      currentPage: 1
    } as any);

    return this.vocabularyService.getVocabularyEntries(vocabularyOptions, pageInfo).pipe(
      getFirstSucceededRemoteListPayload(),
      mergeMap((entries: VocabularyEntry[]) => observableFrom(entries)),
      concatMap((stepType: VocabularyEntry) => this.createImpactPathwayStepItem(
        projectId,
        impactPathwayId,
        impactPathwayName,
        stepType.value,
        stepType.display
      )),
      reduce((acc: any, value: any) => [...acc, value], []),
    );
  }

  private createImpactPathwayStepWorkspaceItem(projectId: string, impactPathwayId: string, impactPathwayName: string, impactPathwayStepType: string, impactPathwayStepName: string): Observable<SubmissionObject> {
    const submission$ = this.getCollectionIdByProjectAndEntity(projectId, environment.impactPathway.impactPathwayStepEntity).pipe(
      mergeMap((collectionId) => this.submissionService.createSubmission(collectionId, environment.impactPathway.impactPathwayStepEntity)),
      mergeMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      ));

    return combineLatestObservable([submission$, this.getImpactPathwayStepsFormSection()]).pipe(
      tap(([submission, sectionName]) => this.addPatchOperationForImpactPathwayStep(impactPathwayId, impactPathwayName, sectionName, impactPathwayStepType, impactPathwayStepName)),
      delay(100),
      mergeMap(([submission, sectionName]) => this.executeSubmissionPatch(submission.id, sectionName))
    );
  }

  private createImpactPathwayStepItem(
    projectId: string,
    impactPathwayId: string,
    impactPathwayName: string,
    impactPathwayStepType: string,
    impactPathwayStepName: string): Observable<Item> {

    return this.createImpactPathwayStepWorkspaceItem(projectId, impactPathwayId, impactPathwayName, impactPathwayStepType, impactPathwayStepName).pipe(
      mergeMap((submission: SubmissionObject) => this.depositWorkspaceItem(submission)),
      getFirstSucceededRemoteDataPayload()
    );
  }

  public canCreateImpactPathwayItem(projectCommunityId: string): Observable<boolean> {
    const findListOptions = Object.assign({}, new FindListOptions(), {
      elementsPerPage: 1,
      currentPage: 1,
    });
    return this.collectionDataService.getAuthorizedCollectionByCommunityAndEntityType(projectCommunityId, environment.impactPathway.impactPathwayEntity, findListOptions).pipe(
      getRemoteDataPayload(),
      map((collections: PaginatedList<Collection>) => collections?.totalElements === 1)
    );
  }

  private createImpactPathwayWorkspaceItem(projectId: string, impactPathwayName: string, impactPathwayDescription: string): Observable<SubmissionObject> {
    const submission$ = this.getCollectionIdByProjectAndEntity(projectId, environment.impactPathway.impactPathwayEntity).pipe(
      mergeMap((collectionId) => this.submissionService.createSubmission(collectionId, environment.impactPathway.impactPathwayEntity)),
      mergeMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      ),
      map((submission: SubmissionObject) => {
        return [submission, (submission.item as Item).id];
      }));
    return forkJoin([submission$.pipe(
      mergeMap(([submission, parentId]: [SubmissionObject, string]) => this.createImpactPathwaySteps(projectId, parentId, impactPathwayName).pipe(
        map((steps) => {
          return [submission, steps];
        })
      ))),
      this.getImpactPathwaysFormSection()]
    ).pipe(
      tap(([objects, sectionName]: [any[], string]) => {
        this.addPatchOperationForImpactPathway(sectionName, impactPathwayName, impactPathwayDescription, objects[1]);
      }),
      delay(100),
      mergeMap(([objects, sectionName]: [any[], string]) => this.executeSubmissionPatch(objects[0].id, sectionName))
    );
  }

  private createImpactPathwayTaskWorkspaceItem(projectId: string, taskType: string): Observable<SubmissionObject> {
    return this.getCollectionIdByProjectAndEntity(projectId, taskType).pipe(
      mergeMap((collectionId) => this.submissionService.createSubmission(collectionId, taskType).pipe(
        mergeMap((submission: SubmissionObject) =>
          (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
        )
      )),
    );
  }

  private addPatchOperationForImpactPathway(sectionName: string, impactPathwayName: string, impactPathwayDescription: string, steps: Item[]) {
    const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionName);
    this.operationsBuilder.add(pathCombiner.getPath('dc.title'), impactPathwayName, true, true);
    this.operationsBuilder.add(pathCombiner.getPath('dc.description'), impactPathwayDescription, true, true);
    const stepValueList = steps.map((step: Item) => Object.assign(new VocabularyEntry(), {
      authority: step.id,
      value: step.name,
      confidence: 600,
    }));
    this.operationsBuilder.add(pathCombiner.getPath(environment.impactPathway.impactPathwayStepRelationMetadata), stepValueList, true, false);
  }

  private addPatchOperationForImpactPathwayStep(
    impactPathwayId: string,
    impactPathwayName: string,
    sectionName: string,
    impactPathwayStepType: string,
    impactPathwayStepName: string
  ) {
    const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionName);
    this.operationsBuilder.add(
      pathCombiner.getPath('dc.title'),
      impactPathwayStepName,
      true,
      true
    );

    this.operationsBuilder.add(
      pathCombiner.getPath(environment.impactPathway.impactPathwayStepTypeMetadata),
      impactPathwayStepType,
      true,
      true
    );

    const parent = {
      value: impactPathwayName,
      authority: impactPathwayId,
      place: 0,
      confidence: 600
    };
    this.operationsBuilder.add(pathCombiner.getPath(environment.impactPathway.impactPathwayParentRelationMetadata), parent, true, true);

  }

  private addPatchOperationForImpactPathwayTask(metadata: MetadataMap): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    Object.keys(metadata)
      .filter((metadataName) => metadataName !== 'dspace.entity.type')
      .forEach((metadataName) => {
        if (metadataName !== 'cris.project.shared') {
          this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
        } else {
          const path = pathCombiner.getPath([metadataName, '0']);
          this.operationsBuilder.replace(path, metadata[metadataName], true);
        }
      });
  }

  private addWSIPatchOperationForImpactPathwayTask(metadata: MetadataMap, pathName: string): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('sections', pathName);
    Object.keys(metadata)
      .filter((metadataName) => metadataName !== 'dspace.entity.type')
      .forEach((metadataName) => {
        if (metadataName !== 'cris.project.shared') {
          this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
        } else {
          const path = pathCombiner.getPath([metadataName, '0']);
          this.operationsBuilder.replace(path, metadata[metadataName], true);
        }
      });
  }

  private executeSubmissionPatch(objectId: string, pathName: string): Observable<SubmissionObject> {
    return this.submissionJsonPatchOperationsService.jsonPatchByResourceID(
      'workspaceitems',
      objectId,
      'sections',
      pathName).pipe(
        take(1),
        map((result: SubmissionObject[]) => (result[0] && isEmpty(result[0].errors)) ? result[0] : null),
        catchError(() => observableOf(null))
      );
  }

  private executeItemPatch(objectId: string, pathName: string): Observable<Item> {
    return this.itemJsonPatchOperationsService.jsonPatchByResourceType(
      'items',
      objectId,
      pathName).pipe(
        tap((item: Item) => this.itemService.update(item)),
        catchError((error: ErrorResponse) => observableThrowError(new Error(error.errorMessage)))
      );
  }

  private depositWorkspaceItem(submission: SubmissionObject): Observable<RemoteData<Item>> {
    return this.submissionService.depositSubmission(submission.self).pipe(
      mergeMap(() => this.itemService.findById((submission.item as Item).id))
    );
  }

  getImpactPathwaysEditFormSection(): string {
    return `sections/${environment.impactPathway.impactPathwaysEditFormSection}`;
  }

  getImpactPathwaysTaskFormSection(): string {
    return environment.impactPathway.impactPathwayTasksFormSection;
  }

  getImpactPathwaysEditMode(): string {
    return this.isAdmin ? environment.impactPathway.impactPathwaysAdminEditMode :  environment.impactPathway.impactPathwaysEditMode;
  }

  private getImpactPathwaysFormSection(): Observable<string> {
    return observableOf(environment.impactPathway.impactPathwaysFormSection);
  }

  private getImpactPathwayStepsFormSection(): Observable<string> {
    return observableOf(environment.impactPathway.impactPathwayStepsFormSection);
  }

  private addImpactPathwayLinksFromTaskItem(taskItem: Item, impactPathwayId: string, impactPathwayStepId: string): void {
    const taskOutcomeLinkList: MetadataValue[] = taskItem
      .findMetadataSortedByPlace(environment.impactPathway.impactpathwayOutcomeLinkMetadata);
    const taskBidirectionalLinkList: MetadataValue[] = taskItem
      .findMetadataSortedByPlace(environment.impactPathway.impactpathwayBidirectionalLinkMetadata);

    const linksList: ImpactPathwayLink[] = [];

    taskOutcomeLinkList
      .filter((metadataValue: MetadataValue) => metadataValue.value.startsWith(`${impactPathwayId}:`))
      .forEach((metadataValue: MetadataValue) => {
        const [targetImpactPathwayId, targetImpactPathwayStepId] = metadataValue.value.split(':');
        if (isNotEmpty(targetImpactPathwayId) && isNotEmpty(targetImpactPathwayStepId)) {
          linksList.push({
            from: `task-${impactPathwayStepId}-${taskItem.id}`,
            fromTaskId: taskItem.id,
            to: `task-${targetImpactPathwayStepId}-${metadataValue.authority}`,
            toTaskId: metadataValue.authority,
            toTaskUniqueId: `${targetImpactPathwayId}:${targetImpactPathwayStepId}`,
            twoWay: false
          });
        }
      });

    taskBidirectionalLinkList
      .filter((metadataValue: MetadataValue) => metadataValue.value.startsWith(`${impactPathwayId}:`))
      .forEach((metadataValue: MetadataValue) => {
        const [targetImpactPathwayId, targetImpactPathwayStepId] = metadataValue.value.split(':');
        if (isNotEmpty(targetImpactPathwayId) && isNotEmpty(targetImpactPathwayStepId)) {
          linksList.push({
            from: `task-${impactPathwayStepId}-${taskItem.id}`,
            fromTaskId: taskItem.id,
            to: `task-${targetImpactPathwayStepId}-${metadataValue.authority}`,
            toTaskId: metadataValue.authority,
            toTaskUniqueId: `${targetImpactPathwayId}:${targetImpactPathwayStepId}`,
            twoWay: true
          });
        }
      });

    if (isNotEmpty(linksList)) {
      this.store.dispatch(new AddImpactPathwayTaskLinksAction(linksList));
    }
  }

  getCollapsable(impactPathwayStepId: string, impactPathwayTaskId: string) {
    return this.store.pipe(select(
      impactPathwaySubTaskCollapsable(impactPathwayStepId, impactPathwayTaskId)
    )
    );
  }

  private getCollectionIdByProjectAndEntity(projectId: string, entityType: string): Observable<string> {
    return this.collectionService.getAuthorizedCollectionByCommunityAndEntityType(projectId, entityType).pipe(
      getFirstSucceededRemoteListPayload(),
      map((list: Collection[]) => (list && list.length > 0) ? list[0] : null),
      map((collection: Collection) => isNotEmpty(collection) ? collection.id : null),
      tap(() => this.requestService.removeByHrefSubstring('findSubmitAuthorizedByCommunityAndMetadata'))
    );
  }

  public clearImpactPathway() {
    this.store.dispatch(new ClearImpactPathwayAction());
  }
}
