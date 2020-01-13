import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathWayStep } from '../../../../models/impact-path-way-step.model';
import { ImpactPathWayStepType } from '../../../../models/impact-path-way-step-type';
import { SearchTaskService } from '../../../../search-task/search-task.service';

@Component({
  selector: 'ipw-impact-path-way-task-modal',
  styleUrls: ['./impact-path-way-task-modal.component.scss'],
  templateUrl: './impact-path-way-task-modal.component.html'
})
export class ImpactPathWayTaskModalComponent {

  @Input() step: ImpactPathWayStep;

  public impactPathWayStepType = ImpactPathWayStepType;

  constructor(public activeModal: NgbActiveModal, private searchTaskService: SearchTaskService) {
  }

  closeModal() {
    this.searchTaskService.resetAppliedFilters();
    this.activeModal.dismiss(false);
  }
}
