import { Component, Input, ViewChild } from '@angular/core';

import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayTask } from '../../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../../core/impact-pathway/models/impact-pathway-step.model';

@Component({
  selector: 'ipw-objective',
  styleUrls: ['./objective.component.scss'],
  templateUrl: './objective.component.html'
})
export class ObjectiveComponent {

  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public impactPathwayTask: ImpactPathwayTask;
  @Input() public targetImpactPathwayStepId: string;

  @ViewChild('accordionRef') wrapper: NgbAccordion;

  isOpen() {
    return this.impactPathwayTask.id === this.targetImpactPathwayStepId;
  }

}
