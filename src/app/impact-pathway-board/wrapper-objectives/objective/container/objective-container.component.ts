import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { ImpactPathwayTask } from '../../../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathWayTaskModalComponent } from '../../../wrapper-impact-path-way/impact-path-way/impact-path-way-task/impact-path-way-task-modal/impact-path-way-task-modal.component';
import { SearchTaskService } from '../../../search-task/search-task.service';
import { ImpactPathwayService } from '../../../../core/impact-pathway/impact-pathway.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DragAndDropContainerComponent } from '../../../shared/drag-and-drop-container.component';

@Component({
  selector: 'ipw-objective-container',
  styleUrls: ['./objective-container.component.scss'],
  templateUrl: './objective-container.component.html'
})
export class ObjectiveContainerComponent extends DragAndDropContainerComponent {

  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public impactPathwayTask: ImpactPathwayTask;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected searchTaskService: SearchTaskService,
    protected service: ImpactPathwayService,
    protected modalService: NgbModal) {

    super(service);
  }

  createTask() {
    this.searchTaskService.resetAppliedFilters();
    const modalRef = this.modalService.open(ImpactPathWayTaskModalComponent, { size: 'lg' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, (reject) => null);
    modalRef.componentInstance.step = this.impactPathwayStep;
    modalRef.componentInstance.parentTask = this.impactPathwayTask;
    modalRef.componentInstance.isObjectivePage = true;
  }

}
