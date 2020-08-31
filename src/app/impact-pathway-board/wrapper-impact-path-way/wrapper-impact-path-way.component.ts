import { Component, Input } from '@angular/core';

import { ImpactPathway } from '../../core/impact-pathway/models/impact-pathway.model';

@Component({
  selector: 'ipw-wrapper-impact-path-way',
  styleUrls: ['./wrapper-impact-path-way.component.scss'],
  templateUrl: './wrapper-impact-path-way.component.html'
})
export class WrapperImpactPathWayComponent {

  @Input() public projectId: string;
  @Input() public impactPathWay: ImpactPathway;
  @Input() public impactPathWayId: string;

  public activeIds: string[];

}
