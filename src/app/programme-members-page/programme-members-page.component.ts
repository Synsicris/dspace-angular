import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { AuthService } from '../core/auth/auth.service';
import { GroupDataService } from '../core/eperson/group-data.service';
import { ProjectGroupService } from '../core/project/project-group.service';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  redirectOn4xx
} from '../core/shared/operators';
import { Group } from '../core/eperson/models/group.model';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';

@Component({
  selector: 'ds-programme-members-page',
  templateUrl: './programme-members-page.component.html',
  styleUrls: ['./programme-members-page.component.scss']
})
export class ProgrammeMembersPageComponent implements OnInit {
  /**
   * the active tab id
   */
  public activeId = 'members';

  /**
   * A boolean representing if all groups are initialized
   */
  public allGroupsInit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The project/funding entity item
   */
  public entityItem$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * The programme funder managers group
   */
  public managersGroup$: BehaviorSubject<Group> = new BehaviorSubject<Group>(null);

  /**
   * A boolean representing if coordinators group is initialized
   */
  public managersGroupInit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * The programme funder members group
   */
  public membersGroup$: BehaviorSubject<Group> = new BehaviorSubject<Group>(null);

  /**
   * A boolean representing if members group is initialized
   */
  public membersGroupInit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected authService: AuthService,
    protected groupService: GroupDataService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected authorizationService: AuthorizationDataService,
    protected projectGroupService: ProjectGroupService) {
  }

  ngOnInit(): void {
    const item$ = this.route.data.pipe(
      map((data) => data.programmeItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      tap((item: Item) => {
        this.entityItem$.next(item);
      })
    );

    this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
      tap((isAdmin) => {
        if (!isAdmin) {
          this.managersGroupInit$.next(true);
        }
      }),
      filter((isAdmin) => isAdmin),
      switchMap(() => item$),
      switchMap((item: Item) => this.projectGroupService.getProgrammeManagersGroupUUIDByItem(item)),
      map((groups: string[]) => groups[0]),
      switchMap((groupID) => this.groupService.findById(groupID)),
      getFirstCompletedRemoteData()
    ).subscribe((groupRD: RemoteData<Group>) => {
      if (groupRD.hasSucceeded) {
        this.activeId = 'funders';
        this.managersGroup$.next(groupRD.payload);
        this.managersGroupInit$.next(true);
      }
    });

    item$.pipe(
      switchMap((item: Item) => this.projectGroupService.getProgrammeMembersGroupUUIDByItem(item)),
      map((groups: string[]) => groups[0]),
      switchMap((groupID) => this.groupService.findById(groupID)),
      getFirstCompletedRemoteData()
    ).subscribe((groupRD: RemoteData<Group>) => {
      if (groupRD.hasSucceeded) {
        this.membersGroup$.next(groupRD.payload);
        this.membersGroupInit$.next(true);
      }
    });


    combineLatest([
      this.managersGroupInit$.asObservable(),
      this.membersGroupInit$.asObservable()
    ]).pipe(
      map(([managersInit, membersInit]) => {
        return managersInit && membersInit;
      }),
      distinctUntilChanged()
    ).subscribe((isInit) => {
      this.allGroupsInit$.next(isInit);
    });
  }

}
