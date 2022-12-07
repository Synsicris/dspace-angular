import { Component, Input, OnChanges } from '@angular/core';
import { Item } from './../../core/shared/item.model';
import { Version } from './../../core/shared/version.model';

@Component({
  selector: 'ds-view-version-badges',
  templateUrl: './view-version-badges.component.html',
  styleUrls: ['./view-version-badges.component.scss']
})
/**
 * The component for displaying badges related to a version and its official
 */
export class ViewVersionBadgesComponent implements OnChanges {

  /**
   * The version that is being displayed
   */
  @Input() version: Version;

  /**
   * The item that the version belongs to
   */
  @Input() item: Item;

  /**
   * Shows if the version is created within 4 weeks
   */
  withinWeek = false;

  /**
   * Checks if the version changes so it shows the updated value
   */
  ngOnChanges(changed): void {
    if (!!changed.version && !!changed.version.currentValue && this.isYoungerThanFourWeeks(new Date(changed.version.currentValue.created), new Date())) {
      this.withinWeek = true;
    }
  }

  /**
   * Checks the difference between the dates to understand if its within 4 weeks
   */
  isYoungerThanFourWeeks(startDate, endDate) {
    return Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24)) <= 28;
  }
}
