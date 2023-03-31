import { Component, Input } from '@angular/core';

import { ImpactPathway } from '../core/models/impact-pathway.model';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-wrapper-impact-path-way',
  styleUrls: ['./wrapper-impact-path-way.component.scss'],
  templateUrl: './wrapper-impact-path-way.component.html'
})
export class WrapperImpactPathWayComponent {
  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() isFunder: boolean;
  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;
  /**
   * The project item's id
   */
  @Input() public projectItemId: string;
  /**
   * The impact-pathway item
   */
  @Input() impactPathWayItem: Item;
  @Input() public impactPathWay: ImpactPathway;
  @Input() public impactPathWayId: string;
  @Input() public isProcessing: boolean;

  public activeIds: string[];

}
