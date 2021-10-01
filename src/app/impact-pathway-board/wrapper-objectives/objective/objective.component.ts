import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { NgbAccordion, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayTask } from '../../core/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../core/models/impact-pathway-step.model';
import { isEmpty } from '../../../shared/empty.util';
import { ImpactPathwayService } from '../../core/impact-pathway.service';
import { EditSimpleItemModalComponent } from '../../../shared/edit-simple-item-modal/edit-simple-item-modal.component';
import { Item } from '../../../core/shared/item.model';
import { SubmissionFormModel } from '../../../core/config/models/config-submission-form.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ipw-objective',
  styleUrls: ['./objective.component.scss'],
  templateUrl: './objective.component.html'
})
export class ObjectiveComponent implements OnInit {

  @Input() public projectId: string;
  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public impactPathwayTask: ImpactPathwayTask;
  @Input() public targetImpactPathwayTaskId: string;

  /**
   * The form config
   * @type {Observable<SubmissionFormModel>}
   */
  formConfig$: Observable<SubmissionFormModel>;

  @ViewChild('accordionRef', { static: false }) wrapper: NgbAccordion;

  constructor(private impactPathwayService: ImpactPathwayService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.formConfig$ = this.impactPathwayService.getImpactPathwayTaskEditFormConfig(this.impactPathwayStep.type);
  }

  isOpen() {
    return this.impactPathwayTask.id === this.targetImpactPathwayTaskId || isEmpty(this.targetImpactPathwayTaskId);
  }

  updateDescription(value) {
    this.impactPathwayService.dispatchPatchImpactPathwayTaskMetadata(
      this.impactPathwayStep.parentId,
      this.impactPathwayStep.id,
      this.impactPathwayTask.id,
      this.impactPathwayTask,
      'dc.description',
      0,
      value
    );
  }

  updateTitle(value) {
    this.impactPathwayService.dispatchPatchImpactPathwayTaskMetadata(
      this.impactPathwayStep.parentId,
      this.impactPathwayStep.id,
      this.impactPathwayTask.id,
      this.impactPathwayTask,
      'dc.title',
      0,
      value
    );
  }

  /**
   * Open dialog box for editing exploitation-plan
   */
  openEditModal() {
    const modalRef = this.modalService.open(EditSimpleItemModalComponent, { size: 'lg' });
    modalRef.componentInstance.formConfig = this.impactPathwayService.getImpactPathwayTaskEditFormConfig(this.impactPathwayStep.type);
    modalRef.componentInstance.itemId = this.impactPathwayTask.id;

    modalRef.componentInstance.itemUpdate.pipe(take(1))
      .subscribe((item: Item) => this.updateImpactPathwayTask(item));
  }

  updateImpactPathwayTask(item: Item) {
    this.impactPathwayTask = this.impactPathwayService.updateImpactPathwayTask(item, this.impactPathwayTask);
    this.impactPathwayService.dispatchUpdateImpactPathwayTask(
      this.impactPathwayStep.parentId,
      this.impactPathwayStep.id,
      this.impactPathwayTask.id,
      this.impactPathwayTask
    );
  }
}
