import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Observable, of as observableOf } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayTask } from '../../../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../../../core/impact-pathway/impact-pathway.service';
import { DragAndDropContainerComponent } from '../../../shared/drag-and-drop-container.component';
import { CreateSimpleItemModalComponent } from '../../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../../shared/create-simple-item-modal/models/simple-item.model';

@Component({
  selector: 'ipw-objective-container',
  styleUrls: ['./objective-container.component.scss', '../../../shared/drag-and-drop-container.component.scss'],
  templateUrl: './objective-container.component.html'
})
export class ObjectiveContainerComponent extends DragAndDropContainerComponent {

  @Input() public projectId: string;
  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public impactPathwayTask: ImpactPathwayTask;

  private processing$: Observable<boolean> = observableOf(false);

  constructor(
    protected cdr: ChangeDetectorRef,
    protected impactPathwayService: ImpactPathwayService,
    protected service: ImpactPathwayService,
    protected modalService: NgbModal) {

    super(service);
  }

  ngOnInit(): void {
    this.connectedToList = this.getObjectivesTaskIds();
    this.processing$ = this.impactPathwayService.isProcessing();
  }

  drop(event: CdkDragDrop<ImpactPathwayTask>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data.tasks, event.previousIndex, event.currentIndex);
    } else {
      if (this.canDrop(event.container.data, event.item.data)) {
        this.impactPathwayService.dispatchSetTargetTask('');
        this.impactPathwayService.dispatchMoveSubTask(
          this.impactPathwayStep.parentId,
          this.impactPathwayStep.id,
          event.previousContainer.data.id,
          event.container.data.id,
          event.item.data.id);
      }
    }
    this.isDragging.next(false);
    this.isDropAllowed.next(false);
  }

  getObjectivesTaskIds(): string[] {
    return this.impactPathwayStep.tasks
      .filter((task) => task.type === 'proj_objectives')
      .map((task) => task.id)
  }

  openModal() {
    this.impactPathwayService.dispatchSetTargetTask(this.impactPathwayTask.id);
    const modalRef = this.modalService.open(CreateSimpleItemModalComponent, { size: 'lg' });

    modalRef.result.then((result) => {
      if (result) {
        this.cdr.detectChanges();
      }
    }, () => null);
    modalRef.componentInstance.formConfig = this.impactPathwayService.getImpactPathwayStepTaskFormConfig(
      this.impactPathwayStep.type,
      true
    );
    modalRef.componentInstance.processing = this.impactPathwayService.isProcessing();
    modalRef.componentInstance.excludeListId = [this.impactPathwayTask.id];
    modalRef.componentInstance.excludeFilterName = 'parentStepId';
    modalRef.componentInstance.vocabularyName = this.impactPathwayService.getTaskTypeAuthorityName(
      this.impactPathwayStep.type,
      true
    );
    modalRef.componentInstance.searchConfiguration = this.impactPathwayService.getSearchTaskConfigName(
      this.impactPathwayStep.type,
      true
    );
    modalRef.componentInstance.scope = this.projectId;

    modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
      this.impactPathwayService.dispatchGenerateImpactPathwaySubTask(
        this.projectId,
        this.impactPathwayStep.parentId,
        this.impactPathwayStep.id,
        this.impactPathwayTask.id,
        item.type.value,
        item.metadata);
    });
    modalRef.componentInstance.addItems.subscribe((items: SimpleItem[]) => {
      items.forEach((item) => {
        this.service.dispatchAddImpactPathwaySubTaskAction(
          this.impactPathwayStep.parentId,
          this.impactPathwayStep.id,
          this.impactPathwayTask.id,
          item.id);
      })
    });
  }

  getTasks(): Observable<ImpactPathwayTask[]> {
    return this.service.getImpactPathwaySubTasksByParentId(
      this.impactPathwayStep.parentId,
      this.impactPathwayStep.id,
      this.impactPathwayTask.id);
  }

  isProcessing(): Observable<boolean> {
    return this.processing$;
  }

}
