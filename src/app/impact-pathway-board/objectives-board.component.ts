import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { ImpactPathwayService } from '../core/impact-pathway/impact-pathway.service';
import { ImpactPathwayStep } from '../core/impact-pathway/models/impact-pathway-step.model';
import { isNotEmpty } from '../shared/empty.util';

@Component({
  selector: 'ipw-objectives-board',
  styleUrls: ['./impact-pathway-board.component.scss'],
  templateUrl: './objectives-board.component.html'
})
export class ObjectivesBoardComponent implements OnInit {

  @Input() public projectId: string;
  @Input() public impactPathwayStepId: string;

  public targetImpactPathwayTaskId$: Observable<string>;

  private impactPathWayStep$: Observable<ImpactPathwayStep>;

  constructor(private impactPathwayService: ImpactPathwayService) {
  }

  ngOnInit(): void {
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
    )
  }

}
