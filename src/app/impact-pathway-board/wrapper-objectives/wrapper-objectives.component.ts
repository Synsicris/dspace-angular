import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ObjectiveService } from '../core/objective.service';
import { ImpactPathwayStep } from '../core/models/impact-pathway-step.model';
import { isNotEmpty } from '../../shared/empty.util';
import { environment } from '../../../environments/environment';
import { ImpactPathwayService } from '../core/impact-pathway.service';
import { VersionSelectedEvent } from '../../shared/item-version-list/item-version-list.component';
import { AlertRole, getProgrammeRoles } from '../../shared/alert/alert-role/alert-role';
import { ProjectAuthorizationService } from '../../core/project/project-authorization.service';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-wrapper-objectives',
  styleUrls: ['./wrapper-objectives.component.scss'],
  templateUrl: './wrapper-objectives.component.html'
})
export class WrapperObjectivesComponent implements OnInit, OnDestroy {
  /**
   * The impact pathway step id
   */
  @Input() public impactPathwayStep: ImpactPathwayStep;

  /**
   * The impactPathway step's Item
   */
  @Input() public impactPathwayStepItem: Item;

  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() hasAnyFunderRole: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;

  @Input() public targetImpactPathwayTaskId: string;

  public stepTitle: string;

  /**
   * A boolean representing if item is a version of original item
   */
  public isVersionOfAnItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public funderRoles: AlertRole[];

  constructor(
    private objectivesService: ObjectiveService,
    private impactPathwayService: ImpactPathwayService,
    protected aroute: ActivatedRoute,
    private translate: TranslateService,
    private projectAuthorizationService: ProjectAuthorizationService
  ) {
  }

  ngOnInit(): void {
    const label = `impact-pathway.step.label.${this.impactPathwayStep.type}`;
    this.stepTitle = this.translate.instant(label);

    this.aroute.data.pipe(
      map((data) => data.isVersionOfAnItem),
      filter((isVersionOfAnItem) => isVersionOfAnItem === true),
      take(1)
    ).subscribe((isVersionOfAnItem: boolean) => {
      this.isVersionOfAnItem$.next(isVersionOfAnItem);
    });
    this.funderRoles = getProgrammeRoles(this.impactPathwayStepItem, this.projectAuthorizationService);
  }

  getObjectivesTasks() {
    return this.impactPathwayStep.tasks.filter((task) => (task.type === environment.impactPathway.projObjectiveEntity ||
      task.type === environment.impactPathway.iaObjectiveEntity));
  }

  hasInfoMessage(): boolean {
    return isNotEmpty(this.getInfoMessage());
  }

  getInfoMessage(): string {
    return this.translate.instant(this.getContentKey());
  }

  getContentKey(): string {
    return 'impact-pathway.objectives.' + this.impactPathwayStep.type + '.info.panel';
  }

  /**
   * When destroy component clear all collapsed values.
   */
  ngOnDestroy() {
    this.impactPathwayService.dispatchClearCollapsable();
  }

  /**
   * Dispatch initialization of comparing mode
   *
   * @param selected
   */
  onVersionSelected(selected: VersionSelectedEvent) {
    this.impactPathwayService.initCompareImpactPathwayTask(this.impactPathwayStep.parentId, selected.base.id, selected.comparing.id, selected.active.id);
  }

  /**
   * Dispatch cleaning of comparing mode
   */
  onVersionDeselected() {
    this.impactPathwayService.dispatchStopCompareImpactPathwayTask(this.impactPathwayStep.parentId, this.impactPathwayStep.id, this.targetImpactPathwayTaskId);
  }

}
