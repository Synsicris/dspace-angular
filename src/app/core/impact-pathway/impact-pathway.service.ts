import { Inject, Injectable } from '@angular/core';
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
import { ImpactPathwayStepType } from './models/impact-pathway-step-type';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { ImpactPathwayTaskType } from './models/impact-pathway-task-type';
import { isEmpty, isNotEmpty, isUndefined } from '../../shared/empty.util';
import { ItemDataService } from '../data/item-data.service';
import { SubmissionService } from '../../submission/submission.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { SubmissionObject } from '../submission/models/submission-object.model';
import { SubmissionJsonPatchOperationsService } from '../submission/submission-json-patch-operations.service';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { Item } from '../shared/item.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RemoteData } from '../data/remote-data';
import { AuthorityService } from '../integration/authority.service';
import { IntegrationSearchOptions } from '../integration/models/integration-options.model';
import { AuthorityEntry } from '../integration/models/authority-entry.model';
import { MetadataMap, MetadataValue } from '../shared/metadata.models';
import { Metadata } from '../shared/metadata.utils';
import { impactPathwayByIDSelector, impactPathwayObjectsSelector, isImpactPathwayLoadedSelector } from './selectors';
import { AppState } from '../../app.reducer';
import { ImpactPathwayEntries } from './impact-pathway.reducer';
import { IntegrationData } from '../integration/integration-data';
import { SubmissionFormsConfigService } from '../config/submission-forms-config.service';
import { ConfigData } from '../config/config-data';
import { SubmissionFormModel } from '../config/models/config-submission-form.model';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import { RemoveImpactPathwaySubTaskAction, RemoveImpactPathwayTaskAction } from './impact-pathway.actions';
import { ErrorResponse } from '../cache/response.models';

@Injectable()
export class ImpactPathwayService {

  private _stepIds: string[] = ['sidebar-object-list'];
  private _impactPathways: ImpactPathway[] = [];
  private _impactPathwayTasks: ImpactPathwayTask[] = [];
  private _impactPathwayTasks$: BehaviorSubject<ImpactPathwayTask[]> = new BehaviorSubject<ImpactPathwayTask[]>(null);
  private _currentSelectedTask: BehaviorSubject<ImpactPathwayTask> = new BehaviorSubject<ImpactPathwayTask>(null);
  private _stepTaskTypeMap: Map<string, ImpactPathwayTaskType[]> = new Map(
    [
      [ImpactPathwayStepType.Type1, [ImpactPathwayTaskType.Type1]],
      [ImpactPathwayStepType.Type2, [ImpactPathwayTaskType.Type2, ImpactPathwayTaskType.Type3]],
      [ImpactPathwayStepType.Type3, [ImpactPathwayTaskType.Type2, ImpactPathwayTaskType.Type3]],
      [ImpactPathwayStepType.Type4, [ImpactPathwayTaskType.Type4, ImpactPathwayTaskType.Type5]],
      [ImpactPathwayStepType.Type5, [ImpactPathwayTaskType.Type4, ImpactPathwayTaskType.Type5]],
      [ImpactPathwayStepType.Type6, [
        ImpactPathwayTaskType.Type1,
        ImpactPathwayTaskType.Type2,
        ImpactPathwayTaskType.Type3,
        ImpactPathwayTaskType.Type4,
        ImpactPathwayTaskType.Type5,
        ImpactPathwayTaskType.Type6]
      ],
    ]
  );
  private _allStepType: ImpactPathwayTaskType[] = [
    ImpactPathwayTaskType.Type1,
    ImpactPathwayTaskType.Type2,
    ImpactPathwayTaskType.Type3,
    ImpactPathwayTaskType.Type4,
    ImpactPathwayTaskType.Type5,
    ImpactPathwayTaskType.Type6
  ];

  constructor(
    @Inject(GLOBAL_CONFIG) protected config: GlobalConfig,
    private authorityService: AuthorityService,
    private formConfigService: SubmissionFormsConfigService,
    private itemService: ItemDataService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private submissionJsonPatchOperationsService: SubmissionJsonPatchOperationsService,
    private rdbService: RemoteDataBuildService,
    private router: Router,
    private submissionService: SubmissionService,
    private store: Store<AppState>
  ) {
  }

  private createImpactPathwaySteps(impactPathwayId: string): Observable<Item[]> {
    return this.getImpactPathwayStepsCollection().pipe(
      flatMap((collectionId) => {
        const searchOptions = new IntegrationSearchOptions(
          collectionId,
          'impactpathway_step_type',
          'impactpathway.step.type');

        return this.authorityService.getEntriesByName(searchOptions).pipe(
          take(1),
          flatMap((result: any) => observableFrom(result.payload)),
          concatMap((stepType: any) => this.createImpactPathwayStepItem(impactPathwayId, collectionId, stepType.id, stepType.display)),
          reduce((acc: any, value: any) => [...acc, ...value], []),
        )
      })
    )
  }

  private createImpactPathwayStepWorkspaceItem(impactPathwayId: string, collectionId: string, impactPathwayStepType: string, impactPathwayStepName: string): Observable<SubmissionObject> {
    const submission$ = this.submissionService.createSubmissionForCollection(collectionId).pipe(
      flatMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      ));

    return combineLatestObservable(submission$, this.getImpactPathwayStepsFormSection()).pipe(
      tap(([submission, sectionName]) => this.addPatchOperationForImpactPathwayStep(impactPathwayId, sectionName, impactPathwayStepType, impactPathwayStepName)),
      delay(100),
      flatMap(([submission, sectionName]) => this.executeSubmissionPatch(submission.uuid, sectionName))
    )
  }

  private createImpactPathwayStepItem(
    impactPathwayId: string,
    collectionId: string,
    impactPathwayStepType: string,
    impactPathwayStepName: string): Observable<Item> {

    return this.createImpactPathwayStepWorkspaceItem(impactPathwayId, collectionId, impactPathwayStepType, impactPathwayStepName).pipe(
      flatMap((submission: SubmissionObject) => this.depositWorkspaceItem(submission)),
      filter((rd: RemoteData<Item>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      take(1),
      map((rd: RemoteData<Item>) => rd.payload)
    )
  }

  generateImpactPathwayItem(impactPathwayName: string, impactPathwayDescription: string): Observable<Item> {
    return this.createImpactPathwayWorkspaceItem(impactPathwayName, impactPathwayDescription).pipe(
      flatMap((submission: SubmissionObject) => this.depositWorkspaceItem(submission)),
      filter((rd: RemoteData<Item>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      take(1),
      map((rd: RemoteData<Item>) => rd.payload)
    )
  }

  private createImpactPathwayWorkspaceItem(impactPathwayName: string, impactPathwayDescription: string): Observable<SubmissionObject> {
    const submission$ = this.getImpactPathwaysCollection().pipe(
      flatMap((collectionId) => this.submissionService.createSubmissionForCollection(collectionId)),
      flatMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      ),
      map((submission: SubmissionObject) => {
        return [submission, (submission.item as Item).id]
      }));
    return combineLatestObservable(submission$.pipe(
      flatMap(([submission, parentId]: [SubmissionObject, string]) => this.createImpactPathwaySteps(parentId).pipe(
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
      flatMap(([objects, sectionName]: [any[], string]) => this.executeSubmissionPatch(objects[0].uuid, sectionName))
    )
  }

  generateImpactPathwayTaskItem(parentId: string, taskType: string, metadata: MetadataMap): Observable<Item> {
    return this.createImpactPathwayTaskWorkspaceItem(taskType).pipe(
      map((submission: SubmissionObject) => submission.item),
      tap((taskItem: Item) => this.addPatchOperationForImpactPathwayTask(taskItem, parentId, metadata)),
      delay(100),
      flatMap((taskItem) => this.executeItemPatch(taskItem.uuid, 'metadata')),
    )
  }

  private createImpactPathwayTaskWorkspaceItem(taskType: string): Observable<SubmissionObject> {
    return this.getCollectionByEntity(taskType).pipe(
      flatMap((collectionId) => this.submissionService.createSubmissionForCollection(collectionId)),
      flatMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      )
    )
  }

  getImpactPathwayStepTaskFormConfig(stepType: string, isObjective = false): Observable<SubmissionFormModel> {
    const formName = isObjective ? `impact_pathway_${stepType}_task_objective_form` : `impact_pathway_${stepType}_task_form`;
    return this.formConfigService.getConfigByName(formName).pipe(
      map((configData: ConfigData) => configData.payload as SubmissionFormModel)
    )
  }

  private addPatchOperationForImpactPathway(sectionName: string, impactPathwayName: string, impactPathwayDescription: string, steps: Item[]) {
    const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionName);
    this.operationsBuilder.add(pathCombiner.getPath('dc.title'), impactPathwayName, true, true);
    this.operationsBuilder.add(pathCombiner.getPath('dc.description'), impactPathwayDescription, true, true);
    this.operationsBuilder.add(pathCombiner.getPath('relationship.type'), 'impactpathway', true, true);
    const stepValueList = steps.map((step: Item, index: number) => Object.assign(new AuthorityEntry(), {
      id: step.id,
      display: step.name,
      value: step.id,
    }));
    this.operationsBuilder.add(pathCombiner.getPath('impactpathway.relation.step'), stepValueList, true, false);
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
      pathCombiner.getPath('impactpathway.step.type'),
      impactPathwayStepType,
      true,
      true
    );

    this.operationsBuilder.add(
      pathCombiner.getPath('relationship.type'),
      'impactpathwaystep',
      true,
      true
    );

    const parent = {
      value: impactPathwayId,
      authority: impactPathwayId,
      place: 0,
      confidence: 600
    };
    this.operationsBuilder.add(pathCombiner.getPath('impactpathway.relation.parent'), parent, true, true);

  }

  private addPatchOperationForImpactPathwayTask(
    taskItem: Item,
    parentStepId: string,
    metadata: MetadataMap): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    Object.keys(metadata).forEach((metadataName) => {
      this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
    });
    // this.operationsBuilder.add(pathCombiner.getPath('dc.title'), title, true, true);
    // this.operationsBuilder.add(pathCombiner.getPath('dc.description'), description, true, true);
    // this.operationsBuilder.add(pathCombiner.getPath('relationship.type'), taskType, true, true);
    // const parentStep = {
    //   value: parentStepId,
    //   authority: parentStepId,
    //   place: 0,
    //   confidence: 600
    // };
    // this.operationsBuilder.add(pathCombiner.getPath('impactpathway.relation.parent'), parentStep, true, true);
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
      filter((rd: RemoteData<Item>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      take(1),
      map((rd: RemoteData<Item>) => rd.payload),
      tap((item: Item) => this.itemService.update(item)),
      catchError((error: ErrorResponse) => observableThrowError(new Error(error.errorMessage)))
    )
  }

  private depositWorkspaceItem(submission: SubmissionObject): Observable<RemoteData<Item>> {
    return this.submissionService.depositSubmission(submission.self).pipe(
      flatMap((submissions: SubmissionObject[]) => this.itemService.findById((submission.item as Item).id))
    )
  }

  private getImpactPathwaysCollection(): Observable<string> {
    return this.getCollectionByEntity('impactpathway');
  }

  private getImpactPathwaysFormSection(): Observable<string> {
    return observableOf(this.config.impactPathway.impactPathwaysFormSection);
  }

  private getImpactPathwayStepsFormSection(): Observable<string> {
    return observableOf(this.config.impactPathway.impactPathwayStepsFormSection);
  }

  private getImpactPathwayStepsCollection(): Observable<string> {
    return this.getCollectionByEntity('impactpathwaystep');
  }

  private getCollectionByEntity(entityType: string): Observable<string> {
    const searchOptions: IntegrationSearchOptions = new IntegrationSearchOptions(
      '',
      'impactpathway_entity_to_collection_map',
      'impactpathway.entity.map',
      entityType,
      1,
      1);
    return this.authorityService.getEntryByValue(searchOptions).pipe(
      map((result: IntegrationData) => {
        if (result.pageInfo.totalElements !== 1) {
          throw new Error(`No collection found for ${entityType}`);
        }

        return (result.payload[0] as AuthorityEntry).display;
      })
    )
  }

  getImpactPathwayStepTitle(stepId: string): Observable<string> {
    return this.itemService.findById(stepId).pipe(
      filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
      take(1),
      map((itemRD: RemoteData<Item>) => itemRD.payload.name)
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
      map((impactPathway: ImpactPathway) => impactPathway.getStep(impactPathwayStepId)),
      take(1)
    );
  }

  getImpactPathwayTasksByStepId(impactPathwayId: string, impactPathwayStepId: string): Observable<ImpactPathwayTask[]> {
    return this.store.pipe(
      select(impactPathwayByIDSelector(impactPathwayId)),
      map((impactPathway: ImpactPathway) => impactPathway.getStep(impactPathwayStepId).tasks)
    );
  }

  getImpactPathwaySubTasksByParentId(
    impactPathwayId: string,
    impactPathwayStepId: string,
    impactPathwayTaskId): Observable<ImpactPathwayTask[]> {
    return this.store.pipe(
      select(impactPathwayByIDSelector(impactPathwayId)),
      map((impactPathway: ImpactPathway) => {
        return impactPathway.getStep(impactPathwayStepId).getTask(impactPathwayTaskId).tasks;
      })
    );
  }

  getAvailableImpactPathwayStepIds(): string[] {
    return this._stepIds;
  }

  getAvailableTaskTypeByStep(stepType: string): string[] {
    return (isUndefined(stepType)) ? this._allStepType : this._stepTaskTypeMap.get(stepType);
  }

  initImpactPathway(item: Item): Observable<ImpactPathway> {
    const description = item.firstMetadataValue('dc.description');
    return this.initImpactPathwaySteps(item.uuid, item).pipe(
      map((steps: ImpactPathwayStep[]) => {
        return new ImpactPathway(item.uuid, item.name, description, steps)
      })
    );
  }

  initImpactPathwaySteps(impacPathwayId: string, parentItem: Item): Observable<ImpactPathwayStep[]> {
    return observableFrom(Metadata.all(parentItem.metadata, 'impactpathway.relation.step')).pipe(
      concatMap((step: MetadataValue) => this.itemService.findById(step.value).pipe(
        filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
        take(1),
        map((rd: RemoteData<Item>) => rd.payload),
        flatMap((stepItem: Item) => this.initImpactPathwayTasksFromParentItem(stepItem).pipe(
          map((tasks: ImpactPathwayTask[]) => this.initImpactPathwayStep(impacPathwayId, stepItem, tasks))
        )),
      )),
      reduce((acc: any, value: any) => [...acc, ...value], [])
    );
  }

  initImpactPathwayTasksFromParentItem(parentItem: Item): Observable<ImpactPathwayTask[]> {
    const relatedTaskMetadata = Metadata.all(parentItem.metadata, 'impactpathway.relation.task');
    if (isEmpty(relatedTaskMetadata)) {
      return observableOf([])
    } else {
      return observableFrom(Metadata.all(parentItem.metadata, 'impactpathway.relation.task')).pipe(
        concatMap((task: MetadataValue) => this.itemService.findById(task.value).pipe(
          filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
          take(1),
          map((rd: RemoteData<Item>) => rd.payload),
          flatMap((taskItem: Item) => this.initImpactPathwayTasksFromParentItem(taskItem).pipe(
            map((tasks: ImpactPathwayTask[]) => this.initImpactPathwayTask(taskItem, parentItem.id, tasks))
          )),
        )),
        reduce((acc: any, value: any) => [...acc, ...value], [])
      )
    }
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

  initImpactPathwayStep(parentId: string, stepItem: Item, tasks: ImpactPathwayTask[]): ImpactPathwayStep {
    const type = stepItem.firstMetadataValue('impactpathway.step.type');

    return new ImpactPathwayStep(parentId, stepItem.id, type, stepItem.name, tasks);
  }

  linkTaskToParent(parentId: string, taskId: string): Observable<Item> {
    return this.itemService.findById(parentId).pipe(
      filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
      take(1),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      tap((stepItem: Item) => this.addRelationPatch(stepItem, taskId, 'impactpathway.relation.task')),
      delay(100),
      flatMap((stepItem: Item) => this.executeItemPatch(stepItem.id, 'metadata').pipe(
        flatMap(() => this.itemService.findById(taskId)),
        filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
        map((itemRD: RemoteData<Item>) => itemRD.payload),
        take(1),
        tap((taskItem: Item) => this.addRelationPatch(taskItem, parentId, 'impactpathway.relation.parent')),
        delay(100),
        flatMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
      ))
    );
  }

  unlinkTaskFromParent(parentId: string, taskId: string, taskPosition: number): Observable<Item> {
    return this.itemService.findById(parentId).pipe(
      filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
      take(1),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      tap((stepItem: Item) => this.removeRelationPatch(stepItem, taskPosition, 'impactpathway.relation.task')),
      delay(100),
      flatMap((stepItem: Item) => this.executeItemPatch(stepItem.id, 'metadata').pipe(
        flatMap(() => this.itemService.findById(taskId)),
        filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
        map((itemRD: RemoteData<Item>) => itemRD.payload),
        take(1),
        tap((taskItem: Item) => this.removeRelationPatch(taskItem, 0, 'impactpathway.relation.parent')),
        delay(100),
        flatMap((taskItem: Item) => this.executeItemPatch(taskItem.id, 'metadata'))
      ))
    )
  }

  updateMetadataItem(itemId: string, metadataName: string, position: number, value: string): Observable<Item> {
    return this.itemService.findById(itemId).pipe(
      filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
      take(1),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      tap(() => this.replaceMetadataPatch(metadataName, position, value)),
      delay(100),
      flatMap(() => this.executeItemPatch(itemId, 'metadata'))
    )
  }

  addRelationPatch(targetItem: Item, relatedItemId: string, relation: string): void {
    const stepTasks: MetadataValue[] = targetItem.findMetadataSortedByPlace(relation);
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const taskToAdd = {
      value: relatedItemId,
      authority: relatedItemId,
      place: stepTasks.length,
      confidence: 600
    };
    const path = isEmpty(stepTasks) ? pathCombiner.getPath(relation)
      : pathCombiner.getPath([relation, stepTasks.length.toString()]);
    this.operationsBuilder.add(
      path,
      taskToAdd,
      isEmpty(stepTasks),
      true);
  }

  removeRelationPatch(targetItem: Item, position: number, relation: string): void {
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([relation, position.toString()]);
    this.operationsBuilder.remove(path)
  }

  replaceMetadataPatch(metadataName: string, position: number, value: string): void {
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([metadataName, position.toString()]);
    this.operationsBuilder.replace(path, value, true);
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

  redirectToEditPage(impacPathwayId: string) {
    this.router.navigate(['/impactpathway', impacPathwayId, 'edit']);
  }
}
