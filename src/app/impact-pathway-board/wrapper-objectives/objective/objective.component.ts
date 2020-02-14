import { Component, Input, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { ImpactPathwayTask } from '../../../core/impact-pathway/models/impact-pathway-task.model';
import { ImpactPathwayStep } from '../../../core/impact-pathway/models/impact-pathway-step.model';
import { AppState } from '../../../app.reducer';
import { PatchImpactPathwayTaskMetadataAction } from '../../../core/impact-pathway/impact-pathway.actions';

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

  constructor(private store: Store<AppState>) {
  }

  isOpen() {
    return this.impactPathwayTask.id === this.targetImpactPathwayStepId;
  }

  updateDescription(value) {
    this.store.dispatch(new PatchImpactPathwayTaskMetadataAction(
      this.impactPathwayStep.parentId,
      this.impactPathwayStep.id,
      this.impactPathwayTask.id,
      this.impactPathwayTask,
      'dc.description',
      0,
      value
    ));
  }
}
