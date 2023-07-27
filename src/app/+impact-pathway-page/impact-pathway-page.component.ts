import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { ImpactPathwayService } from '../impact-pathway-board/core/impact-pathway.service';
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

  initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The item's id
   */
  id: number;

  /**
   * The impact-pathway item's id
   */
  impactPathwayId: string;

  /**
   * The impact-pathway item
   */
  impactPathWayItem: Item;

  /**
   * If the current user is a funder Organizational/Project manager
   */
  hasAnyFunderRole: boolean;

  /**
   * If the current user is an administrator
   */
  isAdmin: boolean;

  /**
   * If the current user is a funder Organizational/Project manager
   */
  isFunderProject: boolean;

  /**
   * The project community's id
   */
  projectCommunityId: string;

  /**
   * The project item's id
   */
  projectItemId: string;

  constructor(
    private authService: AuthService,
    private impactPathwayService: ImpactPathwayService,
    private projectService: ProjectDataService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
  }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    const hasAnyFunderRole$ = this.route.data.pipe(
      map((data) => (data.isFunderOrganizationalManger || data.isFunderProject || data.isFunderReader) as boolean)
    );

    const isAdmin$ = this.route.data.pipe(
      map((data) => data.isAdmin as boolean)
    );

    const isFunderProject$ = this.route.data.pipe(
      map((data) => data.isFunderProject as boolean)
    );

    const impactPathWayItemRD$ = this.route.data.pipe(
      map((data) => data.impactPathwayItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstCompletedRemoteData()
    );

    const impactPathWayItem$ = impactPathWayItemRD$.pipe(
      map((itemRD: RemoteData<Item>) => itemRD.hasSucceeded ? itemRD.payload : null)
    );

    const impactPathwayId$ = impactPathWayItemRD$.pipe(
      mergeMap((itemRD: RemoteData<Item>) => this.impactPathwayService.isImpactPathwayLoadedById(itemRD?.payload?.id).pipe(
        map((loaded) => [itemRD, loaded])
      )),
      tap(([itemRD, loaded]: [RemoteData<Item>, boolean]) => {
        if (!loaded) {
          this.store.dispatch(new InitImpactPathwayAction(itemRD.payload));
        }
      }),
      map(([itemRD, loaded]: [RemoteData<Item>, boolean]) => itemRD.payload.id)
    );

    const projectCommunityId$ = this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );

    const projectItemId$ = impactPathWayItem$.pipe(
      map((item: Item) => this.projectService.getProjectItemIdByRelationMetadata(item))
    );

    combineLatest([projectItemId$, projectCommunityId$, impactPathWayItem$, impactPathwayId$, hasAnyFunderRole$, isFunderProject$, isAdmin$])
      .pipe(take(1)
    ).subscribe(([projectItemId, projectCommunityId, impactPathWayItem, impactPathwayId, hasAnyFunderRole, isFunderProject, isAdmin]) => {
      this.projectItemId = projectItemId;
      this.projectCommunityId = projectCommunityId;
      this.impactPathWayItem = impactPathWayItem;
      this.impactPathwayId = impactPathwayId;
      this.hasAnyFunderRole = hasAnyFunderRole;
      this.isFunderProject = isFunderProject;
      this.isAdmin = isAdmin;
      this.initialized.next(true);
    });
  }

  ngOnDestroy(): void {
    this.impactPathwayService.clearImpactPathway();
  }
}
