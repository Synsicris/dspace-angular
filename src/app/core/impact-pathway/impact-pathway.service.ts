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
  reduce, startWith,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { cloneDeep, findIndex } from 'lodash';

import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayStep } from './models/impact-pathway-step.model';
import { ImpactPathwayStepType } from './models/impact-pathway-step-type';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { ImpactPathwayTaskType } from './models/impact-pathway-task-type';
import { hasValue, isEmpty, isNotEmpty, isUndefined } from '../../shared/empty.util';
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
import { MetadataValue, MetadatumViewModel } from '../shared/metadata.models';
import { Metadata } from '../shared/metadata.utils';
import { impactPathwayByIDSelector, impactPathwayObjectsSelector, isImpactPathwayLoadedSelector } from './selectors';
import { AppState } from '../../app.reducer';
import { ImpactPathwayEntries } from './impact-pathway.reducer';
import { IntegrationData } from '../integration/integration-data';
import { SubmissionFormsConfigService } from '../config/submission-forms-config.service';
import { ConfigData } from '../config/config-data';
import { SubmissionFormModel } from '../config/models/config-submission-form.model';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import { SearchService } from '../shared/search/search.service';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { DSpaceObjectType } from '../shared/dspace-object-type.model';
import { toDSpaceObjectListRD } from '../shared/operators';
import { SearchSuccessResponse } from '../cache/response.models';
import { PaginatedList } from '../data/paginated-list';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortOptions } from '../cache/models/sort-options.model';

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
    private searchService: SearchService,
    private store: Store<AppState>
  ) {
  }

  private createImpactPathwaySteps(): Observable<Item[]> {
    return this.getImpactPathwayStepsCollection().pipe(
      flatMap((collectionId) => {
        const searchOptions = new IntegrationSearchOptions(
          collectionId,
          'impactpathway_step_type',
          'impactpathway.step.type');

        return this.authorityService.getEntriesByName(searchOptions).pipe(
          take(1),
          flatMap((result: any) => observableFrom(result.payload)),
          concatMap((stepType: any) => this.createImpactPathwayStepItem(collectionId, stepType.id, stepType.display)),
          reduce((acc: any, value: any) => [...acc, ...value], []),
        )
      })
    )
  }

  private createImpactPathwayStepWorkspaceItem(collectionId: string, impactPathwayStepType: string, impactPathwayStepName: string): Observable<SubmissionObject> {
    return this.submissionService.createSubmissionForCollection(collectionId).pipe(
      flatMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      ),
      (submission$) => combineLatestObservable(submission$, this.getImpactPathwayStepsFormSection()),
      tap(([submission, sectionName]) => this.addPatchOperationForImpactPathwayStep(sectionName, impactPathwayStepType, impactPathwayStepName)),
      delay(100),
      flatMap(([submission, sectionName]) => this.executeSubmissionPatch(submission.uuid, sectionName))
    )
  }

  private createImpactPathwayStepItem(collectionId: string, impactPathwayStepType: string, impactPathwayStepName: string): Observable<Item> {
    return this.createImpactPathwayStepWorkspaceItem(collectionId, impactPathwayStepType, impactPathwayStepName).pipe(
      flatMap((submission: SubmissionObject) => this.depositWorkspaceItem(submission)),
      filter((rd: RemoteData<Item>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      take(1),
      map((rd: RemoteData<Item>) => rd.payload)
    )
  }

  generateImpactPathwayItem(impactPathwayName: string): Observable<Item> {
    return this.createImpactPathwayWorkspaceItem(impactPathwayName).pipe(
      flatMap((submission: SubmissionObject) => this.depositWorkspaceItem(submission)),
      filter((rd: RemoteData<Item>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      take(1),
      map((rd: RemoteData<Item>) => rd.payload)
    )
  }

  private createImpactPathwayWorkspaceItem(impactPathwayName: string): Observable<SubmissionObject> {
    return this.getImpactPathwaysCollection().pipe(
      flatMap((collectionId) => this.submissionService.createSubmissionForCollection(collectionId)),
      flatMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      ),
      (submission$) => combineLatestObservable(submission$, this.getImpactPathwaysFormSection(), this.createImpactPathwaySteps()),
      tap(([submission, sectionName, steps]) => this.addPatchOperationForImpactPathway(sectionName, impactPathwayName, steps)),
      delay(100),
      flatMap(([submission, sectionName]) => this.executeSubmissionPatch(submission.uuid, sectionName))
    )
  }

  generateImpactPathwayTaskItem(parentStepId: string, taskType: string, title: string, description: string): Observable<Item> {
    return this.createImpactPathwayTaskWorkspaceItem(taskType).pipe(
      map((submission: SubmissionObject) => submission.item),
      tap((taskItem: Item) => this.addPatchOperationForImpactPathwayTask(taskItem, parentStepId, taskType, title, description)),
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

  getImpactPathwayStepTaskFormConfig(stepType: string): Observable<SubmissionFormModel> {
    const formName = `impact_pathway_${stepType}_task_form`;
    return this.formConfigService.getConfigByName(formName).pipe(
      map((configData: ConfigData) => configData.payload as SubmissionFormModel)
    )
  }

  private addPatchOperationForImpactPathway(sectionName: string, impactPathwayName: string, steps: Item[]) {
    const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionName);
    this.operationsBuilder.add(pathCombiner.getPath('dc.title'), impactPathwayName, true, true);
    this.operationsBuilder.add(pathCombiner.getPath('relationship.type'), 'impactpathway', true, true);
    const stepValueList = steps.map((step: Item, index: number) => Object.assign(new AuthorityEntry(), {
      id: step.id,
      display: step.name,
      value: step.id,
    }));
    this.operationsBuilder.add(pathCombiner.getPath('impactpathway.relation.step'), stepValueList, true, false);
  }

  private addPatchOperationForImpactPathwayStep(
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
  }

  private addPatchOperationForImpactPathwayTask(
    taskItem: Item,
    parentStepId: string,
    taskType: string,
    title: string,
    description: string): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    this.operationsBuilder.add(pathCombiner.getPath('dc.title'), title, true, true);
    this.operationsBuilder.add(pathCombiner.getPath('dc.description'), description, true, true);
    this.operationsBuilder.add(pathCombiner.getPath('relationship.type'), taskType, true, true);
    const parentStep = {
      value: parentStepId,
      authority: parentStepId,
      place: 0,
      confidence: 600
    };
    this.operationsBuilder.add(pathCombiner.getPath('impactpathway.relation.step'), parentStep, true, true);
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
        catchError(() => observableOf(null))
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

  getAvailableImpactPathwayTasks(): Observable<ImpactPathwayTask[]> {
    return this._impactPathwayTasks$;
  }

  searchAvailableImpactPathwayTasksByStepType(
    stepType: string,
    pagination?: PaginationComponentOptions,
    sort?: SortOptions): Observable<PaginatedList<any>> {

    return this.searchService.search(
      new PaginatedSearchOptions({
        configuration: 'impactpathwayStepType1TaskType',
        pagination: pagination,
        sort: sort
      })).pipe(
        toDSpaceObjectListRD(),
        tap((r) => console.log('getAvailableImpactPathwayTasksByStepType search', r)),
        filter((rd: RemoteData<PaginatedList<any>>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
        take(1),
        tap((r) => console.log('getAvailableImpactPathwayTasksByStepType take', r)),
        map((rd: RemoteData<PaginatedList<any>>) => rd.payload));
  }

  getImpactPathwayStepById(id: string): ImpactPathwayStep {
    const impactPathways = this._impactPathways
      .filter((impactPathway) => impactPathway.hasStep(id));

    const index = findIndex(impactPathways[0].steps, { id });
    return impactPathways[0].steps[index]
  }

  getImpactPathwayTasksByStepId(impactPathwayId: string, impactPathwayStepId: string): Observable<ImpactPathwayTask[]> {
    return this.store.pipe(
      select(impactPathwayByIDSelector(impactPathwayId)),
      map((impactPathway: ImpactPathway) => impactPathway.getStep(impactPathwayStepId).tasks)
    );
  }

  getAvailableImpactPathwayStepIds(): string[] {
    return this._stepIds;
  }

  getAvailableTaskTypeByStep(stepType: string): string[] {
    return (isUndefined(stepType)) ? this._allStepType : this._stepTaskTypeMap.get(stepType);
  }

  initImpactPathway(item: Item): Observable<ImpactPathway> {
    return this.initImpactPathwaySteps(item.uuid, item).pipe(
      map((steps: ImpactPathwayStep[]) => {
        return new ImpactPathway(item.uuid, item.name, steps)
      })
    );
  }

  initImpactPathwaySteps(impacPathwayId: string, parentItem: Item): Observable<ImpactPathwayStep[]> {
    return observableFrom(Metadata.all(parentItem.metadata, 'impactpathway.relation.step')).pipe(
      concatMap((step: MetadataValue) => this.itemService.findById(step.value).pipe(
        filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
        take(1),
        map((rd: RemoteData<Item>) => rd.payload),
        flatMap((stepItem: Item) => this.initImpactPathwayTasksFromStepItem(stepItem).pipe(
          map((tasks: ImpactPathwayTask[]) => this.initImpactPathwayStep(impacPathwayId, stepItem, tasks))
        )),
      )),
      reduce((acc: any, value: any) => [...acc, ...value], [])
    );
  }

  initImpactPathwayTasksFromStepItem(impacPathwayStepItem: Item): Observable<ImpactPathwayTask[]> {
    const relatedTaskMetadata = Metadata.all(impacPathwayStepItem.metadata, 'impactpathway.relation.task');
    if (isEmpty(relatedTaskMetadata)) {
      return observableOf([])
    } else {
      return observableFrom(Metadata.all(impacPathwayStepItem.metadata, 'impactpathway.relation.task')).pipe(
        concatMap((task: MetadataValue) => this.itemService.findById(task.value).pipe(
          filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
          take(1),
          map((rd: RemoteData<Item>) => rd.payload),
          map((item: Item) => this.initImpactPathwayTask(item, impacPathwayStepItem.id)),
        )),
        reduce((acc: any, value: any) => [...acc, ...value], [])
      )
    }
  }
  // instantiateImpactPathwayTask(index: number, innerIndex: number, parentId?: string): ImpactPathwayTask {
  //   const type: ImpactPathwayTaskType = this.generateRandomTaskType(index);
  //   const task = new ImpactPathwayTask(type, parentId);
  //   task.item.title = `${type.toString()} ${innerIndex}`;
  //
  //   return task;
  // }

  setSelectedTask(task: ImpactPathwayTask): void {
    this._currentSelectedTask.next(task);
  }

  getSelectedTask(): Observable<ImpactPathwayTask> {
    return this._currentSelectedTask;
  }

  removeTaskFromStep(task: ImpactPathwayTask): void {
    const step = this.getImpactPathwayStepById(task.parentId);
    step.removeTask(task);
  }

  initImpactPathwayTask(taskItem: Item, stepId?: string): ImpactPathwayTask {
    const type = taskItem.firstMetadataValue('relationship.type');
    const description = taskItem.firstMetadataValue('dc.description');

    return new ImpactPathwayTask(taskItem.id, type, stepId, taskItem.name, description);
  }

  initImpactPathwayStep(parentId: string, stepItem: Item, tasks: ImpactPathwayTask[]): ImpactPathwayStep {
    const type = stepItem.firstMetadataValue('impactpathway.step.type');

    return new ImpactPathwayStep(parentId, stepItem.id, type, stepItem.name, tasks);
  }

/*  cloneTask(task: ImpactPathwayTask, parentId: string): ImpactPathwayTask {
    const cloneTask: ImpactPathwayTask = Object.assign(new ImpactPathwayTask(), task, {
      item: new ImpactPathwayTaskItem(task.id, task.item.type, task.item.title)
    });
    cloneTask.parentId = parentId;

    return cloneTask
  }
*/

  addTaskToStep(stepId: string, taskItem: Item): Observable<Item> {
    return this.itemService.findById(stepId).pipe(
      filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && isNotEmpty(itemRD.payload)),
      take(1),
      map((itemRD: RemoteData<Item>) => itemRD.payload),
      tap((stepItem: Item) => {
        const stepTasks: MetadataValue[] = stepItem.findMetadataSortedByPlace('impactpathway.relation.task');
        const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
        const taskToAdd = {
          value: taskItem.uuid,
          authority: taskItem.uuid,
          place: stepTasks.length,
          confidence: 600
        };
        const path = isEmpty(stepTasks) ? pathCombiner.getPath('impactpathway.relation.task')
          : pathCombiner.getPath(['impactpathway.relation.task', stepTasks.length.toString()]);
        this.operationsBuilder.add(
          path,
          taskToAdd,
          isEmpty(stepTasks),
          true);
      }),
      delay(100),
      flatMap((stepItem: Item) => this.executeItemPatch(stepItem.uuid, 'metadata'))
    )

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
