import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { getFirstSucceededRemoteDataPayload, redirectOn4xx } from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';
import { Item } from '../core/shared/item.model';
import { WorkingPlanStateService } from '../working-plan/core/working-plan-state.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ipw-working-plan-page',
  templateUrl: './working-plan-page.component.html'
})
export class WorkingPlanPageComponent implements OnInit {
  /**
   * The project item's id
   */
  projectItemId$: Observable<string>;

  /**
   * The project community's id
   */
  projectCommunityId$: Observable<string>;

  /**
   * The working-plan item to displayed on this page
   */
  workingPlanRD$: Observable<RemoteData<Item>>;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private workingPlanStateService: WorkingPlanStateService
  ) { }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.projectItemId$ = this.route.data.pipe(
      map((data) => data.projectItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Item) => project.id)
    );

    this.projectCommunityId$ = this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );

    this.workingPlanRD$ = this.projectCommunityId$.pipe(
      switchMap((projectID: string) => {
        return this.route.data.pipe(
          map((data) => data.workingPlan as RemoteData<Item>),
          redirectOn4xx(this.router, this.authService),
          mergeMap((itemRD: RemoteData<Item>) => this.workingPlanStateService.isWorkingPlanLoaded().pipe(
            take(1),
            map((loaded) => [itemRD, loaded])
          )),
          tap(([itemRD, loaded]: [RemoteData<Item>, boolean]) => {
            if (!loaded) {
              this.workingPlanStateService.dispatchRetrieveAllWorkpackages(projectID, itemRD.payload.uuid, environment.workingPlan.workingPlanPlaceMetadata);
            }
          }),
          map(([itemRD, loaded]: [RemoteData<Item>, boolean]) => itemRD)
        );
      })
    );

  }
}
