import { Injectable } from '@angular/core';

import { from as observableFrom, Observable, of as observableOf } from 'rxjs';
import { catchError, concatMap, delay, filter, map, mapTo, mergeMap, reduce, scan, take, tap } from 'rxjs/operators';
import { extendMoment } from 'moment-range';
import * as Moment from 'moment';

import { SubmissionFormModel } from '../../core/config/models/config-submission-form.model';
import { SubmissionFormsConfigService } from '../../core/config/submission-forms-config.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { buildPaginatedList, PaginatedList } from '../../core/data/paginated-list.model';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { SearchResult } from '../../shared/search/search-result.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { Item } from '../../core/shared/item.model';
import { SearchService } from '../../core/shared/search/search.service';
import { LinkService } from '../../core/cache/builders/link.service';
import { MyDSpaceResponseParsingService } from '../../core/data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../../core/data/request.models';
import {
  Workpackage,
  WorkpackageChartDates,
  WorkpackageSearchItem,
  WorkpackageStep,
  WorkpackageTreeObject
} from './models/workpackage-step.model';
import { WorkpackageEntries } from './working-plan.reducer';
import { MetadataMap, MetadataValue, MetadatumViewModel } from '../../core/shared/metadata.models';
import { JsonPatchOperationsBuilder } from '../../core/json-patch/builder/json-patch-operations-builder';
import {
  getAllSucceededRemoteData,
  getFinishedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { SearchConfig } from '../../core/shared/search/search-filters/search-config.model';
import { ItemJsonPatchOperationsService } from '../../core/data/item-json-patch-operations.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { VocabularyOptions } from '../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntry } from '../../core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyService } from '../../core/submission/vocabularies/vocabulary.service';
import { Metadata } from '../../core/shared/metadata.utils';
import { ItemAuthorityRelationService } from '../../core/shared/item-authority-relation.service';
import { WorkingPlanStateService, WpActionPackage, WpStepActionPackage } from './working-plan-state.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { dateToISOFormat, isNgbDateStruct } from '../../shared/date.util';
import { environment } from '../../../environments/environment';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { RequestService } from '../../core/data/request.service';
import { ProjectItemService } from '../../core/project/project-item.service';

export const moment = extendMoment(Moment);

export interface WpMetadata {
  nestedNodeId: string;
  nestedNode: WorkpackageTreeObject;
  metadata: string[];
  values: string[];
  hasAuthority: boolean;
}

export interface WpStepMetadata {
  parentNestedNodeId: string;
  childNestedNodeId: string;
  childNestedNode: WorkpackageStep;
  metadata: string[];
  values: string[];
  hasAuthority: boolean;
}

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
    let wpMetadata: MetadataMap;
    if (isNotNull(place)) {
      wpMetadata = Object.assign({}, metadata, {
        [environment.workingPlan.workingPlanPlaceMetadata]: [
          Object.assign(new MetadataValue(), {
            value: place
          })
        ]
      });
    } else {
      wpMetadata = metadata;
    }

    return this.projectItemService.generateEntityItemWithinProject(
      this.getWorkpackageFormConfigName(),
      projectId,
      type,
      wpMetadata
    );
  }

  generateWorkpackageStepItem(projectId: string, parentId: string, stepType: string, metadata: MetadataMap): Observable<Item> {
    return this.projectItemService.generateEntityItemWithinProject(
      this.getWorkpackageStepFormConfigName(),
      projectId,
      stepType,
      metadata
    );
  }

  getWorkpackageFormConfig(): Observable<SubmissionFormModel> {
    const formName = environment.workingPlan.workingPlanFormName;
    return this.formConfigService.findByName(this.getWorkpackageFormConfigName()).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getWorkpackageFormConfigName(): string {
    return environment.workingPlan.workingPlanFormName;
  }

  getWorkpackageSortOptions(): Observable<SearchConfig> {
    return this.searchService.getSearchConfigurationFor(null, 'allLinkedWorkingPlanObj').pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SearchConfig>;
  }

  getWorkpackageFormHeader(): string {
    return environment.workingPlan.workingPlanFormName;
  }

  getWorkpackageStepFormConfig(): Observable<SubmissionFormModel> {
    const formName = environment.workingPlan.workingPlanStepsFormName;
    return this.formConfigService.findByName(this.getWorkpackageStepFormConfigName()).pipe(
      getFirstSucceededRemoteDataPayload()
    ) as Observable<SubmissionFormModel>;
  }

  getWorkpackageStepFormConfigName(): string {
    return environment.workingPlan.workingPlanStepsFormName;
  }

  getWorkpackageStepFormHeader(): string {
    return environment.workingPlan.workingPlanStepsFormName;
  }

  getWorkingPlanEditMode(): string {
    return environment.workingPlan.workingPlanEditMode;
  }

  getWorkingPlanEditSectionName(): string {
    return `sections/${environment.workingPlan.workingPlanEditFormSection}`;
  }

  getWorkingPlanTaskSearchHeader(): string {
    return `working-plan.task.search.header`;
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

  getLastAddedNodesList(): Observable<string[]> {
    return this.workingPlanStateService.getLastAddedNodesList();
  }

  invalidateSearchCache(searchConfiguration: string) {
    this.requestService.setStaleByHrefSubstring(searchConfiguration);
  }

  searchForLinkedWorkingPlanObjects(projectId: string, sortOption: string = environment.workingPlan.workingPlanPlaceMetadata): Observable<WorkpackageSearchItem[]> {
    const searchConfiguration = environment.workingPlan.allLinkedWorkingPlanObjSearchConfigName;
    const paginationOptions: PaginationComponentOptions = new PaginationComponentOptions();
    paginationOptions.id = 'slw';
    paginationOptions.pageSize = 1000;
    const sortOptions = new SortOptions(sortOption, SortDirection.ASC);

    const searchOptions = new PaginatedSearchOptions({
      configuration: searchConfiguration,
      pagination: paginationOptions,
      sort: sortOptions,
      scope: projectId
    });

    return this.searchService.search(searchOptions, null, false).pipe(
      getAllSucceededRemoteData(),
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
        this.invalidateSearchCache(searchConfiguration);
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
      filter((result: WorkpackageSearchItem[]) => isNotUndefined(result)),
      take(1)
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
        concatMap((task: MetadataValue) => this.itemService.findById(task.authority).pipe(
          getFinishedRemoteData(),
          mergeMap((rd: RemoteData<Item>) => {
            if (rd.hasSucceeded) {
              const stepItem = rd.payload;
              return observableOf(this.initWorkpackageStepFromItem(stepItem, workspaceItemId, workpackageId));
            } else {
              if (rd.statusCode === 404) {
                // NOTE if a task is not found probably it has been deleted without unlinking it from parent step, so unlink it
                return this.itemAuthorityRelationService.removeChildRelationFromParent(
                  this.getWorkingPlanEditSectionName(),
                  this.getWorkingPlanEditMode(),
                  parentItem.id,
                  task.authority,
                  environment.workingPlan.workingPlanStepRelationMetadata
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

  initWorkpackageDatesFromItem(item: Item): WorkpackageChartDates {
    let start;
    let startMonth;
    let startYear;
    let end;
    let endMonth;
    let endyear;
    const dates: any = {};
    const startDate = item.firstMetadataValue(environment.workingPlan.workingPlanStepDateStartMetadata);
    if (isNotEmpty(startDate)) {
      start = moment(startDate).format('YYYY-MM-DD');
      startMonth = moment(startDate).format('YYYY-MM');
      startYear = moment(startDate).format('YYYY');
      dates.start = {
        full: start,
        month: startMonth,
        year: startYear
      };
    }

    const endDate = item.firstMetadataValue(environment.workingPlan.workingPlanStepDateEndMetadata);
    if (isNotEmpty(endDate)) {
      end = moment(endDate).format('YYYY-MM-DD');
      endMonth = moment(endDate).format('YYYY-MM');
      endyear = moment(endDate).format('YYYY');
      dates.end = {
        full: end,
        month: endMonth,
        year: endyear
      };
    }

    return dates;
  }

  isProcessingWorkpackageRemove(workpackageId: string): Observable<boolean> {
    return this.workingPlanStateService.getWorkpackageToRemoveId().pipe(
      map((workpackageToRemoveId) => workpackageId === workpackageToRemoveId)
    );
  }

  isProcessingWorkpackage(): Observable<boolean> {
    return this.workingPlanStateService.isProcessing();
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

  linkWorkingPlanObject(itemId: string, place?: string): Observable<Item> {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((item: Item) => {
        const value = {
          value: 'linked'
        };
        this.projectItemService.createReplaceMetadataPatchOp(
          this.getWorkingPlanEditSectionName(),
          environment.workingPlan.workingPlanLinkMetadata,
          0,
          value
        );
        if (isNotEmpty(place)) {
          this.projectItemService.createAddMetadataPatchOp(this.getWorkingPlanEditSectionName(), environment.workingPlan.workingPlanPlaceMetadata, place);
        }
      }),
      delay(100),
      mergeMap((taskItem: Item) => this.itemService.executeEditItemPatch(itemId, this.getWorkingPlanEditMode(), this.getWorkingPlanEditSectionName())),
      getRemoteDataPayload()
    );
  }

  unlinkWorkingPlanObject(itemId: string) {
    return this.itemService.findById(itemId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((item: Item) => {
        const value = {
          value: 'unlinked'
        };
        this.projectItemService.createReplaceMetadataPatchOp(
          this.getWorkingPlanEditSectionName(),
          environment.workingPlan.workingPlanLinkMetadata,
          0,
          value
        );
        const place = item.firstMetadataValue(environment.workingPlan.workingPlanStepDateStartMetadata);
        if (isNotEmpty(place)) {
          this.projectItemService.createRemoveMetadataPatchOp(this.getWorkingPlanEditSectionName(), environment.workingPlan.workingPlanPlaceMetadata, 0);
        }
      }),
      delay(100),
      mergeMap((taskItem: Item) => this.itemService.executeEditItemPatch(
        itemId,
        this.getWorkingPlanEditMode(),
        this.getWorkingPlanEditSectionName()
      ))
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
            this.projectItemService.createAddMetadataPatchOp(this.getWorkingPlanEditSectionName(), metadatumView.key, value);
          } else {
            this.projectItemService.createReplaceMetadataPatchOp(this.getWorkingPlanEditSectionName(), metadatumView.key, metadatumView.place, value);
          }
        });
      }),
      delay(100),
      mergeMap(() => this.itemService.executeEditItemPatch(itemId, this.getWorkingPlanEditMode(), this.getWorkingPlanEditSectionName())),
      getRemoteDataPayload()
    );
  }

  updateWorkpackagePlace(workpackages: WorkpackageEntries, sortOption: string = environment.workingPlan.workingPlanPlaceMetadata): Observable<Item[]> {
    let list: any[];
    if (sortOption === environment.workingPlan.workingPlanPlaceMetadata) {
      list = Object.keys(workpackages)
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
    } else {
      list = [];
    }

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
          value: step.name,
          place: index,
          authority: step.id,
          confidence: 600
        } as MetadatumViewModel));

    return this.updateMetadataItem(workpackageId, metadataList);
  }

  updateWorkpackageMetadata(
    workpackageId: string,
    workpackage: Workpackage,
    metadataList: string[],
    valueList: any[]
  ) {
    const metadatumViewList = [];
    metadataList.forEach((metadata, index) => {
      const entry = valueList[index];
      const hasAuthority = isNotEmpty(entry?.authority);
      const value = (isNgbDateStruct(entry)) ? dateToISOFormat(entry) : (hasAuthority ? entry.value : entry);
      metadatumViewList.push(
        {
          key: metadata,
          language: '',
          value: value,
          place: 0,
          authority: hasAuthority ? entry.authority : '',
          confidence: hasAuthority ? 600 : -1
        } as MetadatumViewModel
      );
    });

    this.workingPlanStateService.dispatchUpdateWorkpackageAction(workpackageId, workpackage, metadatumViewList);
  }

  updateAllWorkpackageMetadata(wpMetadata: WpMetadata[], wpStepMetadata: WpStepMetadata[]): void {
    const wpActionPackage: WpActionPackage[] = [];
    let metadatumViewList;
    wpMetadata.forEach((itemMetadata: WpMetadata) => {
      metadatumViewList = this.generateMetadatumViewList(itemMetadata);
      wpActionPackage.push({
        'workpackageId': itemMetadata.nestedNodeId,
        'workpackage': itemMetadata.nestedNode,
        'metadatumViewList': metadatumViewList
      });
    });

    const wpStepActionPackage: WpStepActionPackage[] = [];
    wpStepMetadata.forEach((itemMetadata: WpStepMetadata) => {
      metadatumViewList = this.generateMetadatumViewList(itemMetadata);
      wpStepActionPackage.push({
        'workpackageId': itemMetadata.parentNestedNodeId,
        'workpackageStepId': itemMetadata.childNestedNodeId,
        'workpackageStep': itemMetadata.childNestedNode,
        'metadatumViewList': metadatumViewList
      });
    });

    this.workingPlanStateService.dispatchUpdateAllWorkpackageAction(wpActionPackage, wpStepActionPackage);
  }

  updateWorkpackageStepMetadata(
    workpackageId: string,
    workpackageStepId: string,
    workpackageStep: WorkpackageStep,
    metadataList: string[],
    valueList: any[]
  ) {
    const metadatumViewList = [];
    metadataList.forEach((metadata, index) => {
      const entry = valueList[index];
      const hasAuthority = isNotEmpty(entry?.authority);
      const value = (isNgbDateStruct(entry)) ? dateToISOFormat(entry) : (hasAuthority ? entry.value : entry);
      metadatumViewList.push(
        {
          key: metadata,
          language: '',
          value: value,
          place: 0,
          authority: hasAuthority ? entry.authority : '',
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

  private generateMetadatumViewList(itemMetadata: WpMetadata | WpStepMetadata): MetadatumViewModel[] {
    const metadatumViewList = [];
    itemMetadata.metadata.forEach((metadata, index) => {
      const value = itemMetadata.values[index] as any;
      metadatumViewList.push(
        {
          key: metadata,
          language: '',
          value: (isNgbDateStruct(value)) ? dateToISOFormat(value) : value,
          place: 0,
          authority: itemMetadata.hasAuthority ? value : '',
          confidence: itemMetadata.hasAuthority ? 600 : -1
        } as MetadatumViewModel
      );
    });

    return metadatumViewList;
  }

}
