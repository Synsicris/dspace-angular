import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';

@Component({
  selector: 'ds-working-plan-comments',
  templateUrl: './working-plan-comments.component.html',
  styleUrls: ['./working-plan-comments.component.scss']
})
export class WorkingPlanCommentsComponent {

  /**
   * The current project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * A boolean representing the showing or not of the accordion toggle button
   */
  @Input() public showAccordionPanelToggle = true;

  /**
   * The working Plan item
   */
  @Input() workingPlan: Item;

  /**
   * Set the accordion opened by default if the toggle button will not be shown
   * @type {string[]}
   */
  public activeIds: string[] = !this.showAccordionPanelToggle ? ['panel-0'] : [];

}
