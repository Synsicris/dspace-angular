import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { getFirstSucceededRemoteDataPayload, getRemoteDataPayload } from '../core/shared/operators';
import { ImpactPathwayService } from '../impact-pathway-board/core/impact-pathway.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { InitImpactPathwayAction } from '../impact-pathway-board/core/impact-pathway.actions';
import { ProjectDataService } from '../core/project/project-data.service';
import { Community } from '../core/shared/community.model';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'ds-dashboard-page',
  styleUrls: ['./impact-pathway-page.component.scss'],
  templateUrl: './impact-pathway-page.component.html'
})
export class ImpactPathwayPageComponent implements OnInit, OnDestroy {

  /**
   * The item's id
   */
  id: number;

  /**
   * The impact-pathway item's id
   */
  impactPathwayId$: Observable<string>;

  /**
   * The impact-pathway item
   */
  impactPathWayItem$: Observable<Item>;

  /**
   * If the current user is a funder Organizational/Project manager
   */
  isFunder$: Observable<boolean>;

  /**
   * The project community's id
   */
  projectCommunityId$: Observable<string>;

  /**
   * The project item's id
   */
  projectItemId$: Observable<string>;

  constructor(
    private authService: AuthService,
    private impactPathwayService: ImpactPathwayService,
    private projectService: ProjectDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) { }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.isFunder$ = this.route.data.pipe(
      map((data) => data.isFunder as boolean)
    );

    const impactPathWayItem$ = this.route.data.pipe(
      map((data) => data.impactPathwayItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      filter((itemRD: RemoteData<Item>) => itemRD.hasSucceeded && !itemRD.isResponsePending),
      take(1)
    );

    this.impactPathWayItem$ = impactPathWayItem$.pipe(
      map((itemRD: RemoteData<Item>) => itemRD.payload)
    );

    this.impactPathwayId$ = impactPathWayItem$.pipe(
      mergeMap((itemRD: RemoteData<Item>) => this.impactPathwayService.isImpactPathwayLoadedById(itemRD.payload.id).pipe(
        map((loaded) => [itemRD, loaded])
      )),
      tap(([itemRD, loaded]: [RemoteData<Item>, boolean]) => {
        if (!loaded) {
          this.store.dispatch(new InitImpactPathwayAction(itemRD.payload));
        }
      }),
      map(([itemRD, loaded]: [RemoteData<Item>, boolean]) => itemRD.payload.id)
    );

    this.projectCommunityId$ = this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );

    this.projectItemId$ = impactPathWayItem$.pipe(
      getRemoteDataPayload(),
      map((item: Item) => this.projectService.getProjectItemIdByRelationMetadata(item))
    );
  }

  ngOnDestroy(): void {
    this.impactPathwayService.clearImpactPathway();
  }
}
