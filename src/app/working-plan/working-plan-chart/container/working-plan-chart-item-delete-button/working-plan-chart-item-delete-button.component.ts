import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { WorkpacakgeFlatNode } from '../../../core/models/workpackage-step-flat-node.model';
import { environment } from '../../../../../environments/environment';
import { FeatureID } from '../../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../../../core/data/feature-authorization/authorization-data.service';
import { EditItemDataService } from '../../../../core/submission/edititem-data.service';

@Component({
  selector: 'ds-working-plan-chart-item-delete-button',
  templateUrl: './working-plan-chart-item-delete-button.component.html',
  styleUrls: ['./working-plan-chart-item-delete-button.component.scss', '../working-plan-chart-container.component.scss']
})
export class WorkingPlanChartItemDeleteButtonComponent implements OnInit {

  /**
   * A boolean representing if compare mode is active
   */
  @Input() public compareMode: Observable<boolean>;

  /**
   * The current node
   */
  @Input() node: WorkpacakgeFlatNode;

  /**
   * A boolean representing if item is a version of original item
   */
  @Input() isVersionOfAnItem = false;

  /**
   * Check if canEdit
   */
  private canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The edit mode to use
   */
  private projectsEntityEditMode: string;

  constructor(private authorizationService: AuthorizationDataService, private editItemDataService: EditItemDataService,) { }

  ngOnInit(): void {
    if (this.isVersionOfAnItem) {
      this.canEdit$.next(false);
    } else {
      this.authorizationService.isAuthorized(FeatureID.isItemEditable, this.node.selfUrl).pipe(
        take(1)
      ).subscribe((canEdit: boolean) => {
        this.canEdit$.next(canEdit);
      });

      const adminEdit$ = this.editItemDataService.checkEditModeByIdAndType(this.node.id, environment.projects.projectsEntityAdminEditMode).pipe(
        take(1)
      );
      const userEdit$ = this.editItemDataService.checkEditModeByIdAndType(this.node.id, environment.projects.projectsEntityEditMode).pipe(
        take(1)
      );

      combineLatest([adminEdit$, userEdit$]).subscribe(([canAdminEdit, canUserEdit]: [boolean, boolean]) => {
        if (canUserEdit) {
          this.projectsEntityEditMode = environment.projects.projectsEntityEditMode;
        } else if (canAdminEdit) {
          this.projectsEntityEditMode = environment.projects.projectsEntityAdminEditMode;
        }
      });
    }
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
    return ['/edit-items', this.node.id + ':' + this.projectsEntityEditMode];
  }

}
