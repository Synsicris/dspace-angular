import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathWayStep } from '../../../models/impact-path-way-step.model';
import { DashboardService } from '../../../dashboard.service';
import { fadeInOut } from '../../../../shared/animations/fade';
import { ImpactPathWayTaskModalComponent } from '../impact-path-way-task/impact-path-way-task-modal/impact-path-way-task-modal.component';
import { ImpactPathWayTask } from '../../../models/impact-path-way-task.model';
import { SearchTaskService } from '../../../search-task/search-task.service';
import { DragAndDropContainerComponent } from '../../../shared/drag-and-drop-container.component';

@Component({
  selector: 'ipw-impact-path-way-step',
  styleUrls: ['../../../shared/drag-and-drop-container.component.scss'],
  templateUrl: './impact-path-way-step.component.html',
  animations: [
    fadeInOut
  ]
})
export class ImpactPathWayStepComponent extends DragAndDropContainerComponent {

  @Input() public data: ImpactPathWayStep;
  @Input() public isVertical = true;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected searchTaskService: SearchTaskService,
    protected service: DashboardService,
    protected modalService: NgbModal) {

    super(service);
  }

  drop(event: CdkDragDrop<ImpactPathWayStep>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.tasks, event.previousIndex, event.currentIndex);
    } else {
      if (this.canDrop(event.container.data, event.item.data)) {
        transferArrayItem(event.previousContainer.data.tasks,
          event.container.data.tasks,
          event.previousIndex,
          event.currentIndex);
      }
    }
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  createTask() {
    this.searchTaskService.resetAppliedFilters();
    const modalRef = this.modalService.open(ImpactPathWayTaskModalComponent, { size: 'lg' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, (reject) => null);
    modalRef.componentInstance.step = this.data;
  }

  onTaskSelected($event: ImpactPathWayTask) {
    this.service.setSelectedTask($event)
  }
}
