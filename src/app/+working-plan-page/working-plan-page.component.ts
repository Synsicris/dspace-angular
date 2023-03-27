import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';
import { Item } from '../core/shared/item.model';
import { WorkingPlanStateService } from '../working-plan/core/working-plan-state.service';
import { environment } from '../../environments/environment';
import { ProjectVersionService } from '../core/project/project-version.service';

@Component({
  selector: 'ds-working-plan-page',
  templateUrl: './working-plan-page.component.html'
})
export class WorkingPlanPageComponent implements OnInit {

  initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * If the current user is a funder Organizational/Project manager
   */
  isFunder: boolean;

  /**
   * If the working-plan given is a version item
   */
  isVersionOf: boolean;

  /**
   * The project item's id
   */
  projectItemId: string;

  /**
   * The project community's id
   */
  projectCommunityId: string;

  /**
   * The working-plan item to displayed on this page
   */
  workingPlanRD: RemoteData<Item>;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private projectVersionService: ProjectVersionService,
    private workingPlanStateService: WorkingPlanStateService
  ) { }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {


    const isFunder$ = this.route.data.pipe(
      map((data) => (data.isFunderOrganizationalManger || data.isFunderProject || data.isFunderReader) as boolean)
    );

    const projectItemId$ = this.route.data.pipe(
      map((data) => data.projectItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Item) => project.id)
    );

    const projectCommunityId$ = this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      map((project: Community) => project.id)
    );

    const workingPlanRD$ = projectCommunityId$.pipe(
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
              this.isVersionOf = this.projectVersionService.isVersionOfAnItem(itemRD.payload);
              this.workingPlanStateService.dispatchRetrieveAllWorkpackages(projectID, itemRD.payload, environment.workingPlan.workingPlanPlaceMetadata, this.isVersionOf);
            }
          }),
          map(([itemRD, loaded]: [RemoteData<Item>, boolean]) => itemRD)
        );
      })
    );

    combineLatest([projectItemId$, projectCommunityId$, workingPlanRD$, isFunder$]).pipe(take(1))
      .subscribe(([projectItemId, projectCommunityId, workingPlanRD, isFunder]) => {
        this.projectItemId = projectItemId;
        this.projectCommunityId = projectCommunityId;
        this.workingPlanRD = workingPlanRD;
        this.isFunder = isFunder;
        this.initialized.next(true);
      });
  }
}
