import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import {
  AddWorkpackageAction,
  AddWorkpackageStepAction,
  ChangeChartViewAction,
  GenerateWorkpackageAction,
  GenerateWorkpackageStepAction,
  MoveWorkpackageAction,
  MoveWorkpackageStepAction,
  RemoveWorkpackageAction,
  RemoveWorkpackageStepAction,
  RetrieveAllLinkedWorkingPlanObjectsAction,
  UpdateAllWorkpackageAction,
  UpdateAllWorkpackageStepAction,
  UpdateWorkpackageAction,
  UpdateWorkpackageStepAction
} from './working-plan.actions';
import { MetadataMap, MetadatumViewModel } from '../../core/shared/metadata.models';
import { Observable } from 'rxjs/internal/Observable';
import {
  chartDateViewSelector,
  isWorkingPlanLoadedSelector,
  isWorkingPlanMovingSelector,
  isWorkingPlanProcessingSelector,
  workpackagesSelector,
  workpackagesSortOptionSelector,
  workpackageToRemoveSelector
} from './selectors';
import { map, startWith } from 'rxjs/operators';
import { ChartDateViewType, WorkpackageEntries } from './working-plan.reducer';
import { Workpackage, WorkpackageStep } from './models/workpackage-step.model';
import { empty } from 'rxjs';

export interface WpActionPackage {
  workpackageId: string;
  workpackage: Workpackage;
  metadatumViewList: any[];
}

export interface WpStepActionPackage {
  workpackageId: string;
  workpackageStepId: string;
  workpackageStep: WorkpackageStep;
  metadatumViewList: any[];
}

@Injectable()
export class WorkingPlanStateService {

  constructor(private store: Store<AppState>) {

  }

  public dispatchAddWorkpackageStep(
    parentId: string,
    workpackageStepId: string,
    workspaceItemId: string
  ): void {
    this.store.dispatch(new AddWorkpackageStepAction(parentId, workpackageStepId, workspaceItemId));
  }

  public dispatchChangeChartDateView(chartDateView: ChartDateViewType): void {
    this.store.dispatch(new ChangeChartViewAction(chartDateView));
  }

  public dispatchGenerateWorkpackage(projectId: string, type: string, metadata: MetadataMap, place: string): void {
    this.store.dispatch(new GenerateWorkpackageAction(projectId, type, metadata, place));
  }

  public dispatchAddWorkpackageAction(itemId: string, workspaceItemId: string, place: string): void {
    this.store.dispatch(new AddWorkpackageAction(itemId, workspaceItemId, place));
  }

  public dispatchGenerateWorkpackageStep(
    projectId: string,
    parentId: string,
    workpackageStepType: string,
    metadata: MetadataMap
  ): void {
    this.store.dispatch(new GenerateWorkpackageStepAction(projectId, parentId, workpackageStepType, metadata));
  }

  public dispatchMoveWorkpackage(workpackageId: string, oldIndex: number, newIndex: number): void {
    this.store.dispatch(new MoveWorkpackageAction(workpackageId, oldIndex, newIndex));
  }

  public dispatchMoveWorkpackageStep(workpackageId: string, workpackage: Workpackage, workpackageStepId: string, oldIndex: number, newIndex: number): void {
    this.store.dispatch(new MoveWorkpackageStepAction(workpackageId, workpackage, workpackageStepId, oldIndex, newIndex));
  }

  public dispatchRemoveWorkpackage(workpackageId: string, workspaceItemId: string): void {
    this.store.dispatch(new RemoveWorkpackageAction(workpackageId, workspaceItemId));
  }

  public dispatchRemoveWorkpackageStep(workpackageId: string, workpackageStepId: string, workspaceItemId: string): void {
    this.store.dispatch(new RemoveWorkpackageStepAction(workpackageId, workpackageStepId, workspaceItemId));
  }

  public dispatchRetrieveAllWorkpackages(projectId: string, sortOption: string): void {
    this.store.dispatch(new RetrieveAllLinkedWorkingPlanObjectsAction(projectId, sortOption));
  }

  public dispatchUpdateWorkpackageAction(
    workpackageId: string,
    workpackage: Workpackage,
    metadatumViewList: MetadatumViewModel[]
  ) {
    this.store.dispatch((new UpdateWorkpackageAction(workpackageId, workpackage, metadatumViewList)));
  }

  public dispatchUpdateAllWorkpackageAction(wpActionPackage: WpActionPackage[], wpStepsActionPackage: WpStepActionPackage[]) {
    this.store.dispatch((new UpdateAllWorkpackageAction(wpActionPackage, wpStepsActionPackage)));
  }

  public dispatchUpdateWorkpackageStepAction(
    workpackageId: string,
    workpackageStepId: string,
    workpackageStep: WorkpackageStep,
    metadatumViewList: MetadatumViewModel[]
  ) {
    this.store.dispatch((new UpdateWorkpackageStepAction(workpackageId, workpackageStepId, workpackageStep, metadatumViewList)));
  }

  public dispatchUpdateAllWorkpackageStepAction(wpStepActionPackage: WpStepActionPackage[]) {
    this.store.dispatch((new UpdateAllWorkpackageStepAction(wpStepActionPackage)));
  }

  public getChartDateViewSelector() {
    return this.store.pipe(select(chartDateViewSelector));
  }

  public getWorkpackages(): Observable<Workpackage[]> {
    return this.store.pipe(
      select(workpackagesSelector),
      map((entries: WorkpackageEntries) => Object.keys(entries).map((key) => entries[key])),
      startWith([])
    );
  }

  public getWorkpackageToRemoveId() {
    return this.store.pipe(select(workpackageToRemoveSelector));
  }

  public getWorkpackagesSortOption() {
    return this.store.pipe(select(workpackagesSortOptionSelector));
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

  public isWorkingPlanMoving(): Observable<boolean> {
    return this.store.pipe(select(isWorkingPlanMovingSelector));
  }

}
