import { findIndex, remove } from 'lodash';

import { isNotEmpty } from '../../../shared/empty.util';
import { ImpactPathwayStep } from './impact-pathway-step.model';

export class ImpactPathwayTask {

  constructor(
    public id?: string,
    public type?: string,
    public parentId?: string,
    public title?: string,
    public description?: string,
    public tasks: ImpactPathwayTask[] = []) {
  };

  hasDetail() {
    return this.hasParent() && this.type === 'proj_objectives';
  }

  hasParent() {
    return isNotEmpty(this.parentId);
  }

  hasSubTask(taskId: string): boolean {
    return (findIndex(this.tasks, { id: taskId }) !== -1);
  }

  getSubTask(taskId: string): ImpactPathwayStep {
    let step = null;
    const index = this.getSubTaskIndex(taskId);
    if (index !== -1) {
      step = this.tasks[index];
    }

    return step
  }

  getSubTaskIndex(taskId: string): number {
    return findIndex(this.tasks, { id: taskId });
  }

  removeSubTask(taskId: string) {
    this.tasks = remove(this.tasks, (innerTask) => {
      return innerTask.id !== taskId;
    });
  }

  replaceSubTask(taskId: string, newTask: ImpactPathwayTask) {
    const index = this.getSubTaskIndex(taskId);
    this.tasks[index] = newTask;
  }

}
