import { Component, Input, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ImpactPathway } from './core/models/impact-pathway.model';
import { ImpactPathwayService } from './core/impact-pathway.service';
import { isNotEmpty } from '../shared/empty.util';
import { Item } from '../core/shared/item.model';
import { ImpactPathwayLinksService } from './core/impact-pathway-links.service';

@Component({
  selector: 'ds-impact-pathway-board',
  styleUrls: ['./impact-pathway-board.component.scss'],
  templateUrl: './impact-pathway-board.component.html'
})
export class ImpactPathwayBoardComponent implements OnInit {
  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * The impact-pathway item
   */
  @Input() impactPathWayItem: Item;

  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() hasAnyFunderRole: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isAdmin: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  /**
   * The project item's id
   */
  @Input() public projectItemId: string;

  /**
   * The impact-pathway item's id
   */
  @Input() public impactPathwayId: string;

  private impactPathWay$: BehaviorSubject<ImpactPathway> = new BehaviorSubject<ImpactPathway>(null);
  public isProcessing$: Observable<boolean>;

  constructor(
    private impactPathwayService: ImpactPathwayService,
    private impactPathwayLinkService: ImpactPathwayLinksService
  ) {
  }

  ngOnInit(): void {
    this.impactPathwayService.isAdmin = this.isAdmin;
    this.impactPathwayLinkService.isAdmin = this.isAdmin;

    combineLatest([
      this.impactPathwayService.getImpactPathwayById(this.impactPathwayId),
      this.isLoading()
    ]).pipe(
      filter(([ipw, loading]: [ImpactPathway, boolean]) => isNotEmpty(ipw) && !loading)
    ).subscribe(([ipw, loading]: [ImpactPathway, boolean]) => {
      this.impactPathWay$.next(ipw);
    });
    this.isProcessing$ = this.impactPathwayService.isProcessing();
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
