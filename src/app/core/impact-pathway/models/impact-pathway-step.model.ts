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

  hasTask(task: ImpactPathwayTask) {
    return (findIndex(this.tasks, { id: task.id }) !== -1);
  }

  addTask(task: ImpactPathwayTask) {
    // task.parentId = this.id;
    this.tasks.push(task);
  }

  removeTask(task: ImpactPathwayTask) {
    this.tasks = remove(this.tasks, (innerTask) => {
      return innerTask.id !== task.id;
    });
  }
}
