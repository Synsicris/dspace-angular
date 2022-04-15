import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { Workpackage } from '../core/models/workpackage-step.model';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ipw-working-plan-chart',
  templateUrl: './working-plan-chart.component.html',
  styleUrls: ['./working-plan-chart.component.scss'],
})
export class WorkingPlanChartComponent {

  /**
   * The current project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * The working Plan item
   */
  @Input() workingPlan: Item;

  /**
   * Array containing a list of Workpackage object
   */
  @Input() public workpackages: Observable<Workpackage[]>;

  /**
   * The collection id for workpackage entity in the given project
   */
  @Input() public workPackageCollectionId: string;

  /**
   * The collection id for milestone entity in the given project
   */
  @Input() public milestoneCollectionId: string;

  /**
   * A boolean representing if compare mode is active
   */
  @Input() public compareMode: Observable<boolean>;

}
