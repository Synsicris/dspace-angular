import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { difference, findIndex, union } from 'lodash';

import { isNotEmpty } from '../../shared/empty.util';
import { ItemDataService } from '../data/item-data.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { SubmissionJsonPatchOperationsService } from '../submission/submission-json-patch-operations.service';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { AuthorityService } from '../integration/authority.service';
import { impactPathwayRelationsSelector } from './selectors';
import { AppState } from '../../app.reducer';
import { ImpactPathwayRelation, ImpactPathwayRelations } from './impact-pathway.reducer';
import { SubmissionFormsConfigService } from '../config/submission-forms-config.service';
import { ItemJsonPatchOperationsService } from '../data/item-json-patch-operations.service';
import {
  AddImpactPathwayTaskRelationAction,
  EditImpactPathwayTaskRelationsAction, RemoveImpactPathwayTaskRelationAction,
  SaveImpactPathwayTaskRelationsAction
} from './impact-pathway.actions';

@Injectable()
export class ImpactPathwayRelationsService {

  constructor(
    @Inject(GLOBAL_CONFIG) protected config: GlobalConfig,
    private authorityService: AuthorityService,
    private formConfigService: SubmissionFormsConfigService,
    private itemService: ItemDataService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private itemJsonPatchOperationsService: ItemJsonPatchOperationsService,
    private submissionJsonPatchOperationsService: SubmissionJsonPatchOperationsService,
    private rdbService: RemoteDataBuildService,
    private store: Store<AppState>
  ) {
  }

  dispatchAddRelation(targetImpactPathwayTaskHTMLId: string) {
    this.store.dispatch(new AddImpactPathwayTaskRelationAction(targetImpactPathwayTaskHTMLId))
  }

  dispatchRemoveRelation(targetImpactPathwayTaskHTMLId: string) {
    this.store.dispatch(new RemoveImpactPathwayTaskRelationAction(targetImpactPathwayTaskHTMLId))
  }

  getAllRelations(): Observable<ImpactPathwayRelation[]> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayRelations) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayRelations) => {
        const unionList = union(relationsState.stored, relationsState.toSave);
        return difference(unionList, relationsState.toDelete);
      })
    )
  }

  isEditingRelationOnOtherStepAndTask(impactPathwayStepId: string, impactPathwayTaskHTMLId: string): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayRelations) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayRelations) => {
        return relationsState.editing && relationsState.relatedStepId !== impactPathwayStepId
          && relationsState.selectedTaskId !== impactPathwayTaskHTMLId
      }),
      startWith(false)
    )
  }

  isEditingRelationOnOtherTask(impactPathwayTaskHTMLId: string): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayRelations) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayRelations) => {
        return relationsState.editing && relationsState.selectedTaskId !== impactPathwayTaskHTMLId
      }),
      startWith(false)
    )
  }

  isEditingRelation(): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayRelations) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayRelations) => relationsState.editing),
      startWith(false)
    )
  }

  isEditingRelationOnTask(impactPathwayTaskHTMLId: string): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayRelations) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayRelations) => {
        return relationsState.editing && relationsState.selectedTaskId === impactPathwayTaskHTMLId
      }),
      startWith(false)
    )
  }

  isTaskPartOfRelation(impactPathwayTaskHTMLId): Observable<boolean> {
    return this.store.pipe(
      select(impactPathwayRelationsSelector),
      filter((relationsState: ImpactPathwayRelations) => isNotEmpty(relationsState)),
      map((relationsState: ImpactPathwayRelations) => {
        return findIndex(relationsState.toSave, (relation) => {
          return relation.to === impactPathwayTaskHTMLId || relation.from === impactPathwayTaskHTMLId;
        }) !== -1
      }),
      distinctUntilChanged()
    )
  }

  saveRelations() {
    this.store.dispatch(new SaveImpactPathwayTaskRelationsAction())
  }

  setEditRelations(impactPathwayStepId: string, selectedTwoWay: boolean, impactPathwayTaskHTMLId) {
    this.store.dispatch(new EditImpactPathwayTaskRelationsAction(impactPathwayStepId, selectedTwoWay, impactPathwayTaskHTMLId))
  }

}
