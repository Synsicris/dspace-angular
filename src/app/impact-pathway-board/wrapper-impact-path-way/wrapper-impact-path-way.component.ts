import { Component, Input } from '@angular/core';

import { ImpactPathway } from '../core/models/impact-pathway.model';

@Component({
  selector: 'ipw-wrapper-impact-path-way',
  styleUrls: ['./wrapper-impact-path-way.component.scss'],
  templateUrl: './wrapper-impact-path-way.component.html'
})
export class WrapperImpactPathWayComponent {

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;
  @Input() public impactPathWay: ImpactPathway;
  @Input() public impactPathWayId: string;

  public activeIds: string[];

}
