import { Component, Input, OnInit } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../core/shared/item.model';

@Component({
  selector: 'ds-working-plan-comments',
  templateUrl: './working-plan-comments.component.html',
  styleUrls: ['./working-plan-comments.component.scss']
})
export class WorkingPlanCommentsComponent implements OnInit {

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
   * Accordion active ids (opened panels)
   * @type {string[]}
   */
  public activeIds: string[] = [];

  /**
   * A flag representing if the comment accordion is open
   */
  public isCommentAccordionOpen = false;

  ngOnInit() {
    // Set the accordion opened by default if the toggle button will not be shown
    this.activeIds = !this.showAccordionPanelToggle ? ['panel-0'] : [];
  }

  /**
   * Change the state of flag isCommentAccordionOpen on panel change
   * and prevent the default action (toggle) if the toggle button will not be shown
   * @param event NgbPanelChangeEvent
   */
  changeAccordionState(event: NgbPanelChangeEvent) {
    this.isCommentAccordionOpen = event.nextState;
    if (!this.showAccordionPanelToggle) {
      event.preventDefault();
    }
  }
}
