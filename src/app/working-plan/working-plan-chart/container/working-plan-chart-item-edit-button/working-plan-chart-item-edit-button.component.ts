import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { take } from 'rxjs/operators';
import { EditItemDataService } from '../../../../core/submission/edititem-data.service';
import { WorkpacakgeFlatNode } from '../../../core/models/workpackage-step-flat-node.model';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

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

  private canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private editItemDataService: EditItemDataService) { }

  ngOnInit(): void {
    this.editItemDataService.checkEditModeByIDAndType(this.node.id, environment.projects.projectsEntityEditMode).pipe(
      take(1)
    ).subscribe((canEdit: boolean) => {
      this.canEdit$.next(canEdit);
    });
  }

  /**
   * Check if the current node is editable
   */
  canEdit(): Observable<boolean> {
    return this.canEdit$.asObservable();
  }

  /**
   * Return the edit item page route
   */
  getEditItemRoute(): string[] {
    return ['/edit-items', this.node.id + ':' + environment.projects.projectsEntityEditMode];
  }

}
