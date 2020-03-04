import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { GenerateWorkpackageAction, RetrieveAllWorkpackagesAction } from './working-plan.actions';
import { MetadataMap } from '../shared/metadata.models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/internal/Observable';
import { isWorkingPlanLoadedSelector, isWorkingPlanProcessingSelector } from './selectors';
import { map } from 'rxjs/operators';

@Injectable()
export class WorkingPlanStateService {

  constructor(private store: Store<AppState>) {

  }

  public dispatchGenerateWorkpackage(metadata: MetadataMap, modal?: NgbActiveModal): void {
    this.store.dispatch(new GenerateWorkpackageAction(metadata, modal))
  }

  public dispatchRetrieveAllWorkpackages(): void {
    this.store.dispatch(new RetrieveAllWorkpackagesAction(null))
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
