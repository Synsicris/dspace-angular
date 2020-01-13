import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { ImpactPathWay } from './models/impact-path-way.model';
import { DashboardService } from './dashboard.service';
import { ImpactPathWayTask } from './models/impact-path-way-task.model';

@Component({
  selector: 'ipw-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public impactPathWays: ImpactPathWay[];
  public availableTaskList$: Observable<ImpactPathWayTask[]>;

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.impactPathWays = this.dashboardService.getImpactPathWays();
    this.availableTaskList$ = this.dashboardService.getAvailableImpactPathWayTasks();
  }

  /*  public tasks: ImpactPathWayTask[] = [
      new ImpactPathWayTask('impact-path-way-task-1', ImpactPathWayTaskType.Type1),
      new ImpactPathWayTask('impact-path-way-task-2', ImpactPathWayTaskType.Type2),
      new ImpactPathWayTask('impact-path-way-task-3', ImpactPathWayTaskType.Type3),
    ];

    private connectedSteps1: string[] = [
      'impact-path-way-step-1',
    ];

    private connectedSteps2: string[] = [
      'impact-path-way-step-2'
    ];

    public steps: ImpactPathWayStep[] = [
      new ImpactPathWayStep('impact-path-way-step-1', ImpactPathWayStepType.Type1, this.tasks, this.connectedSteps2),
      new ImpactPathWayStep('impact-path-way-step-2', ImpactPathWayStepType.Type2, [], this.connectedSteps1),
      new ImpactPathWayStep('impact-path-way-step-3', ImpactPathWayStepType.Type3),
      new ImpactPathWayStep('impact-path-way-step-4', ImpactPathWayStepType.Type4),
      new ImpactPathWayStep('impact-path-way-step-5', ImpactPathWayStepType.Type5),
      new ImpactPathWayStep('impact-path-way-step-6', ImpactPathWayStepType.Type6),
    ];

    public impactPathWays: ImpactPathWay[] = [
      new ImpactPathWay('impact-path-way-1', 'Impact path way 1', this.steps),
      new ImpactPathWay('impact-path-way-2', 'Impact path way 2', this.steps),
      new ImpactPathWay('impact-path-way-3', 'Impact path way 3', this.steps)
    ]*/

  public getSelectedTask(): Observable<ImpactPathWayTask> {
    return this.dashboardService.getSelectedTask();
  }
}
