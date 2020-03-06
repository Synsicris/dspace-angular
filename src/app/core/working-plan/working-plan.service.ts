import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { catchError, concatMap, delay, filter, flatMap, map, reduce, scan, startWith, take, tap } from 'rxjs/operators';
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
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { Item } from '../shared/item.model';
import { SearchService } from '../shared/search/search.service';
import { LinkService } from '../cache/builders/link.service';
import { MyDSpaceResponseParsingService } from '../data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../data/request.models';
import { Workpackage, WorkpackageChartDates, WorkpackageStep } from './models/workpackage-step.model';
import { from as observableFrom } from 'rxjs/internal/observable/from';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { workpackagesSelector } from './selectors';
import { WorkpackageEntries } from './working-plan.reducer';
import { MetadataMap, MetadataValue } from '../shared/metadata.models';
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

export const moment = extendMoment(Moment);

@Injectable()
export class WorkingPlanService {

  constructor(
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
    return this.createWorkspaceItem('plan_workpackages').pipe(
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
    const formName = 'working_plan_workpackage_form';
    return this.formConfigService.getConfigByName(formName).pipe(
      map((configData: ConfigData) => configData.payload as SubmissionFormModel)
    )
  }

  getWorkpackageStepFormConfig(): Observable<SubmissionFormModel> {
    const formName = 'working_plan_workpackage_step_form';
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

  getWorkpackageStepTypeAuthorityName(): string {
    return 'working_plan_workpackage_step_type';
  }

  getWorkpackageStepSearchConfigName(): string  {
    return 'workpackageSteps';
  }

  searchForAvailableWorpackages(): Observable<Item[]> {
    const searchConfiguration = 'allWorkpackages';
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
      tap((list) => console.log('searchService', list)),
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
        console.log('page', rd.payload.page);
        return observableFrom(rd.payload.page).pipe(
          concatMap((list: Observable<Item>) => list),
          tap((list) => console.log('concatMap', list)),
          scan((acc: any, value: any) => [...acc, ...value], []),
          filter((list: Item[]) => list.length === rd.payload.page.length),
          tap((list) => console.log('filter', list))
        )
      }),
      take(1)
    );
  }

  public initWorkpackageFromItem(item: Item, steps: WorkpackageStep[] = []): Workpackage {

    const dates = this.initWorkpackageDatesFromItem(item);

    return {
      id: item.id,
      name: item.name,
      responsible: '',
      progress: 0,
      progressDates: [],
      dates: dates,
      status: '',
      steps: steps,
      taskTypeListIndexes: [],
      taskTypeListValues: [],
      expanded: false
    };
  }

  public initWorkpackageStepFromItem(item: Item, parentId: string): WorkpackageStep {

    const dates = this.initWorkpackageDatesFromItem(item);

    return {
      id: item.id,
      parentId: parentId,
      name: item.name,
      responsible: '',
      progress: 0,
      progressDates: [],
      dates: dates,
      status: '',
      taskTypeListIndexes: [],
      taskTypeListValues: [],
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

  initWorkingPlan(workpackageListItem: Item[]): Observable<Workpackage[]> {
    return observableFrom(workpackageListItem).pipe(
      concatMap((workpackageItem: Item) => this.initWorkpackageStepsFromParentItem(workpackageItem.id, workpackageItem).pipe(
        map((steps: WorkpackageStep[]) => this.initWorkpackageFromItem(workpackageItem, steps))
      )),
      reduce((acc: any, value: any) => [...acc, ...value], [])
    );
  }

  initWorkpackageStepsFromParentItem(workpackageId: string, parentItem: Item): Observable<WorkpackageStep[]> {
    const relatedTaskMetadata = Metadata.all(parentItem.metadata, 'workingplan.relation.step');
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
    const startDate = item.firstMetadataValue('dc.date.start');
    if (isEmpty(startDate)) {
      start = moment().format('YYYY-MM-DD');
      startMonth = moment().format('YYYY-MM');
      startYear = moment().format('YYYY');
    } else {
      start = moment(startDate).format('YYYY-MM-DD');
      startMonth = moment(startDate).format('YYYY-MM');
      startYear = moment(startDate).format('YYYY');
    }

    const endDate = item.firstMetadataValue('dc.date.end');
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
}
