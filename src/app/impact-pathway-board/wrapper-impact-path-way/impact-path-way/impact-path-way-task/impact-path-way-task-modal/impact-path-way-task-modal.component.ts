import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayStep } from '../../../../../core/impact-pathway/models/impact-pathway-step.model';
import { ImpactPathwayStepType } from '../../../../../core/impact-pathway/models/impact-pathway-step-type';
import { SearchTaskService } from '../../../../search-task/search-task.service';

@Component({
  selector: 'ipw-impact-path-way-task-modal',
  styleUrls: ['./impact-path-way-task-modal.component.scss'],
  templateUrl: './impact-path-way-task-modal.component.html'
})
export class ImpactPathWayTaskModalComponent {

  @Input() step: ImpactPathwayStep;

  public impactPathWayStepType = ImpactPathwayStepType;

  constructor(public activeModal: NgbActiveModal, private searchTaskService: SearchTaskService) {
  }

  closeModal() {
    this.searchTaskService.resetAppliedFilters();
    this.activeModal.dismiss(false);
  }
}
