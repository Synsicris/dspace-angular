import { Component, OnDestroy } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragStart } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Subscription } from 'rxjs';

import { QuestionsBoardTask } from '../../core/models/questions-board-task.model';
import { QuestionsBoardService } from '../../core/questions-board.service';
import { hasValue } from '../../../shared/empty.util';
import { QuestionsBoardStep } from '../../core/models/questions-board-step.model';

@Component({
  selector: 'ipw-drag-and-drop-container',
  template: ``,
})

/**
 * Represents a part of the filter section for a single type of filter
 */
export class DragAndDropContainerComponent implements OnDestroy {

  public connectedToList: string[] = [];
  public isDragging: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isDropAllowed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected subs: Subscription[] = [];

  constructor(protected service: QuestionsBoardService) {
  }

  canDropOnStep(parent: QuestionsBoardStep, task: QuestionsBoardTask) {
    return task.parentId === parent.id;
  }

  canDropOnTask(parent: QuestionsBoardTask, task: QuestionsBoardTask) {
    return true;
    // return !parent.hasSubTask(task.id) || task.parentId === parent.id;
  }

  dragStarted(event: CdkDragStart<QuestionsBoardTask>) {
    this.isDragging.next(true);
    if (this.canDropOnStep(event.source.dropContainer.data, event.source.data)) {
      this.isDropAllowed.next(true);
    }
  }

  dragEnteredToTask(event: CdkDragEnter<QuestionsBoardTask, QuestionsBoardTask>) {
    this.isDragging.next(true);
    if (this.canDropOnTask(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  dragEnteredToStep(event: CdkDragEnter<QuestionsBoardStep, QuestionsBoardTask>) {
    this.isDragging.next(true);
    if (this.canDropOnStep(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  dragExited(task: CdkDragExit<QuestionsBoardTask>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  listEnteredToTask(event: CdkDragEnter<QuestionsBoardTask, QuestionsBoardTask>) {
    this.isDragging.next(true);
    if (this.canDropOnTask(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  listEnteredToStep(event: CdkDragEnter<QuestionsBoardStep, QuestionsBoardTask>) {
    this.isDragging.next(true);
    if (this.canDropOnStep(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  listExited(event: CdkDragExit<QuestionsBoardStep|QuestionsBoardTask>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  listDropped(task: CdkDragDrop<QuestionsBoardStep|QuestionsBoardTask>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
