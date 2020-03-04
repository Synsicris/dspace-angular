import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { WorkingPlanService } from '../core/working-plan/working-plan.service';
import { Workpackage } from '../core/working-plan/models/workpackage-step.model';
import { WorkingPlanStateService } from '../core/working-plan/working-plan-state.service';

@Component({
  selector: 'ipw-working-plan',
  templateUrl: './working-plan.component.html',
  styleUrls: ['./working-plan.component.scss'],
})
export class WorkingPlanComponent {
  constructor(
    private workingPlanService: WorkingPlanService,
    private workingPlanStateService: WorkingPlanStateService
  ) {
  }

  ngAfterViewInit(): void {
    this.workingPlanStateService.isWorkingPlanLoaded().pipe(
      take(1)
    ).subscribe(() => {
      this.workingPlanStateService.dispatchRetrieveAllWorkpackages();
    })
  }

  public getWorkpackages(): Observable<Workpackage[]> {
    return this.workingPlanService.getWorkpackages().pipe(
      tap((list) => console.log(list))
    );
  }

  public isLoading(): Observable<boolean> {
    return this.workingPlanStateService.isLoading();
  }

}
