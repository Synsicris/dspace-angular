import { Injectable } from '@angular/core';

import { findIndex, uniqueId } from 'lodash';

import { ImpactPathWay } from './models/impact-path-way.model';
import { ImpactPathWayStep } from './models/impact-path-way-step.model';
import { ImpactPathWayStepType } from './models/impact-path-way-step-type';
import { ImpactPathWayTask } from './models/impact-path-way-task.model';
import { ImpactPathWayTaskType } from './models/impact-path-way-task-type';
import { ImpactPathWayTaskItem } from './models/impact-path-way-task-item.model';
import { isEmpty, isUndefined } from '../../shared/empty.util';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { ExploitationPlanType } from './models/exploitation-plan-type';
import { map } from 'rxjs/operators';

@Injectable()
export class ImpactPathwayService {

  private _stepIds: string[] = ['sidebar-object-list'];
  private _impactPathWays: ImpactPathWay[] = [];
  private _impactPathWayTasks: ImpactPathWayTask[] = [];
  private _impactPathWayTasks$: BehaviorSubject<ImpactPathWayTask[]> = new BehaviorSubject<ImpactPathWayTask[]>(null);
  private _currentSelectedTask: BehaviorSubject<ImpactPathWayTask> = new BehaviorSubject<ImpactPathWayTask>(null);
  private _stepTaskTypeMap: Map<ImpactPathWayStepType, ImpactPathWayTaskType[]> = new Map(
    [
      [ImpactPathWayStepType.Type1, [ImpactPathWayTaskType.Type1]],
      [ImpactPathWayStepType.Type2, [ImpactPathWayTaskType.Type2, ImpactPathWayTaskType.Type3]],
      [ImpactPathWayStepType.Type3, [ImpactPathWayTaskType.Type2, ImpactPathWayTaskType.Type3]],
      [ImpactPathWayStepType.Type4, [ImpactPathWayTaskType.Type4, ImpactPathWayTaskType.Type5]],
      [ImpactPathWayStepType.Type5, [ImpactPathWayTaskType.Type4, ImpactPathWayTaskType.Type5]],
      [ImpactPathWayStepType.Type6, [
        ImpactPathWayTaskType.Type1,
        ImpactPathWayTaskType.Type2,
        ImpactPathWayTaskType.Type3,
        ImpactPathWayTaskType.Type4,
        ImpactPathWayTaskType.Type5,
        ImpactPathWayTaskType.Type6]
      ],
    ]
  );
  private _allStepType: ImpactPathWayTaskType[] = [
    ImpactPathWayTaskType.Type1,
    ImpactPathWayTaskType.Type2,
    ImpactPathWayTaskType.Type3,
    ImpactPathWayTaskType.Type4,
    ImpactPathWayTaskType.Type5,
    ImpactPathWayTaskType.Type6
  ];

  constructor() {
    if (isEmpty(this._impactPathWays)) {
      /*      const count: number = Math.floor(Math.random() * 5);

            for (let i = 0; i <= count; i++) {
              this._impactPathWays.push(this.initImpactPathWay(`impact-path-way-${i + 1}`));
            }*/
      this._impactPathWays.push(this.initImpactPathWay(`impact-path-way-1`));
    }
    if (isEmpty(this._impactPathWayTasks)) {
      const count: number = Math.floor(Math.random() * 15);

      for (let i = 0; i < 6; i++) {
        for (let j = 1; j < 4; j++) {
          this._impactPathWayTasks.push(this.instantiateImpactPathWayTask(i, j));
        }
      }
      this._impactPathWayTasks$.next(this._impactPathWayTasks);
    }

    if (this._stepIds.length === 1) {
      this._impactPathWays.forEach((impactPathWay: ImpactPathWay) => {
        // this._stepIds.push(impactPathWay.mainStep.id);
        impactPathWay.steps.forEach((step: ImpactPathWayStep) => {
          this._stepIds.push(step.id);
        });
      });
    }
  }

  getImpactPathWays(): ImpactPathWay[] {
    return this._impactPathWays;
  }

  getImpactPathWayById(id: string): ImpactPathWay {
    const index = findIndex(this._impactPathWays, { id });
    return this._impactPathWays[index];
  }

  getAvailableImpactPathWayTasks(): Observable<ImpactPathWayTask[]> {
    return this._impactPathWayTasks$;
  }

  getAvailableImpactPathWayTasksByStepType(stepType: ImpactPathWayStepType): Observable<ImpactPathWayTask[]> {
    const typeList = this.getAvailableTaskTypeByStep(stepType);
    return this._impactPathWayTasks$.pipe(
      map((taskList: ImpactPathWayTask[]) => {
        return taskList.filter(
          (task: ImpactPathWayTask) => isEmpty(typeList) || typeList.includes(task.type)
        )
      })
    );
  }

  getImpactPathWayStepById(id: string): ImpactPathWayStep {
    const impactPathWays = this._impactPathWays
      .filter((impactPathWay) => impactPathWay.hasStep(id));

    const index = findIndex(impactPathWays[0].steps, { id });
    if (index === -1) {
      return impactPathWays[0].mainStep;
    } else {
      return impactPathWays[0].steps[index];
    }
  }

  getAvailableImpactPathWayStepIds(): string[] {
    return this._stepIds;
  }

  getAvailableTaskTypeByStep(stepType: ImpactPathWayStepType): ImpactPathWayTaskType[] {
    return (isUndefined(stepType)) ? this._allStepType : this._stepTaskTypeMap.get(stepType);
  }

  initImpactPathWay(title: string, steps: ImpactPathWayStep[] = []): ImpactPathWay {
    const impacPathWayId = uniqueId();
    return new ImpactPathWay(impacPathWayId, title, this.initImpactPathWaySteps(impacPathWayId))
  }

  initImpactPathWaySteps(impacPathWayId: string): ImpactPathWayStep[] {
    const steps: ImpactPathWayStep[] = [
      new ImpactPathWayStep(impacPathWayId, ImpactPathWayStepType.Type1),
      new ImpactPathWayStep(impacPathWayId, ImpactPathWayStepType.Type2),
      new ImpactPathWayStep(impacPathWayId, ImpactPathWayStepType.Type3),
      new ImpactPathWayStep(impacPathWayId, ImpactPathWayStepType.Type4),
      new ImpactPathWayStep(impacPathWayId, ImpactPathWayStepType.Type5),
      new ImpactPathWayStep(impacPathWayId, ImpactPathWayStepType.Type6),
    ];

    /*    steps.forEach((step: ImpactPathWayStep) => {
          const count: number = Math.floor(Math.random() * 4);
          const tasks: ImpactPathWayTask[] = [];

          this._stepIds.push(step.id);
          for (let i = 0; i < count; i++) {
            tasks.push(this.instantiateImpactPathWayTask(step.id));
          }
          step.tasks = tasks;
        });*/

    return steps;
  }

  instantiateImpactPathWayTask(index: number, innerIndex: number, parentId?: string): ImpactPathWayTask {
    const type: ImpactPathWayTaskType = this.generateRandomTaskType(index);
    const task = new ImpactPathWayTask(type, parentId);
    task.item.title = `${type.toString()} ${innerIndex}`;

    return task;
  }

  generateRandomTaskType(index: number): ImpactPathWayTaskType {
    let type: ImpactPathWayTaskType;

    switch (index) {
      case 0:
        type = ImpactPathWayTaskType.Type1;
        break;
      case 1:
        type = ImpactPathWayTaskType.Type2;
        break;
      case 2:
        type = ImpactPathWayTaskType.Type3;
        break;
      case 3:
        type = ImpactPathWayTaskType.Type4;
        break;
      case 4:
        type = ImpactPathWayTaskType.Type5;
        break;
      case 5:
        type = ImpactPathWayTaskType.Type6;
        break;
    }

    return type;
  }

  setSelectedTask(task: ImpactPathWayTask): void {
    this._currentSelectedTask.next(task);
  }

  getSelectedTask(): Observable<ImpactPathWayTask> {
    return this._currentSelectedTask;
  }

  removeTaskFromStep(task: ImpactPathWayTask): void {
    const step = this.getImpactPathWayStepById(task.parentId);
    step.removeTask(task);
  }

  createNewImpactPathWay() {
    const index = this._impactPathWays.length + 1;
    const impactPathWay = this.initImpactPathWay(`impact-path-way-${index}`);
    this._impactPathWays.push(impactPathWay);
    // this._stepIds.push(impactPathWay.mainStep.id);
    impactPathWay.steps.forEach((step: ImpactPathWayStep) => {
      this._stepIds.push(step.id);
    });
  }

  createNewTask(
    stepId: string,
    type: ImpactPathWayTaskType,
    title: string,
    description: string,
    exploitationPlans: ExploitationPlanType[],
    note: string): void {

    const task: ImpactPathWayTask = new ImpactPathWayTask(type, null, null, description, title, exploitationPlans);
    this._impactPathWayTasks.push(task);
    this._impactPathWayTasks$.next(this._impactPathWayTasks);
    const cloneItem: any = Object.assign(new ImpactPathWayTask(), task, {
      item: new ImpactPathWayTaskItem(task.id, type, title, note)
    });

    const step = this.getImpactPathWayStepById(stepId);
    step.addTask(cloneItem);
  }

  cloneTask(task: ImpactPathWayTask, parentId: string): ImpactPathWayTask {
    const cloneTask: ImpactPathWayTask = Object.assign(new ImpactPathWayTask(), task, {
      item: new ImpactPathWayTaskItem(task.id, task.item.type, task.item.title)
    });
    cloneTask.parentId = parentId;

    return cloneTask
  }

  addTaskToStep(task: ImpactPathWayTask) {
    const cloneItem: any = Object.assign(new ImpactPathWayTask(), task, {
      item: new ImpactPathWayTaskItem(task.id, task.item.type, task.item.title)
    });

  }
}
