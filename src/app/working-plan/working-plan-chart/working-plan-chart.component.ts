import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { Workpackage } from '../../core/working-plan/models/workpackage-step.model';

@Component({
  selector: 'ipw-working-plan-chart',
  templateUrl: './working-plan-chart.component.html',
  styleUrls: ['./working-plan-chart.component.scss'],
})
export class WorkingPlanChartComponent {
  @Input() workpackages: Observable<Workpackage[]>;

}
