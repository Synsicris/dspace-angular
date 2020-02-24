import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { slide } from '../../../shared/animations/slide';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'ipw-collapsable-panel',
  styleUrls: ['./collapsable-panel.component.scss'],
  templateUrl: './collapsable-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [slide],
})

/**
 * Represents a part of the filter section for a single type of filter
 */
export class CollapsablePanelComponent implements OnInit {

  @Input() sidebarPanelTitle: string;

  @Input() startOpen = false;

  /**
   * True when the panel is 100% collapsed in the UI
   */
  collapsed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private cdr: ChangeDetectorRef) { }

  /**
   * Requests the current set values for this filter
   * If the filter config is open by default OR the filter has at least one value, the filter should be initially expanded
   * Else, the filter should initially be collapsed
   */
  ngOnInit() {
    if (this.startOpen) {
      this.initialExpand();
    } else {
      this.initialCollapse();
    }
  }

  /**
   *  Changes the state for this filter to collapsed when it's expanded and to expanded it when it's collapsed
   */
  toggle() {
    this.collapsed.next(!this.collapsed.value);
    this.cdr.detectChanges();
  }

  /**
   * Checks if the filter is currently collapsed
   * @returns {Observable<boolean>} Emits true when the current state of the filter is collapsed, false when it's expanded
   */
  isCollapsed(): Observable<boolean> {
    return this.collapsed;
  }

  /**
   *  Changes the initial state to collapsed
   */
  initialCollapse() {
    this.collapsed.next(true);
  }

  /**
   *  Changes the initial state to expanded
   */
  initialExpand() {
    this.collapsed.next(false);
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'collapsed') {
      this.collapsed.next(false);
    }
  }

  /**
   * Method to change this.collapsed to true when the slide animation starts and is sliding closed
   * @param event The animation event
   */
  startSlide(event: any): void {
    if (event.toState === 'collapsed') {
      this.collapsed.next(true);
    }
  }
}
