import { Inject, Injectable } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  filter,
  first,
  flatMap,
  map,
  reduce,
  scan,
  startWith,
  take,
  tap
} from 'rxjs/operators';
import { extendMoment } from 'moment-range';
import * as Moment from 'moment';

import { SubmissionFormModel } from '../config/models/config-submission-form.model';
import { ConfigData } from '../config/config-data';
import { SubmissionFormsConfigService } from '../config/submission-forms-config.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { PaginatedList } from '../data/paginated-list';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { RemoteData } from '../data/remote-data';
import { SearchResult } from '../../shared/search/search-result.model';
import { hasValue, isEmpty, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { Item } from '../shared/item.model';
import { SearchService } from '../shared/search/search.service';
import { LinkService } from '../cache/builders/link.service';
import { MyDSpaceResponseParsingService } from '../data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../data/request.models';
import { Workpackage, WorkpackageChartDates, WorkpackageStep } from './models/workpackage-step.model';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { workpackagesSelector } from './selectors';
import { WorkpackageEntries } from './working-plan.reducer';
import { MetadataMap, MetadataValue, MetadatumViewModel } from '../shared/metadata.models';
import { SubmissionObject } from '../submission/models/submission-object.model';
import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { ErrorResponse } from '../cache/response.models';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import { ItemDataService } from '../data/item-data.service';
import { SubmissionService } from '../../submission/submission.service';
import { IntegrationSearchOptions } from '../integration/models/integration-options.model';
import { IntegrationData } from '../integration/integration-data';
import { AuthorityEntry } from '../integration/models/authority-entry.model';
import { AuthorityService } from '../integration/authority.service';
import { Metadata } from '../shared/metadata.utils';
import { ItemAuthorityRelationService } from '../shared/item-authority-relation.service';
import { WorkingPlanStateService } from './working-plan-state.service';
import { PageInfo } from '../shared/page-info.model';
import { dateToISOFormat, isNgbDateStruct } from '../../shared/date.util';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

export const moment = extendMoment(Moment);

@Injectable()
export class WorkingPlanService {

  constructor(
    @Inject(GLOBAL_CONFIG) protected config: GlobalConfig,
    private authorityService: AuthorityService,
    private formConfigService: SubmissionFormsConfigService,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private itemService: ItemDataService,
    private linkService: LinkService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private searchService: SearchService,
    private store: Store<AppState>,
    private submissionService: SubmissionService,
    private workingPlanStateService: WorkingPlanStateService
  ) {
    this.searchService.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
  }

  generateWorkpackageItem(metadata: MetadataMap): Observable<Item> {
    return this.createWorkspaceItem(this.config.workingPlan.workpackageEntityName).pipe(
      map((submission: SubmissionObject) => submission.item),
      tap(() => this.addPatchOperationForWorkpackage(metadata)),
      delay(100),
      flatMap((taskItem: Item) => this.executeItemPatch(taskItem.uuid, 'metadata')),
    )
  }

  generateWorkpackageStepItem(parentId: string, stepType: string, metadata: MetadataMap): Observable<Item> {
    return this.createWorkspaceItem(stepType).pipe(
      map((submission: SubmissionObject) => submission.item),
      tap(() => this.addPatchOperationForWorkpackage(metadata)),
      delay(100),
      flatMap((taskItem: Item) => this.executeItemPatch(taskItem.uuid, 'metadata')),
    )
  }

  getWorkpackageFormConfig(): Observable<SubmissionFormModel> {
    const formName = this.config.workingPlan.workingPlanFormName;
    return this.formConfigService.getConfigByName(formName).pipe(
      map((configData: ConfigData) => configData.payload as SubmissionFormModel)
    )
  }

  getWorkpackageStepFormConfig(): Observable<SubmissionFormModel> {
    const formName = this.config.workingPlan.workingPlanStepsFormName;
    return this.formConfigService.getConfigByName(formName).pipe(
      map((configData: ConfigData) => configData.payload as SubmissionFormModel)
    )
  }

  getWorkpackageItemById(itemId): Observable<Item> {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload()
    )
  }

  getWorkpackages(): Observable<Workpackage[]> {
    return this.store.pipe(
      select(workpackagesSelector),
      map((entries: WorkpackageEntries) => Object.keys(entries).map((key) => entries[key])),
      startWith([])
    )
  }

  getWorkpackageStatusTypes(): Observable<AuthorityEntry[]> {
    const searchOptions: IntegrationSearchOptions = new IntegrationSearchOptions(
      '',
      this.config.workingPlan.workpackageStatusTypeAuthority,
      this.config.workingPlan.workingPlanStepStatusMetadata);
    return this.authorityService.getEntriesByName(searchOptions).pipe(
      catchError(() => {
        const emptyResult = new IntegrationData(
          new PageInfo(),
          []
        );
        return observableOf(emptyResult);
      }),
      map((result: IntegrationData) => result.payload as AuthorityEntry[]),
      take(1)
    )
  }

  getWorkpackageStepTypeAuthorityName(): string {
    return this.config.workingPlan.workpackageStepTypeAuthority;
  }

  getWorkpackageStepSearchConfigName(): string  {
    return this.config.workingPlan.workpackageStepsSearchConfigName;
  }

  searchForAvailableWorpackages(): Observable<Item[]> {
    const searchConfiguration = this.config.workingPlan.workpackagesSearchConfigName;
    const paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();
    paginationOptions.id = 'search-available-workpackages';
    paginationOptions.pageSize = 1000;
    const sortOptions = new SortOptions('dc.title', SortDirection.ASC);

    const searchOptions = new PaginatedSearchOptions({
      configuration: searchConfiguration,
      pagination: paginationOptions,
      sort: sortOptions
    });

    return this.searchService.search(searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => {
            if (searchResult.indexableObject.type === 'item') {
              return observableOf(searchResult.indexableObject);
            } else {
              this.linkService.resolveLink(searchResult.indexableObject, followLink('item'));
              return searchResult.indexableObject.item.pipe(
                getFirstSucceededRemoteDataPayload()
              )
            }
          });
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      flatMap((rd: RemoteData<PaginatedList<Observable<Item>>>) => {
        if (rd.payload.page.length === 0) {
          return observableOf([]);
        } else {
          return observableFrom(rd.payload.page).pipe(
            concatMap((list: Observable<Item>) => list),
            scan((acc: any, value: any) => [...acc, ...value], []),
            filter((list: Item[]) => list.length === rd.payload.page.length),
          )
        }
      }),
      first((result) => isNotUndefined(result))
    );
  }

  public initWorkpackageFromItem(item: Item, steps: WorkpackageStep[] = []): Workpackage {

    const dates = this.initWorkpackageDatesFromItem(item);
    const responsible = item.firstMetadataValue(this.config.workingPlan.workingPlanStepResponsibleMetadata);
    const status = item.firstMetadataValue(this.config.workingPlan.workingPlanStepStatusMetadata);

    return {
      id: item.id,
      name: item.name,
      responsible: responsible,
      progress: 0,
      progressDates: [],
      dates: dates,
      status: status,
      steps: steps,
      expanded: (steps && steps.length > 0)
    };
  }

  public initWorkpackageStepFromItem(item: Item, parentId: string): WorkpackageStep {

    const dates = this.initWorkpackageDatesFromItem(item);
    const responsible = item.firstMetadataValue(this.config.workingPlan.workingPlanStepResponsibleMetadata);
    const status = item.firstMetadataValue(this.config.workingPlan.workingPlanStepStatusMetadata);

    return {
      id: item.id,
      parentId: parentId,
      name: item.name,
      responsible: responsible,
      progress: 0,
      progressDates: [],
      dates: dates,
      status: status,
      expanded: false
    };
  }

  private addPatchOperationForWorkpackage(metadata: MetadataMap): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    Object.keys(metadata).forEach((metadataName) => {
      this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
    });
  }

  private createWorkspaceItem(taskType: string): Observable<SubmissionObject> {
    return this.getCollectionByEntity(taskType).pipe(
      flatMap((collectionId) => this.submissionService.createSubmissionForCollection(collectionId)),
      flatMap((submission: SubmissionObject) =>
        (isNotEmpty(submission)) ? observableOf(submission) : observableThrowError(null)
      )
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

  private getCollectionByEntity(entityType: string): Observable<string> {
    const searchOptions: IntegrationSearchOptions = new IntegrationSearchOptions(
      '',
      this.config.impactPathway.entityToCollectionMapAuthority,
      this.config.impactPathway.entityToCollectionMapAuthorityMetadata,
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

  initWorkingPlan(workpackageListItem: Item[]): Observable<Workpackage[]> {
    return observableFrom(workpackageListItem).pipe(
      concatMap((workpackageItem: Item) => this.initWorkpackageStepsFromParentItem(workpackageItem.id, workpackageItem).pipe(
        map((steps: WorkpackageStep[]) => this.initWorkpackageFromItem(workpackageItem, steps))
      )),
      reduce((acc: any, value: any) => [...acc, ...value], [])
    );
  }

  initWorkpackageStepsFromParentItem(workpackageId: string, parentItem: Item): Observable<WorkpackageStep[]> {
    const relatedTaskMetadata = Metadata.all(parentItem.metadata, this.config.workingPlan.workingPlanStepRelationMetadata);
    if (isEmpty(relatedTaskMetadata)) {
      return observableOf([])
    } else {
      return observableFrom(relatedTaskMetadata).pipe(
        concatMap((task: MetadataValue) => this.itemService.findById(task.value).pipe(
          getFirstSucceededRemoteDataPayload(),
          map((stepItem: Item) => this.initWorkpackageStepFromItem(stepItem, workpackageId)),
        )),
        reduce((acc: any, value: any) => [...acc, ...value], [])
      )
    }
  }

  initWorkpackageDatesFromItem(item: Item): WorkpackageChartDates {
    let start;
    let startMonth;
    let startYear;
    let end;
    let endMonth;
    let endyear;
    const startDate = item.firstMetadataValue(this.config.workingPlan.workingPlanStepDateStartMetadata);
    if (isEmpty(startDate)) {
      start = moment().format('YYYY-MM-DD');
      startMonth = moment().format('YYYY-MM');
      startYear = moment().format('YYYY');
    } else {
      start = moment(startDate).format('YYYY-MM-DD');
      startMonth = moment(startDate).format('YYYY-MM');
      startYear = moment(startDate).format('YYYY');
    }

    const endDate = item.firstMetadataValue(this.config.workingPlan.workingPlanStepDateEndMetadata);
    if (isEmpty(startDate)) {
      end = moment().add(7, 'days').format('YYYY-MM-DD');
      endMonth = moment().add(7, 'days').format('YYYY-MM');
      endyear = moment().add(7, 'days').format('YYYY');
    } else {
      end = moment(endDate).add(7, 'days').format('YYYY-MM-DD');
      endMonth = moment(endDate).add(7, 'days').format('YYYY-MM');
      endyear = moment(endDate).add(7, 'days').format('YYYY');
    }

    const dates = {
      start: {
        full: start,
          month: startMonth,
          year: startYear
      },
      end: {
        full: end,
          month: endMonth,
          year: endyear
      },
    };

    return dates;
  }

  isProcessingWorkpackageRemove(workpackageId: string): Observable<boolean> {
    return this.workingPlanStateService.getWorkpackageToRemoveId().pipe(
      map((workpackageToRemoveId) => workpackageId === workpackageToRemoveId)
    )
  }

  createAddMetadataPatchOp(metadataName: string, value: any): void {
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    this.operationsBuilder.add(pathCombiner.getPath(metadataName), value, true, true);
  }

  createReplaceMetadataPatchOp(metadataName: string, position: number, value: any): void {
    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    const path = pathCombiner.getPath([metadataName, position.toString()]);
    this.operationsBuilder.replace(path, value, true);
  }

  removeWorkpackageItem(itemId: string): Observable<boolean> {
    return this.itemService.delete(itemId);
  }

  setDefaultForStatusMetadata(metadata: MetadataMap): MetadataMap {
    let result: MetadataMap = metadata;
    if (!metadata.hasOwnProperty(this.config.workingPlan.workingPlanStepStatusMetadata)
      || isEmpty(metadata[this.config.workingPlan.workingPlanStepStatusMetadata])) {
      result = Object.assign({}, metadata, {
        [this.config.workingPlan.workingPlanStepStatusMetadata]: [{
          authority: 'not_done',
          confidence: 600,
          language: null,
          place: 0,
          value: 'not_done'
        }]
      })
    }

    return result
  }

  updateMetadataItem(
    itemId: string,
    metadatumViewList: MetadatumViewModel[]
  ): Observable<Item> {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((item: Item) => {
        metadatumViewList.forEach((metadatumView) => {
          const value = {
            language: metadatumView.language,
            value: metadatumView.value,
            place: 0,
            authority: metadatumView.authority,
            confidence: metadatumView.confidence
          };
          const storedValue = item.firstMetadataValue(metadatumView.key);
          if (isEmpty(storedValue)) {
            this.createAddMetadataPatchOp(metadatumView.key, value);
          } else {
            this.createReplaceMetadataPatchOp(metadatumView.key, metadatumView.place, value)
          }
        });
      }),
      delay(100),
      flatMap(() => this.executeItemPatch(itemId, 'metadata'))
    )
  }

  updateWorkpackageMetadata(
    workpackageId: string,
    workpackage: Workpackage,
    metadataList: string[],
    valueList: any[],
    hasAuthority = false
  ) {
    const metadatumViewList = [];
    metadataList.forEach((metadata, index) => {
      const value = valueList[index];
      metadatumViewList.push(
        {
          key: metadata,
          language: '',
          value: (isNgbDateStruct(value)) ? dateToISOFormat(value) : value,
          place: 0,
          authority: hasAuthority ? value : '',
          confidence: hasAuthority ? 600 : -1
        } as MetadatumViewModel
      )
    });

    this.workingPlanStateService.dispatchUpdateWorkpackageAction(workpackageId, workpackage, metadatumViewList);
  }

  updateWorkpackageStepMetadata(
    workpackageId: string,
    workpackageStepId: string,
    workpackageStep: WorkpackageStep,
    metadataList: string[],
    valueList: any[],
    hasAuthority = false
  ) {
    const metadatumViewList = [];
    metadataList.forEach((metadata, index) => {
      const value = valueList[index];
      metadatumViewList.push(
        {
          key: metadata,
          language: '',
          value: (isNgbDateStruct(value)) ? dateToISOFormat(value) : value,
          place: 0,
          authority: hasAuthority ? value : '',
          confidence: hasAuthority ? 600 : -1
        } as MetadatumViewModel
      )
    });

    this.workingPlanStateService.dispatchUpdateWorkpackageStepAction(
      workpackageId,
      workpackageStepId,
      workpackageStep,
      metadatumViewList
    );
  }
}