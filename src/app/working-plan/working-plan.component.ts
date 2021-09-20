import { Component, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Workpackage } from './core/models/workpackage-step.model';
import { WorkingPlanStateService } from './core/working-plan-state.service';

@Component({
  selector: 'ipw-working-plan',
  templateUrl: './working-plan.component.html',
  styleUrls: ['./working-plan.component.scss'],
})
export class WorkingPlanComponent implements OnDestroy {

  @Input() public projectId: string;

  constructor(private workingPlanStateService: WorkingPlanStateService) {
  }

  ngAfterViewInit(): void {
    this.workingPlanStateService.isWorkingPlanLoaded().pipe(
      take(1)
    ).subscribe(() => {
      this.workingPlanStateService.dispatchRetrieveAllWorkpackages(this.projectId, environment.workingPlan.workingPlanPlaceMetadata);
    });
  }

  public getWorkpackages(): Observable<Workpackage[]> {
    return this.workingPlanStateService.getWorkpackages().pipe(
      distinctUntilChanged((curr, prev) => curr.length === prev.length)
    );
  }

  public isLoading(): Observable<boolean> {
    return this.workingPlanStateService.isLoading();
  }

  ngOnDestroy(): void {
    this.workingPlanStateService.dispatchCleanState();
  }

}
