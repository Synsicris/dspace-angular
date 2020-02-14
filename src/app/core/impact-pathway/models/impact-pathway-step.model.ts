import { findIndex, remove } from 'lodash';
import { ImpactPathwayTask } from './impact-pathway-task.model';

export class ImpactPathwayStep {

  constructor(
    public parentId?: string,
    public id?: string,
    public type?: string,
    public title?: string,
    public tasks: ImpactPathwayTask[] = [],
    public connectedSteps: string[] = []) {

  };

  hasDetail() {
    return this.type === 'step_type_2' || this.type === 'step_type_3';
  }

  hasTask(taskId: string) {
    return (findIndex(this.tasks, { id: taskId }) !== -1);
  }

  getTask(taskId: string): ImpactPathwayTask {
    let step = null;
    const index = this.getTaskIndex(taskId);
    if (index !== -1) {
      step = this.tasks[index];
    }

    return step
  }

  getTaskIndex(taskId: string): number {
    return findIndex(this.tasks, { id: taskId });
  }

  removeTask(taskId: string) {
    this.tasks = remove(this.tasks, (innerTask) => {
      return innerTask.id !== taskId;
    });
  }

  replaceTask(taskId: string, newTask: ImpactPathwayTask) {
    const index = this.getTaskIndex(taskId);
    this.tasks[index] = newTask;
  }
}
