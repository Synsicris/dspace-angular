import { Component, Input, ViewChild } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayTask } from '../../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../../core/impact-pathway/models/impact-pathway-step.model';
import { isEmpty } from '../../../shared/empty.util';
import { ImpactPathwayService } from '../../../core/impact-pathway/impact-pathway.service';

@Component({
  selector: 'ipw-objective',
  styleUrls: ['./objective.component.scss'],
  templateUrl: './objective.component.html'
})
export class ObjectiveComponent {

  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public impactPathwayTask: ImpactPathwayTask;
  @Input() public targetImpactPathwayTaskId: string;

  @ViewChild('accordionRef') wrapper: NgbAccordion;

  constructor(private impactPathwayService: ImpactPathwayService) {
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
}
