import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Workpackage } from '../core/models/workpackage-step.model';
import { Item } from '../../core/shared/item.model';
import { ProjectAuthorizationService } from '../../core/project/project-authorization.service';
import { AlertRole, getProgrammeRoles } from '../../shared/alert/alert-role/alert-role';

@Component({
  selector: 'ds-working-plan-chart',
  templateUrl: './working-plan-chart.component.html',
  styleUrls: ['./working-plan-chart.component.scss'],
})
export class WorkingPlanChartComponent implements OnInit {

  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() hasAnyFunderRole: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  /**
   * If the working-plan given is a version item
   */
  @Input() isVersionOf: boolean;

  /**
   * The current project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * The working Plan item
   */
  @Input() workingPlan: Item;

  /**
   * Array containing a list of Workpackage object
   */
  @Input() public workpackages: Observable<Workpackage[]>;

  /**
   * The collection id for workpackage entity in the given project
   */
  @Input() public workPackageCollectionId: string;

  /**
   * The collection id for milestone entity in the given project
   */
  @Input() public milestoneCollectionId: string;

  /**
   * A boolean representing if compare mode is active
   */
  @Input() public compareMode: Observable<boolean>;

  /**
   * A boolean representing the showing or not of the accordion toggle button
   */
  @Input() public showAccordionPanelToggle = true;

  funderRoles: AlertRole[];

  constructor(private projectAuthorizationService: ProjectAuthorizationService) {
  }

  public ngOnInit() {
    this.funderRoles = getProgrammeRoles(this.workingPlan, this.projectAuthorizationService);
  }
}
