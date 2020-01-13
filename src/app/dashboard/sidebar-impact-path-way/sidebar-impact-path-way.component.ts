import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { ImpactPathWay } from '../models/impact-path-way.model';
import { ImpactPathWayTask } from '../models/impact-path-way-task.model';

@Component({
  selector: 'ipw-sidebar-impact-path-way',
  styleUrls: ['./sidebar-impact-path-way.component.scss'],
  templateUrl: './sidebar-impact-path-way.component.html'
})
export class SidebarImpactPathWayComponent {

  @Input() public impactPathWays: ImpactPathWay[];
  @Input() public availableTaskList$: Observable<ImpactPathWayTask[]>;
  @Input() public selectedTask$: Observable<ImpactPathWayTask>;

  public activeIds: string[];

}
