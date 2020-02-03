import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { ImpactPathwayService } from '../core/impact-pathway/impact-pathway.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { ImpactPathwayStep } from '../core/impact-pathway/models/impact-pathway-step.model';
import { ObjectiveService } from '../core/impact-pathway/objective.service';
import { isNotEmpty } from '../shared/empty.util';

@Component({
  selector: 'ipw-objectives-board',
  styleUrls: ['./impact-pathway-board.component.scss'],
  templateUrl: './objectives-board.component.html'
})
export class ObjectivesBoardComponent implements OnInit {

  @Input() public impactPathwayStepId: string;
  @Input() public targetImpactPathwayStepId: string;

  private impactPathWayStep$: Observable<ImpactPathwayStep>;

  constructor(
    private impactPathwayService: ImpactPathwayService,
    private notificationService: NotificationsService,
    private objectiveService: ObjectiveService) {
  }

  ngOnInit(): void {
    this.impactPathWayStep$ = this.impactPathwayService.getImpactPathwayStepById(this.impactPathwayStepId);
  }

  getImpactPathwayStep(): Observable<ImpactPathwayStep> {
    return this.impactPathWayStep$.pipe(
      filter((step) => isNotEmpty(step)),
      take(1)
    );
  }

  isLoading(): Observable<boolean> {
    return this.impactPathwayService.isImpactPathwayLoaded().pipe(
      map((loaded: boolean) => !loaded)
    )
  }

}
