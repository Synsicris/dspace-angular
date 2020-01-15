import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { catchError, combineLatest, flatMap, map, switchMap, take } from 'rxjs/operators';
import { findIndex, uniqueId } from 'lodash';

import { ImpactPathway } from './models/impact-pathway.model';
import { ImpactPathwayStep } from './models/impact-pathway-step.model';
import { ImpactPathwayStepType } from './models/impact-pathway-step-type';
import { ImpactPathwayTask } from './models/impact-pathway-task.model';
import { ImpactPathwayTaskType } from './models/impact-pathway-task-type';
import { ImpactPathwayTaskItem } from './models/impact-pathway-task-item.model';
import { isEmpty, isNotNull, isUndefined } from '../../shared/empty.util';
import { ExploitationPlanType } from './models/exploitation-plan-type';
import { ItemDataService } from '../data/item-data.service';
import { SubmissionService } from '../../submission/submission.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { SubmissionObject } from '../submission/models/submission-object.model';
import { SubmissionJsonPatchOperationsService } from '../submission/submission-json-patch-operations.service';
import { JsonPatchOperationsBuilder } from '../json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../json-patch/builder/json-patch-operation-path-combiner';

@Injectable()
export class ImpactPathwayService {

  private _stepIds: string[] = ['sidebar-object-list'];
  private _impactPathways: ImpactPathway[] = [];
  private _impactPathwayTasks: ImpactPathwayTask[] = [];
  private _impactPathwayTasks$: BehaviorSubject<ImpactPathwayTask[]> = new BehaviorSubject<ImpactPathwayTask[]>(null);
  private _currentSelectedTask: BehaviorSubject<ImpactPathwayTask> = new BehaviorSubject<ImpactPathwayTask>(null);
  private _stepTaskTypeMap: Map<ImpactPathwayStepType, ImpactPathwayTaskType[]> = new Map(
    [
      [ImpactPathwayStepType.Type1, [ImpactPathwayTaskType.Type1]],
      [ImpactPathwayStepType.Type2, [ImpactPathwayTaskType.Type2, ImpactPathwayTaskType.Type3]],
      [ImpactPathwayStepType.Type3, [ImpactPathwayTaskType.Type2, ImpactPathwayTaskType.Type3]],
      [ImpactPathwayStepType.Type4, [ImpactPathwayTaskType.Type4, ImpactPathwayTaskType.Type5]],
      [ImpactPathwayStepType.Type5, [ImpactPathwayTaskType.Type4, ImpactPathwayTaskType.Type5]],
      [ImpactPathwayStepType.Type6, [
        ImpactPathwayTaskType.Type1,
        ImpactPathwayTaskType.Type2,
        ImpactPathwayTaskType.Type3,
        ImpactPathwayTaskType.Type4,
        ImpactPathwayTaskType.Type5,
        ImpactPathwayTaskType.Type6]
      ],
    ]
  );
  private _allStepType: ImpactPathwayTaskType[] = [
    ImpactPathwayTaskType.Type1,
    ImpactPathwayTaskType.Type2,
    ImpactPathwayTaskType.Type3,
    ImpactPathwayTaskType.Type4,
    ImpactPathwayTaskType.Type5,
    ImpactPathwayTaskType.Type6
  ];

  constructor(
    @Inject(GLOBAL_CONFIG) protected config: GlobalConfig,
    private itemService: ItemDataService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private operationsService: SubmissionJsonPatchOperationsService,
    private submissionService: SubmissionService
  ) {
    if (isEmpty(this._impactPathways)) {
      /*      const count: number = Math.floor(Math.random() * 5);

            for (let i = 0; i <= count; i++) {
              this._impactPathways.push(this.initImpactPathway(`impact-path-way-${i + 1}`));
            }*/
      this._impactPathways.push(this.initImpactPathway(`impact-path-way-1`));
    }
    if (isEmpty(this._impactPathwayTasks)) {
      const count: number = Math.floor(Math.random() * 15);

      for (let i = 0; i < 6; i++) {
        for (let j = 1; j < 4; j++) {
          this._impactPathwayTasks.push(this.instantiateImpactPathwayTask(i, j));
        }
      }
      this._impactPathwayTasks$.next(this._impactPathwayTasks);
    }

    if (this._stepIds.length === 1) {
      this._impactPathways.forEach((impactPathway: ImpactPathway) => {
        // this._stepIds.push(impactPathway.mainStep.id);
        impactPathway.steps.forEach((step: ImpactPathwayStep) => {
          this._stepIds.push(step.id);
        });
      });
    }
  }

  getImpactPathWays(): ImpactPathWay[] {
    return this._impactPathWays;
  }

  getImpactPathwayById(id: string): ImpactPathway {
    const index = findIndex(this._impactPathways, { id });
    return this._impactPathways[index];
  }

  getAvailableImpactPathwayTasks(): Observable<ImpactPathwayTask[]> {
    return this._impactPathwayTasks$;
  }

  getAvailableImpactPathwayTasksByStepType(stepType: ImpactPathwayStepType): Observable<ImpactPathwayTask[]> {
    const typeList = this.getAvailableTaskTypeByStep(stepType);
    return this._impactPathwayTasks$.pipe(
      map((taskList: ImpactPathwayTask[]) => {
        return taskList.filter(
          (task: ImpactPathwayTask) => isEmpty(typeList) || typeList.includes(task.type)
        )
      })
    );
  }

  getImpactPathwayStepById(id: string): ImpactPathwayStep {
    const impactPathways = this._impactPathways
      .filter((impactPathway) => impactPathway.hasStep(id));

    const index = findIndex(impactPathways[0].steps, { id });
    if (index === -1) {
      return impactPathways[0].mainStep;
    } else {
      return impactPathways[0].steps[index];
    }
  }

  getAvailableImpactPathwayStepIds(): string[] {
    return this._stepIds;
  }

  getAvailableTaskTypeByStep(stepType: ImpactPathwayStepType): ImpactPathwayTaskType[] {
    return (isUndefined(stepType)) ? this._allStepType : this._stepTaskTypeMap.get(stepType);
  }

  initImpactPathway(title: string, steps: ImpactPathwayStep[] = []): ImpactPathway {
    const impacPathwayId = uniqueId();
    return new ImpactPathway(impacPathwayId, title, this.initImpactPathwaySteps(impacPathwayId))
  }

  initImpactPathwaySteps(impacPathwayId: string): ImpactPathwayStep[] {
    const steps: ImpactPathwayStep[] = [
      new ImpactPathwayStep(impacPathwayId, ImpactPathwayStepType.Type1),
      new ImpactPathwayStep(impacPathwayId, ImpactPathwayStepType.Type2),
      new ImpactPathwayStep(impacPathwayId, ImpactPathwayStepType.Type3),
      new ImpactPathwayStep(impacPathwayId, ImpactPathwayStepType.Type4),
      new ImpactPathwayStep(impacPathwayId, ImpactPathwayStepType.Type5),
      new ImpactPathwayStep(impacPathwayId, ImpactPathwayStepType.Type6),
    ];

    /*    steps.forEach((step: ImpactPathwayStep) => {
          const count: number = Math.floor(Math.random() * 4);
          const tasks: ImpactPathwayTask[] = [];

          this._stepIds.push(step.id);
          for (let i = 0; i < count; i++) {
            tasks.push(this.instantiateImpactPathwayTask(step.id));
          }
          step.tasks = tasks;
        });*/

    return steps;
  }

  instantiateImpactPathwayTask(index: number, innerIndex: number, parentId?: string): ImpactPathwayTask {
    const type: ImpactPathwayTaskType = this.generateRandomTaskType(index);
    const task = new ImpactPathwayTask(type, parentId);
    task.item.title = `${type.toString()} ${innerIndex}`;

    return task;
  }

  generateRandomTaskType(index: number): ImpactPathwayTaskType {
    let type: ImpactPathwayTaskType;

    switch (index) {
      case 0:
        type = ImpactPathwayTaskType.Type1;
        break;
      case 1:
        type = ImpactPathwayTaskType.Type2;
        break;
      case 2:
        type = ImpactPathwayTaskType.Type3;
        break;
      case 3:
        type = ImpactPathwayTaskType.Type4;
        break;
      case 4:
        type = ImpactPathwayTaskType.Type5;
        break;
      case 5:
        type = ImpactPathwayTaskType.Type6;
        break;
    }

    return type;
  }

  setSelectedTask(task: ImpactPathwayTask): void {
    this._currentSelectedTask.next(task);
  }

  getSelectedTask(): Observable<ImpactPathwayTask> {
    return this._currentSelectedTask;
  }

  removeTaskFromStep(task: ImpactPathwayTask): void {
    const step = this.getImpactPathwayStepById(task.parentId);
    step.removeTask(task);
  }

  createNewImpactPathway() {
    const index = this._impactPathways.length + 1;
    const impactPathway = this.initImpactPathway(`impact-path-way-${index}`);
    this._impactPathways.push(impactPathway);
    // this._stepIds.push(impactPathway.mainStep.id);
    impactPathway.steps.forEach((step: ImpactPathwayStep) => {
      this._stepIds.push(step.id);
    });
  }

  createNewTask(
    stepId: string,
    type: ImpactPathwayTaskType,
    title: string,
    description: string,
    exploitationPlans: ExploitationPlanType[],
    note: string): void {

    const task: ImpactPathwayTask = new ImpactPathwayTask(type, null, null, description, title, exploitationPlans);
    this._impactPathwayTasks.push(task);
    this._impactPathwayTasks$.next(this._impactPathwayTasks);
    const cloneItem: any = Object.assign(new ImpactPathwayTask(), task, {
      item: new ImpactPathwayTaskItem(task.id, type, title, note)
    });

    const step = this.getImpactPathwayStepById(stepId);
    step.addTask(cloneItem);
  }

  cloneTask(task: ImpactPathwayTask, parentId: string): ImpactPathwayTask {
    const cloneTask: ImpactPathwayTask = Object.assign(new ImpactPathwayTask(), task, {
      item: new ImpactPathwayTaskItem(task.id, task.item.type, task.item.title)
    });
    cloneTask.parentId = parentId;

    return cloneTask
  }

  addTaskToStep(task: ImpactPathwayTask) {
    const cloneItem: any = Object.assign(new ImpactPathwayTask(), task, {
      item: new ImpactPathwayTaskItem(task.id, task.item.type, task.item.title)
    });

  }
}
