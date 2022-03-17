import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ImpactPathway } from './core/models/impact-pathway.model';
import { ImpactPathwayService } from './core/impact-pathway.service';
import { isNotEmpty } from '../shared/empty.util';

@Component({
  selector: 'ipw-dashboard',
  styleUrls: ['./impact-pathway-board.component.scss'],
  templateUrl: './impact-pathway-board.component.html'
})
export class ImpactPathwayBoardComponent implements OnInit {
  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * The project item's id
   */
  @Input() public projectItemId: string;

  /**
   * The impact-pathway item's id
   */
  @Input() public impactPathwayId: string;

  private impactPathWay$: BehaviorSubject<ImpactPathway> = new BehaviorSubject<ImpactPathway>(null);

  constructor(private impactPathwayService: ImpactPathwayService) {
  }

  ngOnInit(): void {
    combineLatest([
      this.impactPathwayService.getImpactPathwayById(this.impactPathwayId),
      this.isLoading()
    ]).pipe(
      filter(([ipw, loading]: [ImpactPathway, boolean]) => isNotEmpty(ipw) && !loading)
    ).subscribe(([ipw, loading]: [ImpactPathway, boolean]) => {
      this.impactPathWay$.next(ipw);
    });
  }

  getImpactPathway(): Observable<ImpactPathway> {
    return this.impactPathWay$.asObservable();
  }

  isLoading(): Observable<boolean> {
    return this.impactPathwayService.isImpactPathwayLoaded().pipe(
      map((loaded: boolean) => !loaded)
    );
  }
}
