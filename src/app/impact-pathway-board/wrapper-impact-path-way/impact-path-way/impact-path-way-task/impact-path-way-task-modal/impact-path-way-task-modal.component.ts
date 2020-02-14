import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayStep } from '../../../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayStepType } from '../../../../../core/impact-pathway/models/impact-pathway-step-type';
import { ImpactPathwayTask } from '../../../../../core/impact-pathway/models/impact-pathway-task.model';

@Component({
  selector: 'ipw-impact-path-way-task-modal',
  styleUrls: ['./impact-path-way-task-modal.component.scss'],
  templateUrl: './impact-path-way-task-modal.component.html'
})
export class ImpactPathWayTaskModalComponent {

  @Input() step: ImpactPathwayStep;
  @Input() parentTask: ImpactPathwayTask;
  @Input() isObjectivePage = false;

  public impactPathWayStepType = ImpactPathwayStepType;

  constructor(public activeModal: NgbActiveModal) {
  }

  closeModal() {
    this.activeModal.dismiss(false);
  }
}
