import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import {
  AddWorkpackageAction,
  AddWorkpackageStepAction,
  ChangeChartViewAction,
  ClearWorkingPlanAction,
  GenerateWorkpackageAction,
  GenerateWorkpackageStepAction,
  InitCompareAction,
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
import {
  chartDateViewSelector,
  getCurrentComparingObjectSelector,
  getLastAddedNodesListSelector,
  isCompareMode,
  isWorkingPlanInitializingSelector,
  isWorkingPlanLoadedSelector,
  isWorkingPlanMovingSelector,
  isWorkingPlanProcessingSelector,
  workingPlanStateSelector,
  workpackagesSortOptionSelector,
  workpackageToRemoveSelector
} from './selectors';
import { ChartDateViewType, WorkingPlanState, WorkpackageEntries } from './working-plan.reducer';
import { Workpackage, WorkpackageStep } from './models/workpackage-step.model';
import { Item } from '../../core/shared/item.model';

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

export interface WpStateIds {
  workingplanId: string;
  baseWorkingplanId?: string;
  comparingWorkingplanId?: string;
  selectedWorkingplanId?: string;
  activeWorkingplanId?: string;
}

@Injectable()
export class WorkingPlanStateService {

  constructor(private store: Store<AppState>) {

  }

  public dispatchCleanState() {
    this.store.dispatch(new ClearWorkingPlanAction());
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

  public dispatchAddWorkpackageAction(projectId: string, itemId: string, workspaceItemId: string, place: string): void {
    this.store.dispatch(new AddWorkpackageAction(projectId, itemId, workspaceItemId, place));
  }

  public dispatchGenerateWorkpackageStep(
    projectId: string,
    parentId: string,
    workpackageStepType: string,
    metadata: MetadataMap
  ): void {
    this.store.dispatch(new GenerateWorkpackageStepAction(projectId, parentId, workpackageStepType, metadata));
  }

  public dispatchInitCompare(baseWorkingPlanId: string, comparingWorkingPLanId: string, selectedWorkingPlanId: string, activeWorkingPlanId: string) {
    this.store.dispatch(new InitCompareAction(baseWorkingPlanId, comparingWorkingPLanId, selectedWorkingPlanId, activeWorkingPlanId));
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

  public dispatchRetrieveAllWorkpackages(projectId: string, workingplan: Item, sortOption: string, readMode: boolean): void {
    this.store.dispatch(new RetrieveAllLinkedWorkingPlanObjectsAction(projectId, workingplan, sortOption, readMode));
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

  public isCompareModeActive() {
    return this.store.pipe(select(isCompareMode));
  }

  /**
   * Returns the current working plan selected for comparison.
   *
   * @return {Observable<string>}
   */
  public getCurrentComparingWorkingPlan(): Observable<WpStateIds> {
    return this.store.select(getCurrentComparingObjectSelector);
  }

  public getWorkpackages(): Observable<Workpackage[]> {
    return this.store.pipe(
      select(workingPlanStateSelector),
      filter((workingplanState: WorkingPlanState) => workingplanState.loaded),
      map((workingplanState: WorkingPlanState) => workingplanState.workpackages),
      map((entries: WorkpackageEntries) => Object.keys(entries).map((key) => entries[key])),
      startWith([]),
      distinctUntilChanged()
    );
  }

  public getWorkpackageToRemoveId() {
    return this.store.pipe(select(workpackageToRemoveSelector));
  }

  public getWorkpackagesSortOption() {
    return this.store.pipe(select(workpackagesSortOptionSelector));
  }

  public getLastAddedNodesList(): Observable<string[]> {
    return this.store.pipe(select(getLastAddedNodesListSelector));
  }

  public isInitializing(): Observable<boolean> {
    return this.store.pipe(select(isWorkingPlanInitializingSelector));
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
