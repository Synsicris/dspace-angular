import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import {
  AddWorkpackageStepAction,
  ChangeChartViewAction,
  GenerateWorkpackageAction,
  GenerateWorkpackageStepAction,
  RemoveWorkpackageAction,
  RemoveWorkpackageStepAction,
  RetrieveAllWorkpackagesAction, UpdateWorkpackageAction
} from './working-plan.actions';
import { MetadataMap, MetadataValue, MetadatumViewModel } from '../shared/metadata.models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import {
  chartDateViewSelector,
  isWorkingPlanLoadedSelector,
  isWorkingPlanProcessingSelector,
  workpackageToRemoveSelector
} from './selectors';
import { map } from 'rxjs/operators';
import { ChartDateViewType } from './working-plan.reducer';
import { Workpackage } from './models/workpackage-step.model';

@Injectable()
export class WorkingPlanStateService {

  constructor(private store: Store<AppState>) {

  }

  public dispatchAddWorkpackageStep(parentId: string, workpackageStepId: string, modal?: NgbActiveModal): void {
    this.store.dispatch(new AddWorkpackageStepAction(parentId, workpackageStepId, modal))
  }

  public dispatchChangeChartDateView(chartDateView: ChartDateViewType): void {
    this.store.dispatch(new ChangeChartViewAction(chartDateView))
  }

  public dispatchGenerateWorkpackage(metadata: MetadataMap, modal?: NgbActiveModal): void {
    this.store.dispatch(new GenerateWorkpackageAction(metadata, modal))
  }

  public dispatchGenerateWorkpackageStep(
    parentId: string,
    workpackageStepType: string,
    metadata: MetadataMap,
    modal?: NgbActiveModal
  ): void {
    this.store.dispatch(new GenerateWorkpackageStepAction(parentId, workpackageStepType, metadata, modal))
  }

  public dispatchRemoveWorkpackage(workpackageId: string): void {
    this.store.dispatch(new RemoveWorkpackageAction(workpackageId))
  }

  public dispatchRemoveWorkpackageStep(workpackageId: string, workpackageStepId: string): void {
    this.store.dispatch(new RemoveWorkpackageStepAction(workpackageId, workpackageStepId))
  }

  public dispatchRetrieveAllWorkpackages(): void {
    this.store.dispatch(new RetrieveAllWorkpackagesAction(null))
  }

  public dispatchUpdateWorkpackageAction(
    workpackageId: string,
    workpackage: Workpackage,
    metadatumViewList: MetadatumViewModel[]
  ) {
    this.store.dispatch((new UpdateWorkpackageAction(workpackageId, workpackage, metadatumViewList)))
  }

  public getChartDateViewSelector() {
    return this.store.pipe(select(chartDateViewSelector));
  }

  public getWorkpackageToRemoveId() {
    return this.store.pipe(select(workpackageToRemoveSelector));
  }

  public isProcessing(): Observable<boolean> {
    return this.store.pipe(select(isWorkingPlanProcessingSelector));
  }

  public isLoading(): Observable<boolean> {
    return this.store.pipe(
      select(isWorkingPlanLoadedSelector),
      map((loaded: boolean) => !loaded)
    );
  }

  public isWorkingPlanLoaded(): Observable<boolean> {
    return this.store.pipe(select(isWorkingPlanLoadedSelector));
  }

}
