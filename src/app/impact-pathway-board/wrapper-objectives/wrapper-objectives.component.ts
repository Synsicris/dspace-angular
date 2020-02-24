import { Component, Input } from '@angular/core';

import { ObjectiveService } from '../../core/impact-pathway/objective.service';
import { ImpactPathwayStep } from '../../core/impact-pathway/models/impact-pathway-step.model';
import { Router } from '@angular/router';

@Component({
  selector: 'ipw-wrapper-objectives',
  styleUrls: ['./wrapper-objectives.component.scss'],
  templateUrl: './wrapper-objectives.component.html'
})
export class WrapperObjectivesComponent {

  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public targetImpactPathwayTaskId: string;

  constructor(private objectivesService: ObjectiveService, private router: Router) {
  }

  getObjectivesTasks() {
    return this.impactPathwayStep.tasks.filter((task) => task.type === 'proj_objectives')
  }

  back() {
    this.router.navigate(['impactpathway', this.impactPathwayStep.parentId, 'edit']);
  }
}
