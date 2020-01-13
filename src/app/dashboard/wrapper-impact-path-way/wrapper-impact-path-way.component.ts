import { Component, Input } from '@angular/core';

import { ImpactPathWay } from '../models/impact-path-way.model';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'ipw-wrapper-impact-path-way',
  styleUrls: ['./wrapper-impact-path-way.component.scss'],
  templateUrl: './wrapper-impact-path-way.component.html'
})
export class WrapperImpactPathWayComponent {

  @Input() public impactPathWays: ImpactPathWay[];

  public activeIds: string[];

  constructor(private service: DashboardService) {
  }

}
