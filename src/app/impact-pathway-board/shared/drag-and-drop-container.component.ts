import { Component, OnDestroy } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Subscription } from 'rxjs';

import { ImpactPathwayTask } from '../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';
import { hasValue } from '../../shared/empty.util';

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

  canDrop(parent: ImpactPathwayTask, task: ImpactPathwayTask) {
    return !parent.hasSubTask(task.id) || task.parentId === parent.id;
  }

  dragEntered(event: CdkDragEnter<any>) {
    this.isDragging.next(true);
    if (this.canDrop(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  dragExited(task: CdkDragExit<ImpactPathwayTask>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  listEntered(event: CdkDragEnter<any>) {
    this.isDragging.next(true);
    if (this.canDrop(event.container.data, event.item.data)) {
      this.isDropAllowed.next(true);
    }
  }

  listExited(event: CdkDragExit<any>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  listDropped(task: CdkDragDrop<ImpactPathwayTask>) {
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
