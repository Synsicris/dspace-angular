import { Component, OnDestroy } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragStart } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Subscription } from 'rxjs';

import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { hasValue } from '../../shared/empty.util';
import { ImpactPathwayStep } from '../../core/impact-pathway/models/impact-pathway-step.model';

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

  constructor(protected service: ImpactPathwayService) {
  }

  canDropOnStep(parent: ImpactPathwayStep, task: ImpactPathwayTask) {
    return task.parentId === parent.id;
  }

  canDropOnTask(parent: ImpactPathwayTask, task: ImpactPathwayTask) {
    return !parent.hasSubTask(task.id) || task.parentId === parent.id;
  }

  dragStarted(event: CdkDragStart<ImpactPathwayTask>) {
    this.isDragging.next(true);
    if (this.canDropOnStep(event.source.dropContainer.data, event.source.data)) {
      this.isDropAllowed.next(true);
    }
  }

  dragEnteredToTask(event: CdkDragEnter<ImpactPathwayTask, ImpactPathwayTask>) {
    this.isDragging.next(true);
    if (this.canDropOnTask(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  dragEnteredToStep(event: CdkDragEnter<ImpactPathwayStep, ImpactPathwayTask>) {
    this.isDragging.next(true);
    if (this.canDropOnStep(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  dragExited(task: CdkDragExit<ImpactPathwayTask>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  listEnteredToTask(event: CdkDragEnter<ImpactPathwayTask, ImpactPathwayTask>) {
    this.isDragging.next(true);
    if (this.canDropOnTask(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  listEnteredToStep(event: CdkDragEnter<ImpactPathwayStep, ImpactPathwayTask>) {
    this.isDragging.next(true);
    if (this.canDropOnStep(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  listExited(event: CdkDragExit<ImpactPathwayStep|ImpactPathwayTask>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  listDropped(task: CdkDragDrop<ImpactPathwayStep|ImpactPathwayTask>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
