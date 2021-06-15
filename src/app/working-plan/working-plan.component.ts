import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Workpackage } from './core/models/workpackage-step.model';
import { WorkingPlanStateService } from './core/working-plan-state.service';

@Component({
  selector: 'ipw-working-plan',
  templateUrl: './working-plan.component.html',
  styleUrls: ['./working-plan.component.scss'],
})
export class WorkingPlanComponent {

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
    return this.workingPlanStateService.getWorkpackages();
  }

  public isLoading(): Observable<boolean> {
    return this.workingPlanStateService.isLoading();
  }

}
