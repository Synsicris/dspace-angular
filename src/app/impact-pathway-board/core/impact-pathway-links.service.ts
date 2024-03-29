import { Injectable } from '@angular/core';

import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { delay, distinctUntilChanged, filter, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { difference, findIndex, union } from 'lodash';

import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { ItemDataService } from '../../core/data/item-data.service';
import { environment } from '../../../environments/environment';
import { SubmissionJsonPatchOperationsService } from '../../core/submission/submission-json-patch-operations.service';
import { JsonPatchOperationsBuilder } from '../../core/json-patch/builder/json-patch-operations-builder';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { impactPathwayRelationsSelector } from './selectors';
import { AppState } from '../../app.reducer';
import { ImpactPathwayLink, ImpactPathwayLinks } from './impact-pathway.reducer';
import { SubmissionFormsConfigDataService } from '../../core/config/submission-forms-config-data.service';
import { ItemJsonPatchOperationsService } from '../../core/data/item-json-patch-operations.service';
import {
  AddImpactPathwayTaskLinkAction,
  CompleteEditingImpactPathwayTaskLinksAction,
  EditImpactPathwayTaskLinksAction,
  RemoveImpactPathwayTaskLinkAction,
  SaveImpactPathwayTaskLinksAction
} from './impact-pathway.actions';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { Item } from '../../core/shared/item.model';
import { MetadataValue } from '../../core/shared/metadata.models';
import { JsonPatchOperationPathCombiner } from '../../core/json-patch/builder/json-patch-operation-path-combiner';
import { ImpactPathwayLinksMap } from './models/impact-pathway-task-links-map';
import { ItemAuthorityRelationService } from '../../core/shared/item-authority-relation.service';

@Injectable()
export class ImpactPathwayLinksService {

  constructor(
    private formConfigService: SubmissionFormsConfigDataService,
    private itemService: ItemDataService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private itemAuthorityRelationService: ItemAuthorityRelationService,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private submissionJsonPatchOperationsService: SubmissionJsonPatchOperationsService,
    private rdbService: RemoteDataBuildService,
    private store: Store<AppState>
  ) {
  }

  dispatchAddRelation(
    targetImpactPathwayTaskHTMLId: string,
    targetImpactPathwayId: string,
    targetImpactPathwayStepId: string,
    targetImpactPathwayTaskId: string,
    targetImpactPathwayTaskTitle: string) {
    this.store.dispatch(
      new AddImpactPathwayTaskLinkAction(
        targetImpactPathwayTaskHTMLId,
        targetImpactPathwayId,
        targetImpactPathwayStepId,
        targetImpactPathwayTaskId,
        targetImpactPathwayTaskTitle
      )
    );
  }

  dispatchRemoveRelation(targetImpactPathwayTaskHTMLId: string, targetImpactPathwayTaskId: string) {
    this.store.dispatch(new RemoveImpactPathwayTaskLinkAction(targetImpactPathwayTaskHTMLId, targetImpactPathwayTaskId));
  }

  dispatchSaveImpactPathwayTaskLinksAction(
    impactPathwayTaskId: string,
    toSave: ImpactPathwayLink[],
    toDelete: ImpactPathwayLink[]
  ) {
    this.store.dispatch(new SaveImpactPathwayTaskLinksAction(
      impactPathwayTaskId,
      toSave,
      toDelete
    ));
  }

  getAllLinks(): Observable<ImpactPathwayLink[]> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayLinks) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayLinks) => {
        const unionList = union(relationsState.stored, relationsState.toSave);
        return difference(unionList, relationsState.toDelete);
      })
    );
  }

  isEditingLinkOnOtherStepAndTask(impactPathwayStepId: string, impactPathwayTaskHTMLId: string): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayLinks) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayLinks) => {
        return relationsState.editing && relationsState.relatedStepId !== impactPathwayStepId
          && relationsState.selectedTaskHTMLId !== impactPathwayTaskHTMLId;
      }),
      startWith(false)
    );
  }

  isEditingLinkOnOtherTask(impactPathwayTaskHTMLId: string): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayLinks) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayLinks) => {
        return relationsState.editing && relationsState.selectedTaskHTMLId !== impactPathwayTaskHTMLId;
      }),
      startWith(false)
    );
  }

  isEditingLink(): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayLinks) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayLinks) => relationsState.editing),
      startWith(false)
    );
  }

  isEditingLinkOnTask(impactPathwayTaskHTMLId: string): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayLinks) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayLinks) => {
        return relationsState.editing && relationsState.selectedTaskHTMLId === impactPathwayTaskHTMLId;
      }),
      startWith(false)
    );
  }

  getActiveEditingTaskHTMLId(): Observable<string> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayLinks) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayLinks) => relationsState.selectedTaskHTMLId),
      distinctUntilChanged()
    );
  }

  isTaskPartOfLink(impactPathwayTaskHTMLId: string): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayLinks) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayLinks) => {
        return findIndex([...relationsState.stored, ...relationsState.toSave], (relation) => {
          if (relation.twoWay) {
            return relation.to === impactPathwayTaskHTMLId || relation.from === impactPathwayTaskHTMLId;
          } else {
            return relation.to === impactPathwayTaskHTMLId;
          }
        }) !== -1;
      }),
      startWith(false),
      distinctUntilChanged()
    );
  }

  isLinkedWithActiveEditingTask(impactPathwayTaskHTMLId: string): Observable<boolean> {
    const relationsState$ = this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayLinks) => isNotEmpty(relationsState)),
      distinctUntilChanged()
    );

    return observableCombineLatest(this.getActiveEditingTaskHTMLId(), relationsState$).pipe(
      filter(([activeImpactPathwayTaskHTMLId, relationsState]: [string, ImpactPathwayLinks]) => {
        return isNotEmpty(activeImpactPathwayTaskHTMLId);
      }),
      map(([activeImpactPathwayTaskHTMLId, relationsState]: [string, ImpactPathwayLinks]) => {
        return findIndex([...relationsState.stored, ...relationsState.toSave], (relation) => {
          if (relation.twoWay) {
            return (relation.from === activeImpactPathwayTaskHTMLId && relation.to === impactPathwayTaskHTMLId)
              || (relation.from === impactPathwayTaskHTMLId && relation.to === activeImpactPathwayTaskHTMLId);
          } else {
            return (relation.from === activeImpactPathwayTaskHTMLId && relation.to === impactPathwayTaskHTMLId);
          }
        }) !== -1;
      }),
      startWith(false),
      distinctUntilChanged()
    );
  }

  completeEditingLinks() {
    this.store.dispatch(new CompleteEditingImpactPathwayTaskLinksAction());
  }

  saveLinks(impactPathwayTaskId: string, toSave: ImpactPathwayLink[], toDelete: ImpactPathwayLink[]): Observable<Item> {
    return this.itemService.findById(impactPathwayTaskId).pipe(
      getFirstSucceededRemoteDataPayload(),
      tap((taskItem: Item) => this.buildPatchOperations(taskItem, toSave, toDelete)),
      delay(100),
      mergeMap((taskItem: Item) => this.itemAuthorityRelationService.executeEditItemPatch(
        taskItem.id,
        this.getImpactPathwaysLinksEditMode(),
        this.getImpactPathwaysLinksEditFormSection()
      ))
    );
  }

  setEditLinks(
    impactPathwayId: string,
    impactPathwayStepId: string,
    selectedTwoWay: boolean,
    impactPathwayTaskHTMLId: string,
    impactPathwayTaskId: string
  ) {
    this.store.dispatch(
      new EditImpactPathwayTaskLinksAction(
        impactPathwayId,
        impactPathwayStepId,
        selectedTwoWay,
        impactPathwayTaskHTMLId,
        impactPathwayTaskId
      )
    );
  }

  createMapOfLinksToFetch(toSave: ImpactPathwayLink[], toDelete: ImpactPathwayLink[]): ImpactPathwayLinksMap {
    const linksMap: ImpactPathwayLinksMap = {};
    toSave.forEach((link) => {
      if (linksMap[link.fromTaskId]) {
        linksMap[link.fromTaskId].toSave.push(link);
      } else {
        linksMap[link.fromTaskId] = {
          toSave: [link],
          toDelete: []
        };
      }
    });

    toDelete.forEach((link) => {
      if (linksMap[link.fromTaskId]) {
        linksMap[link.fromTaskId].toDelete.push(link);
      } else {
        linksMap[link.fromTaskId] = {
          toSave: [],
          toDelete: [link]
        };
      }
    });

    return linksMap;
  }

  private buildPatchOperations(targetItem: Item, toSave: ImpactPathwayLink[], toDelete: ImpactPathwayLink[]): void {
    const taskOutcomeLinkList: MetadataValue[] = targetItem
      .findMetadataSortedByPlace(environment.impactPathway.impactpathwayOutcomeLinkMetadata);
    const taskBidirectionalLinkList: MetadataValue[] = targetItem
      .findMetadataSortedByPlace(environment.impactPathway.impactpathwayBidirectionalLinkMetadata);

    this.buildAddPatchOperations(toSave, taskOutcomeLinkList, taskBidirectionalLinkList);
    this.buildRemovePatchOperations(toDelete, taskOutcomeLinkList, taskBidirectionalLinkList);
  }

  private buildAddPatchOperations(
    toSave: ImpactPathwayLink[],
    taskOutcomeLinkList: MetadataValue[],
    taskBidirectionalLinkList: MetadataValue[]
  ): void {

    const pathCombiner = new JsonPatchOperationPathCombiner(this.getImpactPathwaysLinksEditFormSection());
    let placeWhereToAddOutcomeLink: number = taskOutcomeLinkList.length;
    let placeWhereToAddBidirectionalLink: number = taskBidirectionalLinkList.length;

    toSave.forEach((relation: ImpactPathwayLink) => {
      const relationMetadata: string = (relation.twoWay) ?
        environment.impactPathway.impactpathwayBidirectionalLinkMetadata :
        environment.impactPathway.impactpathwayOutcomeLinkMetadata;
      const relationPlace: number = (relation.twoWay) ? placeWhereToAddBidirectionalLink++ : placeWhereToAddOutcomeLink++;
      const isFirstRelation: boolean = (relation.twoWay) ? isEmpty(taskBidirectionalLinkList) : isEmpty(taskOutcomeLinkList);
      const relationToAdd = {
        value: relation.toTaskUniqueId,
        authority: relation.toTaskId,
        place: relationPlace,
        confidence: 600
      };
      const path = isFirstRelation ? pathCombiner.getPath(relationMetadata)
        : pathCombiner.getPath([relationMetadata, relationPlace.toString()]);
      this.operationsBuilder.add(
        path,
        relationToAdd,
        isFirstRelation,
        true);
    });
  }

  private buildRemovePatchOperations(
    toDelete: ImpactPathwayLink[],
    taskOutcomeLinkList: MetadataValue[],
    taskBidirectionalLinkList: MetadataValue[]
  ): void {
    const pathCombiner = new JsonPatchOperationPathCombiner(this.getImpactPathwaysLinksEditFormSection());
    const currentOutcomeLinkList: MetadataValue[] = [...taskOutcomeLinkList];
    const currentBidirectionalLinkList: MetadataValue[] = [...taskBidirectionalLinkList];

    toDelete.forEach((relation: ImpactPathwayLink) => {
      const relationMetadata: string = (relation.twoWay) ?
        environment.impactPathway.impactpathwayBidirectionalLinkMetadata :
        environment.impactPathway.impactpathwayOutcomeLinkMetadata;
      let relationPlace: number;
      if (relation.twoWay) {
        relationPlace = findIndex(currentBidirectionalLinkList, { authority: relation.toTaskId });
      } else {
        relationPlace = findIndex(currentOutcomeLinkList, { authority: relation.toTaskId });
      }
      if (relationPlace !== -1) {
        const path = pathCombiner.getPath([relationMetadata, relationPlace.toString()]);
        this.operationsBuilder.remove(path);
        if (relation.twoWay) {
          currentBidirectionalLinkList.splice(relationPlace, 1);
        } else {
          currentOutcomeLinkList.splice(relationPlace, 1);
        }
      }
    });
  }

  private getImpactPathwaysLinksEditFormSection(): string {
    return `sections/${environment.impactPathway.impactPathwaysLinksEditFormSection}`;
  }

  private getImpactPathwaysLinksEditMode(): string {
    return environment.impactPathway.impactPathwaysLinkEditMode;
  }

}
