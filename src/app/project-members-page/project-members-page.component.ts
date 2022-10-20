import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  redirectOn4xx
} from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';
import { ProjectGroupService } from '../core/project/project-group.service';
import { Group } from '../core/eperson/models/group.model';
import { GroupDataService } from '../core/eperson/group-data.service';
import { Item } from '../core/shared/item.model';
import { PROJECT_ENTITY } from '../core/project/project-data.service';
import { ProjectAuthorizationService } from '../core/project/project-authorization.service';

@Component({
  selector: 'ds-project-members-page',
  templateUrl: './project-members-page.component.html',
  styleUrls: ['./project-members-page.component.scss']
})
export class ProjectMembersPageComponent implements OnInit {

  /**
   * The project/funding coordinators group
   */
  public coordinatorsGroup$: BehaviorSubject<Group> = new BehaviorSubject<Group>(null);

  /**
   * The project/funding funders group
   */
  public fundersGroup$: BehaviorSubject<Group> = new BehaviorSubject<Group>(null);

  /**
   * A boolean representing if funders group is initialized
   */
  public fundersGroupInit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The project/funding edit group
   */
  public membersGroup$: BehaviorSubject<Group> = new BehaviorSubject<Group>(null);

  /**
   * The project/funding community
   */
  public relatedCommunity$: BehaviorSubject<Community> = new BehaviorSubject<Community>(null);

  /**
   * The project/funding entity item
   */
  public entityItem$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * Representing if managing members of a funding
   */
  isFunding: boolean;

  constructor(
    protected authService: AuthService,
    protected groupService: GroupDataService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected projectAuthorizationService: ProjectAuthorizationService,
    protected projectGroupService: ProjectGroupService) {
  }

  ngOnInit(): void {
    this.route.data.pipe(
      map((data) => data.projectItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload()
    ).subscribe((project: Item) => {
      this.entityItem$.next(project);
      this.isFunding = project.entityType !== PROJECT_ENTITY;
    });

    const projectCommunity$ = this.route.data.pipe(
      map((data) => data.projectItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      tap((project: Item) => {
        this.entityItem$.next(project);
        this.isFunding = project.entityType !== PROJECT_ENTITY;
      }),
      switchMap(() => this.route.data.pipe(
        map((data) => data.projectCommunity as RemoteData<Community>),
        redirectOn4xx(this.router, this.authService),
        getFirstSucceededRemoteDataPayload()
      ))
    );

    projectCommunity$.subscribe((project: Community) => {
      this.relatedCommunity$.next(project);
    });

    combineLatest([
      projectCommunity$,
      this.projectAuthorizationService.isAdmin(),
      this.projectAuthorizationService.isFunderOrganizationalManager()
    ]).pipe(
      filter(([community, isAdmin, isFunderOrganizationalManager]) => {
        if (this.isFunding) {
          this.fundersGroupInit$.next(true);
        }
        return !this.isFunding && (isAdmin || isFunderOrganizationalManager);
      }),
      map(([community, isAdmin, isFunderOrganizationalManager]) => community),
      switchMap((community: Community) => {
        return this.projectGroupService.getProjectFundersGroupUUIDByCommunity(community);
      }),
      map((groups: string[]) => groups[0]),
      switchMap((groupID) => this.groupService.findById(groupID)),
      getFirstCompletedRemoteData()
    ).subscribe((groupRD: RemoteData<Group>) => {
      this.fundersGroupInit$.next(true);
      if (groupRD.hasSucceeded) {
        this.fundersGroup$.next(groupRD.payload);
      }
    });

    projectCommunity$.pipe(
      switchMap((community: Community) => {
        if (this.isFunding) {
          return this.projectGroupService.getInvitationFundingCoordinatorsAndMembersGroupsByCommunity(community);
        } else {
          return this.projectGroupService.getProjectCoordinatorsGroupUUIDByCommunity(community);
        }
      }),
      map((groups: string[]) => groups[0]),
      switchMap((groupID) => this.groupService.findById(groupID)),
      getFirstCompletedRemoteData()
    ).subscribe((groupRD: RemoteData<Group>) => {
      if (groupRD.hasSucceeded) {
        this.coordinatorsGroup$.next(groupRD.payload);
      }
    });

    projectCommunity$.pipe(
      switchMap((community: Community) => {
        if (this.isFunding) {
          return this.projectGroupService.getInvitationFundingMembersGroupsByCommunity(community);
        } else {
          return this.projectGroupService.getInvitationProjectMembersGroupsByCommunity(community);
        }
      }),
      map((groups: string[]) => groups[0]),
      switchMap((groupID) => this.groupService.findById(groupID)),
      getFirstCompletedRemoteData()
    ).subscribe((groupRD: RemoteData<Group>) => {
      if (groupRD.hasSucceeded) {
        this.membersGroup$.next(groupRD.payload);
      }
    });
  }

  ngOnDestroy(): void {
    this.groupService.cancelEditGroup();
  }
}
