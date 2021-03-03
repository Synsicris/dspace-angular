import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImpactPathway } from '../core/impact-pathway/models/impact-pathway.model';
import { ImpactPathwayService } from '../core/impact-pathway/impact-pathway.service';

@Component({
  selector: 'ipw-dashboard',
  styleUrls: ['./impact-pathway-board.component.scss'],
  templateUrl: './impact-pathway-board.component.html'
})
export class ImpactPathwayBoardComponent implements OnInit {

  @Input() public projectId: string;
  @Input() public impactPathwayId: string;

  private impactPathWay$: Observable<ImpactPathway>;

  constructor(private impactPathwayService: ImpactPathwayService) {
  }

  ngOnInit(): void {
    this.impactPathWay$ = this.impactPathwayService.getImpactPathwayById(this.impactPathwayId);
  }

  getImpactPathway(): Observable<ImpactPathway> {
    return this.impactPathWay$;
  }

  isLoading(): Observable<boolean> {
    return this.impactPathwayService.isImpactPathwayLoaded().pipe(
      map((loaded: boolean) => !loaded)
    );
  }

}
