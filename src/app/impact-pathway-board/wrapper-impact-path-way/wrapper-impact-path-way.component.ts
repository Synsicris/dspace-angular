import { Component, Input } from '@angular/core';

import { ImpactPathWay } from '../../core/impact-pathway/models/impact-path-way.model';
import { ImpactPathwayService } from '../../core/impact-pathway/impact-pathway.service';

@Component({
  selector: 'ipw-wrapper-impact-path-way',
  styleUrls: ['./wrapper-impact-path-way.component.scss'],
  templateUrl: './wrapper-impact-path-way.component.html'
})
export class WrapperImpactPathWayComponent {

  @Input() public impactPathWays: ImpactPathWay[];

  public activeIds: string[];

  constructor(private service: ImpactPathwayService) {
  }

}
