import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { Workpackage } from '../../core/working-plan/models/workpackage-step.model';

@Component({
  selector: 'ipw-working-plan-chart',
  templateUrl: './working-plan-chart.component.html',
  styleUrls: ['./working-plan-chart.component.scss'],
})
export class WorkingPlanChartComponent {

  /**
   * The current project'id
   */
  @Input() public projectId: string;

  /**
   * Array containing a list of Workpackage object
   */
  @Input() public workpackages: Observable<Workpackage[]>;

}
