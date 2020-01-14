import { findIndex, remove, uniqueId } from 'lodash';

import { ImpactPathWayStepType } from './impact-path-way-step-type';
import { ImpactPathWayTask } from './impact-path-way-task.model';

export class ImpactPathWayStep {
  public id: string;

  constructor(
    public parentId: string,
    public type: ImpactPathWayStepType,
    public tasks: ImpactPathWayTask[] = [],
    public connectedSteps: string[] = []) {

    this.id = uniqueId(this.parentId);
  };

  hasTask(task: ImpactPathWayTask) {
    return (findIndex(this.tasks, { id: task.id }) !== -1);
  }

  addTask(task: ImpactPathWayTask) {
    task.parentId = this.id;
    this.tasks.push(task);
  }

  removeTask(task: ImpactPathWayTask) {
    this.tasks = remove(this.tasks, (innerTask) => {
      return innerTask.id !== task.id;
    });
  }
}
