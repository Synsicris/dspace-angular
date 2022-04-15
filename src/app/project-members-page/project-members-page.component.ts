import { Component, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  redirectOn4xx
} from '../core/shared/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { ProjectGroupService } from '../core/project/project-group.service';
import { Group } from '../core/eperson/models/group.model';
import { GroupDataService } from '../core/eperson/group-data.service';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../core/shared/item.model';
import { PARENT_PROJECT_ENTITY } from '../core/project/project-data.service';

@Component({
  selector: 'ds-project-members-page',
  templateUrl: './project-members-page.component.html',
  styleUrls: ['./project-members-page.component.scss']
})
export class ProjectMembersPageComponent implements OnInit {

  /**
   * The project admin group
   */
  public projectAdminsGroup$: BehaviorSubject<Group> = new BehaviorSubject<Group>(null);
  /**
   * The project edit group
   */
  public projectMembersGroup$: BehaviorSubject<Group> = new BehaviorSubject<Group>(null);

  /**
   * The project community
   */
  public projectCommunity$: BehaviorSubject<Community> = new BehaviorSubject<Community>(null);

  /**
   * The project entity item
   */
  public projectItem$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * Representing if managing members of a subproject
   */
  isSubproject: boolean;

  constructor(
    protected authService: AuthService,
    protected groupService: GroupDataService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected projectGroupService: ProjectGroupService) {
  }

  ngOnInit(): void {
    this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload()
    ).subscribe((project: Community) => {
      this.projectCommunity$.next(project);
    });

    this.route.data.pipe(
      map((data) => data.projectItem as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload()
    ).subscribe((project: Item) => {
      this.projectItem$.next(project);
      this.isSubproject = project.entityType !== PARENT_PROJECT_ENTITY;
    });

    this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      switchMap((project: Community) => this.projectGroupService.getProjectAdminsGroupUUIDByCommunity(project)),
      map((groups: string[]) => groups[0]),
      switchMap((groupID) => this.groupService.findById(groupID)),
      getFirstCompletedRemoteData()
    ).subscribe((groupRD: RemoteData<Group>) => {
      if (groupRD.hasSucceeded) {
        this.projectAdminsGroup$.next(groupRD.payload);
      }
    });

    this.route.data.pipe(
      map((data) => data.projectCommunity as RemoteData<Community>),
      redirectOn4xx(this.router, this.authService),
      getFirstSucceededRemoteDataPayload(),
      switchMap((project: Community) => this.projectGroupService.getInvitationProjectMembersGroupsByCommunity(project)),
      map((groups: string[]) => groups[0]),
      switchMap((groupID) => this.groupService.findById(groupID)),
      getFirstCompletedRemoteData()
    ).subscribe((groupRD: RemoteData<Group>) => {
      if (groupRD.hasSucceeded) {
        this.projectMembersGroup$.next(groupRD.payload);
      }
    });
  }

}
