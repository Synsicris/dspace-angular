import { findIndex, remove } from 'lodash';

import { QuestionsBoardTask } from './questions-board-task.model';

export class QuestionsBoardStep {

  constructor(
    public parentId?: string,
    public id?: string,
    public type?: string,
    public description?: string,
    public tasks: QuestionsBoardTask[] = []) {
  }

  hasTask(taskId: string) {
    return (findIndex(this.tasks, { id: taskId }) !== -1);
  }

  getTask(taskId: string): QuestionsBoardTask {
    let step = null;
    const index = this.getTaskIndex(taskId);
    if (index !== -1) {
      step = this.tasks[index];
    }

    return step;
  }

  getTasksIds(): string[] {
    return this.tasks.map((task) => task.id);
  }

  getTaskIndex(taskId: string): number {
    return findIndex(this.tasks, { id: taskId });
  }

  removeTask(taskId: string) {
    this.tasks = remove(this.tasks, (innerTask) => {
      return innerTask.id !== taskId;
    });
  }

  replaceTask(taskId: string, newTask: QuestionsBoardTask) {
    const index = this.getTaskIndex(taskId);
    this.tasks[index] = newTask;
  }

  setTasks(tasks: QuestionsBoardTask[]) {
    this.tasks = [...tasks];
  }

}
