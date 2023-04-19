import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { ImpactPathwayService } from './core/impact-pathway.service';
import { ImpactPathwayStep } from './core/models/impact-pathway-step.model';
import { isNotEmpty } from '../shared/empty.util';
import { Item } from '../core/shared/item.model';

@Component({
  selector: 'ds-objectives-board',
  styleUrls: ['./impact-pathway-board.component.scss'],
  templateUrl: './objectives-board.component.html'
})
export class ObjectivesBoardComponent implements OnInit {

  /**
   * The project community's id
   */
  @Input() public projectCommunityId: string;

  /**
   * The impactPathway step's Item
   */
  @Input() public impactPathwayStepItem: Item;

  /**
   * If the current user is a funder Organizational/Project manager
   */
  @Input() hasAnyFunderRole: boolean;

  /**
   * If the current user is a funder project manager
   */
  @Input() isFunderProject: boolean;

  public impactPathwayStepId: string;
  public targetImpactPathwayTaskId$: Observable<string>;

  private impactPathWayStep$: Observable<ImpactPathwayStep>;

  constructor(private impactPathwayService: ImpactPathwayService) {
  }

  ngOnInit(): void {
    this.impactPathwayStepId = this.impactPathwayStepItem.id;
    this.impactPathWayStep$ = this.impactPathwayService.getImpactPathwayStepById(this.impactPathwayStepId);
    this.targetImpactPathwayTaskId$ = this.impactPathwayService.getImpactPathwayTargetTask();
  }

  getImpactPathwayStep(): Observable<ImpactPathwayStep> {
    return this.impactPathWayStep$.pipe(
      filter((step) => isNotEmpty(step)),
      distinctUntilChanged()
    );
  }

  isLoading(): Observable<boolean> {
    return this.impactPathwayService.isImpactPathwayLoaded().pipe(
      map((loaded: boolean) => !loaded)
    );
  }

}
