import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest as combineLatestObservable,
  from as observableFrom,
  Observable,
  of as observableOf,
  throwError as observableThrowError
} from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  reduce,
  take,
  tap
} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayStep } from './models/impact-pathway-step.model';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { hasValue, isEmpty, isNotEmpty, isNull } from '../../shared/empty.util';
import { ItemDataService } from '../data/item-data.service';
import { SubmissionService } from '../../submission/submission.service';
import { environment } from '../../../environments/environment';
import { SubmissionObject } from '../submission/models/submission-object.model';
import { SubmissionJsonPatchOperationsService } from '../submission/submission-json-patch-operations.service';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { Item } from '../shared/item.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RemoteData } from '../data/remote-data';
import { VocabularyService } from '../submission/vocabularies/vocabulary.service';
import { VocabularyEntry } from '../submission/vocabularies/models/vocabulary-entry.model';
import { MetadataMap, MetadataValue } from '../shared/metadata.models';
import { Metadata } from '../shared/metadata.utils';
import {
  impactPathwayByIDSelector,
  impactPathwayObjectsSelector,
  impactPathwayStateSelector,
  isImpactPathwayLoadedSelector,
  isImpactPathwayProcessingSelector,
  isImpactPathwayRemovingSelector
} from './selectors';
import { AppState } from '../../app.reducer';
import { ImpactPathwayEntries, ImpactPathwayLink, ImpactPathwayState } from './impact-pathway.reducer';
import { SubmissionFormsConfigService } from '../config/submission-forms-config.service';
import { ConfigData } from '../config/config-data';
import { SubmissionFormModel } from '../config/models/config-submission-form.model';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import {
  AddImpactPathwaySubTaskAction,
  AddImpactPathwayTaskAction,
  AddImpactPathwayTaskLinksAction,
  GenerateImpactPathwayAction,
  GenerateImpactPathwaySubTaskAction,
  GenerateImpactPathwayTaskAction,
  MoveImpactPathwaySubTaskAction,
  PatchImpactPathwayMetadataAction,
  PatchImpactPathwayTaskMetadataAction,
  RemoveImpactPathwayAction,
  RemoveImpactPathwaySubTaskAction,
  RemoveImpactPathwayTaskAction,
  SetImpactPathwayTargetTaskAction
} from './impact-pathway.actions';
import { ErrorResponse } from '../cache/response.models';
import { getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from '../shared/operators';
import { ItemAuthorityRelationService } from '../shared/item-authority-relation.service';
import { VocabularyOptions } from '../submission/vocabularies/models/vocabulary-options.model';
import { PageInfo } from '../shared/page-info.model';
import { CollectionDataService } from '../data/collection-data.service';
import { Collection } from '../shared/collection.model';
import { RequestService } from '../data/request.service';
import { SearchFilter } from '../../shared/search/search-filter.model';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { PaginatedList } from '../data/paginated-list';
import { SearchResult } from '../../shared/search/search-result.model';
import { DSpaceObjectType } from '../shared/dspace-object-type.model';
import { SearchService } from '../shared/search/search.service';

@Injectable()
export class ImpactPathwayService {

  private _currentSelectedTask: BehaviorSubject<ImpactPathwayTask> = new BehaviorSubject<ImpactPathwayTask>(null);

  constructor(
    private collectionService: CollectionDataService,
    private vocabularyService: VocabularyService,
    private formConfigService: SubmissionFormsConfigService,
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
    private store: Store<AppState>
  ) {
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
    ))
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

  dispatchRemoveImpactPathwayAction(impactPathwayId: string) {
    this.store.dispatch(new RemoveImpactPathwayAction(impactPathwayId));
  }

  dispatchSetTargetTask(taskId: string) {
    this.store.dispatch(new SetImpactPathwayTargetTaskAction(taskId))
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
      flatMap((submission: SubmissionObject) => this.depositWorkspaceItem(submission)),
      getFirstSucceededRemoteDataPayload()
    )
  }

  generateImpactPathwayTaskItem(projectId: string, parentId: string, taskType: string, metadata: MetadataMap): Observable<Item> {
    return this.createImpactPathwayTaskWorkspaceItem(projectId, taskType).pipe(
      map((submission: SubmissionObject) => submission.item),
      tap(() => this.addPatchOperationForImpactPathwayTask(metadata)),
      delay(100),
      flatMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata')),
    )
  }

  getImpactPathwayStepTaskFormConfig(stepType: string, isObjective = false): Observable<SubmissionFormModel> {
    const formName = isObjective ? `impact_pathway_${stepType}_task_objective_form` : `impact_pathway_${stepType}_task_form`;
    return this.formConfigService.getConfigByName(formName).pipe(
      map((configData: ConfigData) => configData.payload as SubmissionFormModel)
    )
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
      map((entries: ImpactPathwayEntries) => entries[impactPathwayId]),
      take(1)
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
      filter((impactPathway: ImpactPathway) => isNotEmpty(impactPathway)),
      map((impactPathway: ImpactPathway) => impactPathway.getStep(impactPathwayStepId).tasks)
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
    )
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
        return new ImpactPathway(item.id, item.name, description, steps)
      })
    );
  }

  initImpactPathwaySteps(impacPathwayId: string, parentItem: Item): Observable<ImpactPathwayStep[]> {
    return observableFrom(Metadata.all(parentItem.metadata, environment.impactPathway.impactPathwayStepRelationMetadata)).pipe(
      concatMap((step: MetadataValue) => this.itemService.findById(step.value).pipe(
        getFirstSucceededRemoteDataPayload(),
        flatMap((stepItem: Item) => this.initImpactPathwayTasksFromParentItem(impacPathwayId, stepItem).pipe(
          map((tasks: ImpactPathwayTask[]) => this.initImpactPathwayStep(impacPathwayId, stepItem, tasks))
        )),
      )),
      reduce((acc: any, value: any) => [...acc, ...value], [])
    );
  }

  initImpactPathwayTasksFromParentItem(impacPathwayId: string, parentItem: Item, buildLinks = true): Observable<ImpactPathwayTask[]> {
    const relatedTaskMetadata = Metadata.all(parentItem.metadata, environment.impactPathway.impactPathwayTaskRelationMetadata);
    if (isEmpty(relatedTaskMetadata)) {
      return observableOf([])
    } else {
      return observableFrom(Metadata.all(parentItem.metadata, environment.impactPathway.impactPathwayTaskRelationMetadata)).pipe(
        concatMap((task: MetadataValue) => this.itemService.findById(task.value).pipe(
          getFirstSucceededRemoteDataPayload(),
          flatMap((taskItem: Item) => this.initImpactPathwayTasksFromParentItem(impacPathwayId, taskItem, false).pipe(
            tap(() => {
              if (buildLinks) {
                this.addImpactPathwayLinksFromTaskItem(taskItem, impacPathwayId, parentItem.id);
              }
            }),
            map((tasks: ImpactPathwayTask[]) => this.initImpactPathwayTask(taskItem, parentItem.id, tasks))
          )),
        )),
        reduce((acc: any, value: any) => [...acc, ...value], [])
      )
    }
  }

  moveSubTask(previousParentTaskId: string, newParentTaskId: string, taskId: string): Observable<Item> {
    return this.itemAuthorityRelationService.unlinkItemFromParent(
      previousParentTaskId,
      taskId,
      environment.impactPathway.impactPathwayParentRelationMetadata,
      environment.impactPathway.impactPathwayTaskRelationMetadata).pipe(
      flatMap(() => this.itemAuthorityRelationService.linkItemToParent(
        newParentTaskId,
        taskId,
        environment.impactPathway.impactPathwayParentRelationMetadata,
        environment.impactPathway.impactPathwayTaskRelationMetadata))
    )
  }

  removeByItemId(itemId: string): Observable<boolean> {
    return this.itemService.delete(itemId);
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
    const type = taskItem.firstMetadataValue('relationship.type');
    const description = taskItem.firstMetadataValue('dc.description');

    return new ImpactPathwayTask(taskItem.id, type, parentId, taskItem.name, description, tasks);
  }

  updateImpactPathwayTask(newTaskItem: Item, oldTask: ImpactPathwayTask): ImpactPathwayTask {
    const description = newTaskItem.firstMetadataValue('dc.description');

    return new ImpactPathwayTask(oldTask.id, oldTask.type, oldTask.parentId, newTaskItem.name, description, oldTask.tasks);
  }

  updateImpactPathway(newImpactPathwayItem: Item, oldImpactPathway: ImpactPathway): ImpactPathway {
    const description = newImpactPathwayItem.firstMetadataValue('dc.description');

    return new ImpactPathway(oldImpactPathway.id, newImpactPathwayItem.name, description, oldImpactPathway.steps);
  }

  isProcessing(): Observable<boolean> {
    return this.store.pipe(select(isImpactPathwayProcessingSelector));
  }

  isRemoving(): Observable<boolean> {
    return this.store.pipe(select(isImpactPathwayRemovingSelector));
  }

  initImpactPathwayStep(parentId: string, stepItem: Item, tasks: ImpactPathwayTask[]): ImpactPathwayStep {
    const type = stepItem.firstMetadataValue(environment.impactPathway.impactPathwayStepTypeMetadata);

    return new ImpactPathwayStep(parentId, stepItem.id, type, stepItem.name, tasks);
  }

  updateMetadataItem(itemId: string, metadataName: string, position: number, value: string): Observable<Item> {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => Metadata.first(item.metadata, metadataName)),
      tap((metadataValue: MetadataValue) => {
        if (isNotEmpty(metadataValue)) {
          this.replaceMetadataPatch(metadataName, position, value)
        } else {
          this.addMetadataPatch(metadataName, value);
        }
      }),
      delay(200),
      flatMap(() => this.executeItemPatch(itemId, 'metadata'))
    )
  }

  retrieveObjectItem(id: string): Observable<Item> {
    return this.itemService.findById(id).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }

  retrieveImpactPathwaysByProject(projectId: string, options: PageInfo): Observable<PaginatedList<Item>> {
    const filters: SearchFilter[] = [new SearchFilter('f.entityType', ['impactpathway'])]
    const sort = new SortOptions('dc.title', SortDirection.ASC);
    const pagination = Object.assign(new PaginationComponentOptions(), {
      currentPage: options.currentPage,
      pageSize: options.elementsPerPage
    });

    const searchOptions = new PaginatedSearchOptions({
      configuration: 'default',
      scope: projectId,
      filters: filters,
      pagination: pagination,
      sort: sort,
      dsoType: DSpaceObjectType.ITEM
    });

    return this.searchService.search(searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => searchResult.indexableObject);
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      map((rd: RemoteData<PaginatedList<Item>>) => rd.payload),
      filter((list: PaginatedList<Item>) => list.page.length > 0),
      take(1),
      distinctUntilChanged()
    );
  }

  replaceMetadataPatch(metadataName: string, position: number, value: string): void {
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([metadataName, position.toString()]);
    this.operationsBuilder.replace(path, value, true);
  }

  addMetadataPatch(metadataName: string, value: string): void {
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([metadataName]);
    this.operationsBuilder.add(path, value, true, true);
  }

  isImpactPathwayLoaded(): Observable<boolean> {
    return this.store.pipe(
      select(isImpactPathwayLoadedSelector),
      distinctUntilChanged()
    );
  }

  isImpactPathwayLoadedById(impacPathwayId: string): Observable<boolean> {
    const isLoaded$: Observable<boolean> = this.store.pipe(
      select(isImpactPathwayLoadedSelector)
    );

    const impactPathWay$: Observable<ImpactPathway> = this.store.pipe(
      select(impactPathwayByIDSelector(impacPathwayId))
    );

    return combineLatestObservable(isLoaded$, impactPathWay$).pipe(
      map(([isLoaded, impactPathway]) => isLoaded && isNotEmpty(impactPathway)),
      take(1)
    )
  }

  redirectToEditPage(projectId: string, impacPathwayId: string) {
    this.router.navigate(['project-overview', projectId ,'impactpathway', impacPathwayId, 'edit']);
  }

  redirectToProjectPage() {
    this.router.navigate(['/']);
  }

  private createImpactPathwaySteps(projectId: string, impactPathwayId: string): Observable<Item[]> {
    const vocabularyOptions: VocabularyOptions = new VocabularyOptions(
      environment.impactPathway.impactPathwayStepTypeAuthority
    );
    const pageInfo: PageInfo = new PageInfo({
      elementsPerPage: 100,
      currentPage: 1
    } as any);

    return this.vocabularyService.getVocabularyEntries(vocabularyOptions, pageInfo).pipe(
      getFirstSucceededRemoteListPayload(),
      flatMap((entries: VocabularyEntry[]) => observableFrom(entries)),
      concatMap((stepType: VocabularyEntry) => this.createImpactPathwayStepItem(
        projectId,
        impactPathwayId,
        stepType.value,
        stepType.display
      )),
      reduce((acc: any, value: any) => [...acc, ...value], []),
    )
  }

  private createImpactPathwayStepWorkspaceItem(projectId: string, impactPathwayId: string, impactPathwayStepType: string, impactPathwayStepName: string): Observable<SubmissionObject> {
    const submission$ = this.getCollectionIdByProjectAndEntity(projectId, environment.impactPathway.impactPathwayStepEntity).pipe(
      flatMap((collectionId) => this.submissionService.createSubmission(collectionId, environment.impactPathway.impactPathwayStepEntity)),
      flatMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      ));

    return combineLatestObservable(submission$, this.getImpactPathwayStepsFormSection()).pipe(
      tap(([submission, sectionName]) => this.addPatchOperationForImpactPathwayStep(impactPathwayId, sectionName, impactPathwayStepType, impactPathwayStepName)),
      delay(100),
      flatMap(([submission, sectionName]) => this.executeSubmissionPatch(submission.id, sectionName))
    )
  }

  private createImpactPathwayStepItem(
    projectId: string,
    impactPathwayId: string,
    impactPathwayStepType: string,
    impactPathwayStepName: string): Observable<Item> {

    return this.createImpactPathwayStepWorkspaceItem(projectId, impactPathwayId, impactPathwayStepType, impactPathwayStepName).pipe(
      flatMap((submission: SubmissionObject) => this.depositWorkspaceItem(submission)),
      getFirstSucceededRemoteDataPayload()
    )
  }

  private createImpactPathwayWorkspaceItem(projectId: string, impactPathwayName: string, impactPathwayDescription: string): Observable<SubmissionObject> {
    const submission$ = this.getCollectionIdByProjectAndEntity(projectId, environment.impactPathway.impactPathwayEntity).pipe(
      flatMap((collectionId) => this.submissionService.createSubmission(collectionId, environment.impactPathway.impactPathwayEntity)),
      flatMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      ),
      map((submission: SubmissionObject) => {
        return [submission, (submission.item as Item).id]
      }));
    return combineLatestObservable(submission$.pipe(
      flatMap(([submission, parentId]: [SubmissionObject, string]) => this.createImpactPathwaySteps(projectId,parentId).pipe(
        map((steps) => {
          return [submission, steps]
        })
      ))),
      this.getImpactPathwaysFormSection()
    ).pipe(
      tap(([objects, sectionName]: [any[], string]) => {
        this.addPatchOperationForImpactPathway(sectionName, impactPathwayName, impactPathwayDescription, objects[1])
      }),
      delay(100),
      flatMap(([objects, sectionName]: [any[], string]) => this.executeSubmissionPatch(objects[0].id, sectionName))
    )
  }

  private createImpactPathwayTaskWorkspaceItem(projectId: string, taskType: string): Observable<SubmissionObject> {
    return this.getCollectionIdByProjectAndEntity(projectId, taskType).pipe(
      flatMap((collectionId) => this.submissionService.createSubmission(collectionId, taskType).pipe(
        flatMap((submission: SubmissionObject) =>
          (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
        )
      )),
    )
  }

  private addPatchOperationForImpactPathway(sectionName: string, impactPathwayName: string, impactPathwayDescription: string, steps: Item[]) {
    const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionName);
    this.operationsBuilder.add(pathCombiner.getPath('dc.title'), impactPathwayName, true, true);
    this.operationsBuilder.add(pathCombiner.getPath('dc.description'), impactPathwayDescription, true, true);
    this.operationsBuilder.add(pathCombiner.getPath('relationship.type'), 'impactpathway', true, true);
    const stepValueList = steps.map((step: Item) => Object.assign(new VocabularyEntry(), {
      authority: step.id,
      display: step.name,
      value: step.id,
    }));
    this.operationsBuilder.add(pathCombiner.getPath(environment.impactPathway.impactPathwayStepRelationMetadata), stepValueList, true, false);
  }

  private addPatchOperationForImpactPathwayStep(
    impactPathwayId: string,
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

    this.operationsBuilder.add(
      pathCombiner.getPath('relationship.type'),
      environment.impactPathway.impactPathwayStepEntity,
      true,
      true
    );

    const parent = {
      value: impactPathwayId,
      authority: impactPathwayId,
      place: 0,
      confidence: 600
    };
    this.operationsBuilder.add(pathCombiner.getPath(environment.impactPathway.impactPathwayParentRelationMetadata), parent, true, true);

  }

  private addPatchOperationForImpactPathwayTask(metadata: MetadataMap): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    Object.keys(metadata).forEach((metadataName) => {
      this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
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
    )
  }

  private executeItemPatch(objectId: string, pathName: string): Observable<Item> {
    return this.itemJsonPatchOperationsService.jsonPatchByResourceType(
      'items',
      objectId,
      pathName).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((item: Item) => this.itemService.update(item)),
      catchError((error: ErrorResponse) => observableThrowError(new Error(error.errorMessage)))
    )
  }

  private depositWorkspaceItem(submission: SubmissionObject): Observable<RemoteData<Item>> {
    return this.submissionService.depositSubmission(submission.self).pipe(
      flatMap(() => this.itemService.findById((submission.item as Item).id))
    )
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

  private getCollectionIdByProjectAndEntity(projectId: string, entityType: string): Observable<string> {
    return this.collectionService.findAuthorizedByCommunityAndRelationshipType(projectId, entityType).pipe(
      getFirstSucceededRemoteListPayload(),
      map((list: Collection[]) => (list && list.length > 0) ? list[0] : null),
      map((collection: Collection) => isNotEmpty(collection) ? collection.id : null),
      tap(() => this.requestService.removeByHrefSubstring('findSubmitAuthorizedByCommunityAndMetadata'))
    );
  }
}
