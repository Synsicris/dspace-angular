import { Injectable } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf } from 'rxjs';
import { catchError, concatMap, delay, filter, first, map, mergeMap, reduce, scan, take, tap } from 'rxjs/operators';
import { extendMoment } from 'moment-range';
import * as Moment from 'moment';

import { SubmissionFormModel } from '../config/models/config-submission-form.model';
import { SubmissionFormsConfigService } from '../config/submission-forms-config.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { buildPaginatedList, PaginatedList } from '../data/paginated-list.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { RemoteData } from '../data/remote-data';
import { SearchResult } from '../../shared/search/search-result.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { Item } from '../shared/item.model';
import { SearchService } from '../shared/search/search.service';
import { LinkService } from '../cache/builders/link.service';
import { MyDSpaceResponseParsingService } from '../data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../data/request.models';
import {
  Workpackage,
  WorkpackageChartDates,
  WorkpackageSearchItem,
  WorkpackageStep
} from './models/workpackage-step.model';
import { WorkpackageEntries } from './working-plan.reducer';
import { MetadataMap, MetadataValue, MetadatumViewModel } from '../shared/metadata.models';
import { SubmissionObject } from '../submission/models/submission-object.model';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { getFinishedRemoteData, getFirstSucceededRemoteDataPayload, getRemoteDataPayload } from '../shared/operators';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import { ItemDataService } from '../data/item-data.service';
import { VocabularyOptions } from '../submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntry } from '../submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyService } from '../submission/vocabularies/vocabulary.service';
import { Metadata } from '../shared/metadata.utils';
import { ItemAuthorityRelationService } from '../shared/item-authority-relation.service';
import { WorkingPlanStateService } from './working-plan-state.service';
import { PageInfo } from '../shared/page-info.model';
import { dateToISOFormat, isNgbDateStruct } from '../../shared/date.util';
import { environment } from '../../../environments/environment';
import { CollectionDataService } from '../data/collection-data.service';
import { RequestService } from '../data/request.service';
import { ProjectItemService } from '../project/project-item.service';

export const moment = extendMoment(Moment);

@Injectable()
export class WorkingPlanService {

  constructor(
    private collectionService: CollectionDataService,
    private vocabularyService: VocabularyService,
    private formConfigService: SubmissionFormsConfigService,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private itemService: ItemDataService,
    private projectItemService: ProjectItemService,
    private linkService: LinkService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private requestService: RequestService,
    private searchService: SearchService,
    private workingPlanStateService: WorkingPlanStateService
  ) {
    this.searchService.setServiceOptions(MyDSpaceResponseParsingService, MyDSpaceRequest);
  }

  generateWorkpackageItem(projectId: string, type: string, metadata: MetadataMap, place: string): Observable<Item> {
    return this.projectItemService.createWorkspaceItem(projectId, type).pipe(
      mergeMap((submission: SubmissionObject) => observableOf(submission.item).pipe(
        tap(() => this.addPatchOperationForWorkpackage(metadata, place)),
        delay(100),
        mergeMap((item: Item) => this.projectItemService.executeItemPatch(item.id, 'metadata').pipe(
          mergeMap(() => this.projectItemService.depositWorkspaceItem(submission).pipe(
            getFirstSucceededRemoteDataPayload()
          ))
        ))
      ))
    );
  }

  generateWorkpackageStepItem(projectId: string, parentId: string, stepType: string, metadata: MetadataMap): Observable<Item> {
    return this.projectItemService.createWorkspaceItem(projectId, stepType).pipe(
      mergeMap((submission: SubmissionObject) => observableOf(submission.item).pipe(
        tap(() => this.addPatchOperationForWorkpackage(metadata)),
        delay(100),
        mergeMap((item: Item) => this.projectItemService.executeItemPatch(item.id, 'metadata').pipe(
          mergeMap(() => this.projectItemService.depositWorkspaceItem(submission).pipe(
            getFirstSucceededRemoteDataPayload()
          ))
        ))
      ))
    );
  }

  getWorkpackageFormConfig(): Observable<SubmissionFormModel> {
    const formName = environment.workingPlan.workingPlanFormName;
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getWorkpackageFormHeader(): string {
    return environment.workingPlan.workingPlanFormName;
  }

  getWorkpackageStepFormConfig(): Observable<SubmissionFormModel> {
    const formName = environment.workingPlan.workingPlanStepsFormName;
    return this.formConfigService.findByName(formName).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getWorkpackageStepFormHeader(): string {
    return environment.workingPlan.workingPlanStepsFormName;
  }

  getWorkpackageItemById(itemId): Observable<Item> {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload()
    );
  }

  getWorkpackageStatusTypes(): Observable<VocabularyEntry[]> {
    const searchOptions: VocabularyOptions = new VocabularyOptions(
      environment.workingPlan.workpackageStatusTypeAuthority
    );
    const pageInfo: PageInfo = new PageInfo({
      elementsPerPage: 10,
      currentPage: 1
    });
    return this.vocabularyService.getVocabularyEntries(searchOptions, pageInfo).pipe(
      getFinishedRemoteData(),
      getRemoteDataPayload(),
      catchError(() => {
        const emptyResult = buildPaginatedList(new PageInfo(), []);
        return observableOf(emptyResult);
      }),
      map((result: PaginatedList<VocabularyEntry>) => result.page),
      take(1)
    );
  }

  getWorkpackageStepTypeAuthorityName(): string {
    return environment.workingPlan.workpackageStepTypeAuthority;
  }

  getWorkpackageStepSearchConfigName(): string {
    return environment.workingPlan.workpackageStepsSearchConfigName;
  }

  searchForLinkedWorkingPlanObjects(projectId: string): Observable<WorkpackageSearchItem[]> {
    const searchConfiguration = environment.workingPlan.allLinkedWorkingPlanObjSearchConfigName;
    const paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();
    paginationOptions.id = 'slw';
    paginationOptions.pageSize = 1000;
    const sortOptions = new SortOptions(environment.workingPlan.workingPlanPlaceMetadata, SortDirection.ASC);

    const searchOptions = new PaginatedSearchOptions({
      configuration: searchConfiguration,
      pagination: paginationOptions,
      sort: sortOptions,
      scope: projectId
    });

    return this.searchService.search(searchOptions).pipe(
      filter((rd: RemoteData<PaginatedList<SearchResult<any>>>) => rd.hasSucceeded),
      map((rd: RemoteData<PaginatedList<SearchResult<any>>>) => {
        const dsoPage: any[] = rd.payload.page
          .filter((result) => hasValue(result))
          .map((searchResult: SearchResult<any>) => {
            if (searchResult.indexableObject.type === 'item') {
              return observableOf({
                id: null,
                item: searchResult.indexableObject
              });
            } else {
              this.linkService.resolveLink(searchResult.indexableObject, followLink('item'));
              return searchResult.indexableObject.item.pipe(
                getFirstSucceededRemoteDataPayload(),
                map((item: Item) => ({
                  id: searchResult.indexableObject.id,
                  item: item
                }))
              );
            }
          });
        const payload = Object.assign(rd.payload, { page: dsoPage }) as PaginatedList<any>;
        return Object.assign(rd, { payload: payload });
      }),
      mergeMap((rd: RemoteData<PaginatedList<Observable<WorkpackageSearchItem>>>) => {
        if (rd.payload.page.length === 0) {
          return observableOf([]);
        } else {
          return observableFrom(rd.payload.page).pipe(
            concatMap((list: Observable<WorkpackageSearchItem>) => list),
            scan((acc: any, value: any) => [...acc, value], []),
            filter((list: WorkpackageSearchItem[]) => list.length === rd.payload.page.length),
          );
        }
      }),
      first((result: WorkpackageSearchItem[]) => isNotUndefined(result))
    );
  }

  public initWorkpackageFromItem(item: Item, workspaceItemId: string, steps: WorkpackageStep[] = []): Workpackage {

    const dates = this.initWorkpackageDatesFromItem(item);
    const responsible = item.firstMetadataValue(environment.workingPlan.workingPlanStepResponsibleMetadata);
    const status = item.firstMetadataValue(environment.workingPlan.workingPlanStepStatusMetadata);
    const type = item.firstMetadataValue('dspace.entity.type');

    return {
      id: item.id,
      workspaceItemId: workspaceItemId,
      name: item.name,
      type: type,
      responsible: responsible,
      progress: 0,
      progressDates: [],
      dates: dates,
      status: status,
      steps: steps,
      expanded: (steps && steps.length > 0)
    };
  }

  public initWorkpackageStepFromItem(item: Item, workspaceItemId: string, parentId: string): WorkpackageStep {

    const dates = this.initWorkpackageDatesFromItem(item);
    const responsible = item.firstMetadataValue(environment.workingPlan.workingPlanStepResponsibleMetadata);
    const status = item.firstMetadataValue(environment.workingPlan.workingPlanStepStatusMetadata);
    const type = item.firstMetadataValue('dspace.entity.type');

    return {
      id: item.id,
      workspaceItemId: workspaceItemId,
      parentId: parentId,
      name: item.name,
      type: type,
      responsible: responsible,
      progress: 0,
      progressDates: [],
      dates: dates,
      status: status,
      expanded: false
    };
  }

  initWorkingPlan(workpackageListItem: WorkpackageSearchItem[]): Observable<Workpackage[]> {
    return observableFrom(workpackageListItem).pipe(
      concatMap((searchItem: WorkpackageSearchItem) => this.initWorkpackageStepsFromParentItem(
        searchItem.item.id,
        searchItem.item,
        searchItem.id).pipe(
        map((steps: WorkpackageStep[]) => this.initWorkpackageFromItem(
          searchItem.item,
          searchItem.id,
          steps
        ))
      )),
      reduce((acc: any, value: any) => [...acc, value], [])
    );
  }

  initWorkpackageStepsFromParentItem(workpackageId: string, parentItem: Item, workspaceItemId: string): Observable<WorkpackageStep[]> {
    const relatedTaskMetadata = Metadata.all(parentItem.metadata, environment.workingPlan.workingPlanStepRelationMetadata);
    if (isEmpty(relatedTaskMetadata)) {
      return observableOf([]);
    } else {
      return observableFrom(relatedTaskMetadata).pipe(
        concatMap((task: MetadataValue) => this.itemService.findById(task.value).pipe(
          getFirstSucceededRemoteDataPayload(),
          map((stepItem: Item) => this.initWorkpackageStepFromItem(stepItem, workspaceItemId, workpackageId)),
        )),
        reduce((acc: any, value: any) => [...acc, value], [])
      );
    }
  }

  initWorkpackageDatesFromItem(item: Item): WorkpackageChartDates {
    let start;
    let startMonth;
    let startYear;
    let end;
    let endMonth;
    let endyear;
    const startDate = item.firstMetadataValue(environment.workingPlan.workingPlanStepDateStartMetadata);
    if (isEmpty(startDate)) {
      start = moment().format('YYYY-MM-DD');
      startMonth = moment().format('YYYY-MM');
      startYear = moment().format('YYYY');
    } else {
      start = moment(startDate).format('YYYY-MM-DD');
      startMonth = moment(startDate).format('YYYY-MM');
      startYear = moment(startDate).format('YYYY');
    }

    const endDate = item.firstMetadataValue(environment.workingPlan.workingPlanStepDateEndMetadata);
    if (isEmpty(endDate)) {
      end = moment().add(7, 'days').format('YYYY-MM-DD');
      endMonth = moment().add(7, 'days').format('YYYY-MM');
      endyear = moment().add(7, 'days').format('YYYY');
    } else {
      end = moment(endDate).format('YYYY-MM-DD');
      endMonth = moment(endDate).format('YYYY-MM');
      endyear = moment(endDate).format('YYYY');
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
    );
  }

  checkAndRemoveRelations(itemId: string): Observable<Item> {
    return this.itemAuthorityRelationService.removeRelationFromParent(
      itemId,
      environment.workingPlan.workingPlanParentRelationMetadata,
      environment.workingPlan.workingPlanStepRelationMetadata
    );
  }

  setDefaultForStatusMetadata(metadata: MetadataMap): MetadataMap {
    let result: MetadataMap = metadata;
    if (!metadata.hasOwnProperty(environment.workingPlan.workingPlanStepStatusMetadata)
      || isEmpty(metadata[environment.workingPlan.workingPlanStepStatusMetadata])) {
      result = Object.assign({}, metadata, {
        [environment.workingPlan.workingPlanStepStatusMetadata]: [{
          authority: 'not_done',
          confidence: 600,
          language: null,
          place: 0,
          value: 'not_done'
        }]
      });
    }

    return result;
  }

  linkWorkingPlanObject(itemId: string, place?: string) {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((item: Item) => {
        this.projectItemService.createReplaceMetadataPatchOp(
          environment.workingPlan.workingPlanLinkMetadata,
          0,
          'linked'
        );
        if (isNotEmpty(place)) {
          this.projectItemService.createAddMetadataPatchOp(environment.workingPlan.workingPlanPlaceMetadata, place);
        }
      }),
      delay(100),
      mergeMap((taskItem: Item) => this.projectItemService.executeItemPatch(itemId, 'metadata'))
    );
  }

  unlinkWorkingPlanObject(itemId: string) {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((item: Item) => {
        this.projectItemService.createReplaceMetadataPatchOp(
          environment.workingPlan.workingPlanLinkMetadata,
          0,
          'unlinked'
        );
        const place = item.firstMetadataValue(environment.workingPlan.workingPlanStepDateStartMetadata);
        if (isNotEmpty(place)) {
          this.projectItemService.createRemoveMetadataPatchOp(environment.workingPlan.workingPlanPlaceMetadata, 0);
        }
      }),
      delay(100),
      mergeMap((taskItem: Item) => this.projectItemService.executeItemPatch(itemId, 'metadata'))
    );
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
            this.projectItemService.createAddMetadataPatchOp(metadatumView.key, value);
          } else {
            this.projectItemService.createReplaceMetadataPatchOp(metadatumView.key, metadatumView.place, value);
          }
        });
      }),
      delay(100),
      mergeMap(() => this.projectItemService.executeItemPatch(itemId, 'metadata'))
    );
  }

  updateWorkpackagePlace(workpackages: WorkpackageEntries): Observable<Item[]> {
    const list = Object.keys(workpackages)
      .map((key, index) => ({
        id: key,
        metadataList: [
          {
            key: environment.workingPlan.workingPlanPlaceMetadata,
            language: '',
            value: index.toString().padStart(3, '0'),
            place: 0,
            authority: '',
            confidence: -1
          } as MetadatumViewModel
        ]
      }));

    return observableFrom(list).pipe(
      concatMap((entry) => this.updateMetadataItem(entry.id, entry.metadataList)),
      reduce((acc: any, value: any) => [...acc, value], [])
    );
  }

  updateWorkpackageStepsPlace(workpackageId: string, workpackageSteps: WorkpackageStep[]): Observable<Item> {
    const metadataList: MetadatumViewModel[] = workpackageSteps
      .map((step, index) => (
        {
          key: environment.workingPlan.workingPlanStepRelationMetadata,
          language: '',
          value: step.id,
          place: index,
          authority: '',
          confidence: -1
        } as MetadatumViewModel));

    return this.updateMetadataItem(workpackageId, metadataList);
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
      );
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
      );
    });

    this.workingPlanStateService.dispatchUpdateWorkpackageStepAction(
      workpackageId,
      workpackageStepId,
      workpackageStep,
      metadatumViewList
    );
  }

  private addPatchOperationForWorkpackage(metadata: MetadataMap, place: string = null): void {

    const pathCombiner = new JsonPatchOperationPathCombiner('metadata');
    Object.keys(metadata)
      .filter((metadataName) => metadataName !== 'dspace.entity.type')
      .forEach((metadataName) => {
        this.operationsBuilder.add(pathCombiner.getPath(metadataName), metadata[metadataName], true, true);
      });
    if (isNotNull(place)) {
      this.operationsBuilder.add(
        pathCombiner.getPath(environment.workingPlan.workingPlanPlaceMetadata),
        place,
        true,
        true
      );
    }
  }


}
