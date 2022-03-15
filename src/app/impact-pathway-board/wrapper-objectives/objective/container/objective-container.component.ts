import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayTask } from '../../../core/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../../core/models/impact-pathway-step.model';
import { ImpactPathwayService } from '../../../core/impact-pathway.service';
import { DragAndDropContainerComponent } from '../../../shared/drag-and-drop-container.component';
import { CreateSimpleItemModalComponent } from '../../../../shared/create-simple-item-modal/create-simple-item-modal.component';
import { SimpleItem } from '../../../../shared/create-simple-item-modal/models/simple-item.model';
import { environment } from '../../../../../environments/environment';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'ipw-objective-container',
  styleUrls: ['../../../shared/drag-and-drop-container.component.scss', './objective-container.component.scss'],
  templateUrl: './objective-container.component.html'
})
export class ObjectiveContainerComponent extends DragAndDropContainerComponent {

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;
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
      const newList = [...event.container.data.tasks];
      moveItemInArray(newList, event.previousIndex, event.currentIndex);
      this.impactPathwayService.dispatchOrderSubTasks(
        this.impactPathwayStep.parentId,
        this.impactPathwayStep.id,
        this.impactPathwayTask.id,
        newList,
        event.container.data.tasks
      );
    } else {
      if (this.canDropOnTask(event.container.data, event.item.data)) {
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
      .filter((task) => (task.type === environment.impactPathway.projObjectiveEntity ||
        task.type === environment.impactPathway.iaObjectiveEntity))
      .map((task) => task.id);
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
    modalRef.componentInstance.formHeader = this.impactPathwayService.getImpactPathwayStepTaskFormHeader(
      this.impactPathwayStep.type,
      true
    );
    modalRef.componentInstance.searchMessageInfoKey = this.impactPathwayService.getImpactPathwayStepTaskSearchHeader(
      this.impactPathwayStep.type,
      true
    );
    modalRef.componentInstance.processing = this.impactPathwayService.isProcessing();
    modalRef.componentInstance.vocabularyName = this.impactPathwayService.getTaskTypeAuthorityName(
      this.impactPathwayStep.type,
      true
    );
    modalRef.componentInstance.searchConfiguration = this.impactPathwayService.getSearchTaskConfigName(
      this.impactPathwayStep.type,
      true
    );
    modalRef.componentInstance.scope = this.projectCommunityId;
    modalRef.componentInstance.query = this.buildExcludedTasksQuery();

    modalRef.componentInstance.createItem.subscribe((item: SimpleItem) => {
      this.impactPathwayService.dispatchGenerateImpactPathwaySubTask(
        this.projectCommunityId,
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
      });
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

  private buildExcludedTasksQuery(): string {
    /*    const subprojectMembersGroup = this.projectGroupService.getProjectMembersGroupNameByCommunity(this.subproject);
        let query = `(entityGrants:project OR cris.policy.group: ${subprojectMembersGroup})`;*/
    let query = '';
    const tasksIds = this.impactPathwayTask.getSubTasksIds();
    if (tasksIds.length > 0) {
      const excludedIdsQuery = '-(search.resourceid' + ':(' + tasksIds.join(' OR ') + '))';
      query += `${excludedIdsQuery}`;
    }

    return query;
  }

}
