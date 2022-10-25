import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { WorkpacakgeFlatNode } from '../../../core/models/workpackage-step-flat-node.model';
import { environment } from '../../../../../environments/environment';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';

@Component({
  selector: 'ds-working-plan-chart-item-edit-button',
  templateUrl: './working-plan-chart-item-edit-button.component.html',
  styleUrls: ['./working-plan-chart-item-edit-button.component.scss', '../working-plan-chart-container.component.scss']
})
export class WorkingPlanChartItemEditButtonComponent implements OnInit {

  /**
   * A boolean representing if compare mode is active
   */
  @Input() public compareMode: Observable<boolean>;

  /**
   * The current node
   */
  @Input() node: WorkpacakgeFlatNode;

  /**
   * Check if canEdit
   */
  private canEdit$: Observable<boolean>;

  constructor(private authorizationService: AuthorizationDataService) { }

  ngOnInit(): void {
    this.canEdit$ = this.authorizationService.isAuthorized(FeatureID.isItemEditable, this.node.selfUrl);
  }

  /**
   * Check if the current node is editable
   */
  canEdit(): Observable<boolean> {
    return this.canEdit$;
  }

  /**
   * Return the edit item page route
   */
  getEditItemRoute(): string[] {
    return ['/edit-items', this.node.id + ':' + environment.projects.projectsEntityEditMode];
  }

}
