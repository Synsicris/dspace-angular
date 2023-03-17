import { Injectable } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { filter, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import {
  EXPLOITATIONPLAN_ENTITY,
  FUNDING_RELATION_METADATA,
  INTERIM_REPORT_ENTITY,
  PROJECT_ENTITY,
  PROJECT_RELATION_METADATA,
  VERSION_UNIQUE_ID,
  WORKINGPLAN_ENTITY
} from '../../../core/project/project-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { MetadataMap, MetadataValue } from '../../../core/shared/metadata.models';
import { ConfidenceType } from '../../../core/shared/confidence-type';
import { hasValue, isNotEmpty } from '../../empty.util';
import { getEntityPageRoute } from '../../../item-page/item-page-routing-paths';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import {
  TypeDescriptionMetadata
} from '../../../entity-groups/research-entities/item-list-elements/search-result-list-elements/comment/comment-search-result-list-element.component';

@Injectable({
  providedIn: 'root'
})
export class CommentUtilsService {

  public readonly IPW_RELATION_ITEMS = [environment.impactPathway.projObjectiveEntity, environment.impactPathway.iaObjectiveEntity];
  public readonly IPW_ENTITY = environment.impactPathway.impactPathwayEntity;
  public readonly IPW_STEP_ENTITY = environment.impactPathway.impactPathwayStepEntity;
  public readonly IPW_RELATION_PARENT = environment.impactPathway.impactPathwayParentRelationMetadata;
  public readonly INTERIM_REPORT_STEP_ENTITY_TYPE = environment.interimReport.questionsBoardStepEntityName;

  constructor(
    private readonly itemService: ItemDataService,
    private readonly dsoNameService: DSONameService
  ) {
  }

  public getRelatedItemURL(relatedItemMD: MetadataValue, questionBoardMD: MetadataValue): Observable<string> {
    let url$ = null;
    if (questionBoardMD?.authority != null) {
      url$ = this.getQuestionBoardURL(relatedItemMD, questionBoardMD);
    } else {
      url$ = of(this.getRelateItemPageRoute(relatedItemMD, questionBoardMD));
    }
    return url$;
  }

  private getQuestionBoardURL(relatedItemMD: MetadataValue, questionBoardMD: MetadataValue): Observable<string> {
    return combineLatest([
      this.itemService.findById(relatedItemMD.authority).pipe(
        getFirstCompletedRemoteData(),
        map(({ payload }) => payload)
      ),
      this.itemService.findById(questionBoardMD.authority).pipe(
        getFirstCompletedRemoteData(),
        map(({ payload }) => payload)
      ),
    ])
      .pipe(
        switchMap(([relatedItem, questionBoard]) =>
          this.resolveBoardToUrl(relatedItem, questionBoard)
        ),
        take(1)
      );
  }

  /**
   * Returns the route to the related item page.
   * We are assuming that {@see MetadataValue#value} is made with this format:
   * `{itemType} - {description}`.
   *
   * @param metadataValue
   * @param questionBoard
   */
  public getRelateItemPageRoute(metadataValue: MetadataValue, questionBoard?: MetadataValue) {
    if (!hasValue(metadataValue == null) || !hasValue(metadataValue.value) || !hasValue(metadataValue.authority)) {
      return null;
    }
    let itemType = null;
    // no question board link to the item
    if (questionBoard == null) {
      itemType = this.splitMetadataValue(metadataValue)?.itemType;
    }
    return getEntityPageRoute(itemType, metadataValue.authority);
  }

  public resolveBoardToUrl(item: Item, questionBoard: Item): Observable<string> {
    let index = null;
    switch (questionBoard.entityType) {
      case WORKINGPLAN_ENTITY:
        return of(
          this.getWorkingPlanURL(questionBoard)
        );
      case INTERIM_REPORT_ENTITY:
      case this.INTERIM_REPORT_STEP_ENTITY_TYPE:
        return this.itemService.findById(questionBoard.firstMetadata(FUNDING_RELATION_METADATA)?.authority)
          .pipe(
            getFirstCompletedRemoteData(),
            map(({ payload }) => this.getFundingEntityURL(payload, 'interimreport'))
          );
      case EXPLOITATIONPLAN_ENTITY:
        return this.itemService.findById(questionBoard.firstMetadata(FUNDING_RELATION_METADATA)?.authority)
          .pipe(
            getFirstCompletedRemoteData(),
            map(({ payload }) => this.getFundingEntityURL(payload, 'exploitationplans'))
          );
      case this.IPW_ENTITY:
        index = this.IPW_RELATION_ITEMS.indexOf(item?.entityType);
        if (index !== -1) {
          return of(this.getImpactPathwayURL(questionBoard, 'objectives', item.uuid));
        }
        return of(this.getImpactPathwayURL(questionBoard));
      case this.IPW_STEP_ENTITY:
        index = this.IPW_RELATION_ITEMS.indexOf(item?.entityType);
        if (index !== -1) {
          return this.itemService.findById(questionBoard.firstMetadata(this.IPW_RELATION_PARENT)?.authority)
            .pipe(
              getFirstCompletedRemoteData(),
              map(({ payload }) =>
                this.getImpactPathwayURL(payload, 'objectives', questionBoard.uuid) + '?target=' + item.uuid
              )
            );
        }
        break;
      default:
        return of(getEntityPageRoute(questionBoard.entityType, questionBoard.uuid));
    }
  }

  private getWorkingPlanURL(questionBoard: Item) {
    return new URLCombiner('/entities/project', questionBoard.firstMetadata(PROJECT_RELATION_METADATA)?.authority, 'workingplan').toString();
  }

  private getImpactPathwayURL(questionBoard: Item, ...relatedItemDetails: string[]) {
    return new URLCombiner('/entities/impactpathway', questionBoard.uuid, ...relatedItemDetails).toString();
  }

  private getFundingEntityURL(payload: Item, entityType: string) {
    return new URLCombiner('/entities/funding/', payload.uuid, entityType).toString();
  }

  /**
   * Returns the `itemType` from {@param metadataValue}
   * that has its value in format `{itemType} - {description}`
   *
   * @param metadataValue
   */
  public splitMetadataValue(metadataValue: MetadataValue): TypeDescriptionMetadata {
    if (!hasValue(metadataValue?.value)) {
      return null;
    }
    const typeValue = metadataValue.value;
    const splittedValue = typeValue.split('-', 1);
    const index = typeValue.indexOf('-');
    const itemType = typeValue.substring(0, index);
    const description = typeValue.substring(index + 1);

    return {
      itemType: (itemType || '').trim(),
      description: isNotEmpty(description) && isNotEmpty(description.trim()) ? description.trim() : null
    };
  }

  public getCustomCommentMetadataMap(item: Item, relatedBoardItem: Item, relatedEntityType: string): Observable<MetadataMap> {
    const customMetadata$: Observable<MetadataMap> =
      forkJoin([
        this.generateVersionMetadata(environment.comments.commentRelationItemVersionMetadata, item, this.getRelationMapper(item)),
        this.generateOriginalRelationMetadata(environment.comments.commentRelationItemMetadata, item, this.getRelationMapper(item))
      ]).pipe(
        map(([versionMD, relationMD]) => Object.assign({}, new MetadataMap(), {
          ...versionMD,
          ...relationMD
        }))
      );
    let metadataMap$ = customMetadata$.pipe(withLatestFrom(of(item)));
    const isRelatedToProject = relatedEntityType === PROJECT_ENTITY;
    if (!isRelatedToProject) {
      metadataMap$ =
        customMetadata$
          .pipe(
            switchMap(customMetadata =>
              this.getMetadataMapWithRelatedProject$(customMetadata, item.firstMetadata(PROJECT_RELATION_METADATA))
            )
          );
    }
    if (relatedBoardItem != null) {
      metadataMap$ =
        metadataMap$
          .pipe(
            map(([metadataMap, relItem]) =>
              [
                Object.assign({}, metadataMap, {
                  ...this.generateRelationMetadata(environment.comments.commentRelationBoardMetadata, relatedBoardItem.entityType, relatedBoardItem)
                }),
                relItem
              ]
            )
          );
    }
    return metadataMap$
      .pipe(
        switchMap(([metadataMap, relItem]) =>
          forkJoin([
            this.generateOriginalRelationMetadata(environment.comments.commentRelationProjectMetadata, relItem),
            this.generateVersionMetadata(environment.comments.commentRelationProjectVersionMetadata, relItem)
          ]).pipe(
            map(([relationMD, versionMD]) =>
              Object.assign({}, metadataMap, {
                ...relationMD,
                ...versionMD,
              }))
          )
        )
      );
  }

  private generateOriginalRelationMetadata(entryKey: string, item: Item, metadataValueMapper = this.defaultMetadataRelationMapper) {
    let splittedUniqueId = item.firstMetadata(VERSION_UNIQUE_ID)?.value?.split('_');
    // if is not versioned, is the original item itself.
    if (!hasValue(splittedUniqueId) || !isNotEmpty(splittedUniqueId) || !hasValue(splittedUniqueId[0])) {
      splittedUniqueId = [item.id];
    }
    const authority = splittedUniqueId[0];
    return metadataValueMapper(item, this.dsoNameService)
      .pipe(
        map(value => ({
          [entryKey]: [
            Object.assign({}, new MetadataValue(), {
              value,
              authority: authority,
              confidence: ConfidenceType.CF_ACCEPTED
            })
          ]
        }))
      );
  }

  private generateVersionMetadata(entryKey: string, item: Item, metadataValueMapper = this.defaultMetadataRelationMapper) {
    return metadataValueMapper(item, this.dsoNameService)
      .pipe(
        map(value => this.generateRelationMetadata(entryKey, value, item))
      );
  }

  private generateRelationMetadata(entryKey: string, value: string, item: Item) {
    return {
      [entryKey]: [
        Object.assign({}, new MetadataValue(), {
          value,
          authority: item.id,
          confidence: ConfidenceType.CF_ACCEPTED
        })
      ]
    };
  }

  private getMetadataMapWithRelatedProject$(
    customMetadata: MetadataMap,
    relatedProjectMetadata: MetadataValue
  ): Observable<[MetadataMap, Item]> {
    return of(customMetadata)
      .pipe(
        withLatestFrom(
          of(relatedProjectMetadata)
            .pipe(
              filter(hasValue),
              switchMap(metadata =>
                this.itemService.findById(
                  metadata.authority,
                  true,
                  true
                )
                  .pipe(getFirstSucceededRemoteDataPayload())
              ),
            )
        )
      );
  }

  public getRelationMapper(item: Item): (item: Item) => Observable<string> {
    switch (item?.entityType) {
      case 'workingplan':
        return (relatedItem) => of(`${relatedItem.entityType}`);
      case environment.impactPathway.impactPathwayStepEntity:
        return (relatedItem) =>
          this.itemService.findById(relatedItem.firstMetadata(environment.impactPathway.impactPathwayParentRelationMetadata)?.value)
            .pipe(
              getFirstCompletedRemoteData(),
              map(ipw => `${ipw.payload.entityType}.${this.dsoNameService.getName(relatedItem)} - ${this.dsoNameService.getName(ipw.payload)} `)
            );
      // related to exploitationPlan Steps
      // we must return the name of the linked funding and the label 'Exploitationplan'
      case environment.interimReport.questionsBoardStepEntityName:
      case environment.exploitationPlan.questionsBoardStepEntityName:
        return (relatedItem) => this.itemService.findById(relatedItem.firstMetadata(FUNDING_RELATION_METADATA)?.authority)
          .pipe(
            getFirstCompletedRemoteData(),
            map(funding => `${relatedItem.entityType}.${this.dsoNameService.getName(relatedItem)} - ${this.dsoNameService.getName(funding?.payload)}`)
          );
      default:
        return this.defaultMetadataRelationMapper;
    }
  }

  private defaultMetadataRelationMapper(item: Item, dsoNameService: DSONameService = this.dsoNameService): Observable<string> {
    return of(`${item.entityType} - ${dsoNameService.getName(item)}`);
  }
}
