import { Component, Input } from '@angular/core';

import { ObjectiveService } from '../../core/impact-pathway/objective.service';
import { ImpactPathwayStep } from '../../core/impact-pathway/models/impact-pathway-step.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ipw-wrapper-objectives',
  styleUrls: ['./wrapper-objectives.component.scss'],
  templateUrl: './wrapper-objectives.component.html'
})
export class WrapperObjectivesComponent {

  @Input() public projectId: string;
  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public targetImpactPathwayTaskId: string;

  public stepTitle: string;

  constructor(
    private objectivesService: ObjectiveService,
    private router: Router,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    const label = `impact-pathway.step.label.${this.impactPathwayStep.type}`;
    this.stepTitle = this.translate.instant(label);
  }

  getObjectivesTasks() {
    return this.impactPathwayStep.tasks.filter((task) => task.type === 'proj_objectives')
  }

  back() {
    this.router.navigate(
      ['/project-overview', this.projectId, 'impactpathway', this.impactPathwayStep.parentId, 'edit']
    )
  }
}
