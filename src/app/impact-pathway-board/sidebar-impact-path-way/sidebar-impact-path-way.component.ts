import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { ImpactPathway } from '../../core/impact-pathway/models/impact-pathway.model';
import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';

@Component({
  selector: 'ipw-sidebar-impact-path-way',
  styleUrls: ['./sidebar-impact-path-way.component.scss'],
  templateUrl: './sidebar-impact-path-way.component.html'
})
export class SidebarImpactPathWayComponent {

  @Input() public impactPathWays: ImpactPathway[];
  @Input() public availableTaskList$: Observable<ImpactPathwayTask[]>;
  @Input() public selectedTask$: Observable<ImpactPathwayTask>;

  public activeIds: string[];

}
