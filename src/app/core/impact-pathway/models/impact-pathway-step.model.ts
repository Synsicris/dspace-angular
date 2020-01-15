import { findIndex, remove, uniqueId } from 'lodash';

import { ImpactPathwayStepType } from './impact-pathway-step-type';
import { ImpactPathwayTask } from './impact-pathway-task.model';

export class ImpactPathwayStep {
  public id: string;

  constructor(
    public parentId: string,
    public type: ImpactPathwayStepType,
    public tasks: ImpactPathwayTask[] = [],
    public connectedSteps: string[] = []) {

    this.id = uniqueId(this.parentId);
  };

  hasTask(task: ImpactPathwayTask) {
    return (findIndex(this.tasks, { id: task.id }) !== -1);
  }

  addTask(task: ImpactPathwayTask) {
    task.parentId = this.id;
    this.tasks.push(task);
  }

  removeTask(task: ImpactPathwayTask) {
    this.tasks = remove(this.tasks, (innerTask) => {
      return innerTask.id !== task.id;
    });
  }
}
