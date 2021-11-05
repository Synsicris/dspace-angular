import { Component, Input, OnDestroy } from '@angular/core';

import { ObjectiveService } from '../core/objective.service';
import { ImpactPathwayStep } from '../core/models/impact-pathway-step.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isNotEmpty } from '../../shared/empty.util';
import { environment } from '../../../environments/environment';
import { ImpactPathwayService } from '../core/impact-pathway.service';

@Component({
  selector: 'ipw-wrapper-objectives',
  styleUrls: ['./wrapper-objectives.component.scss'],
  templateUrl: './wrapper-objectives.component.html'
})
export class WrapperObjectivesComponent implements OnDestroy {

  @Input() public projectId: string;
  @Input() public impactPathwayStep: ImpactPathwayStep;
  @Input() public targetImpactPathwayTaskId: string;

  public stepTitle: string;

  constructor(
    private objectivesService: ObjectiveService,
    private router: Router,
    private impactPathwayService: ImpactPathwayService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    const label = `impact-pathway.step.label.${this.impactPathwayStep.type}`;
    this.stepTitle = this.translate.instant(label);
  }

  getObjectivesTasks() {
    return this.impactPathwayStep.tasks.filter((task) => (task.type === environment.impactPathway.projObjectiveEntity ||
      task.type === environment.impactPathway.iaObjectiveEntity));
  }

  back() {
    this.router.navigate(
      ['/project-overview', this.projectId, 'impactpathway', this.impactPathwayStep.parentId, 'edit']
    );
  }

  hasInfoMessage(): boolean {
    return isNotEmpty(this.getInfoMessage());
  }

  getInfoMessage(): string {
    return this.translate.instant('impact-pathway.objectives.' + this.impactPathwayStep.type + '.info.panel');
  }

  /**
   * When destroy component clear all collapsed values.
   */
  ngOnDestroy() {
    this.impactPathwayService.dispatchClearCollapsable();
  }

}
