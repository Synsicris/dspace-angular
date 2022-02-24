import { Injectable } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';

import { Community } from '../shared/community.model';
import { GroupDataService } from '../eperson/group-data.service';
import { getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from '../shared/operators';
import { map, mergeMap, reduce } from 'rxjs/operators';
import { Group } from '../eperson/models/group.model';
import { CommunityDataService } from '../data/community-data.service';

const PROJECT_GROUP_TEMPLATE = 'project_%s_';
const PROJECT_ADMIN_GROUP_TEMPLATE = 'project_%s_admin_group';
const PROJECT_MEMBERS_GROUP_TEMPLATE = 'project_%s_members_group';

@Injectable()
export class ProjectGroupService {

  constructor(
    protected communityService: CommunityDataService,
    protected groupService: GroupDataService) {
  }

  getProjectAdminsGroupNameByCommunity(project: Community): string {
    return PROJECT_ADMIN_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectAdminsGroupUUIDByCommunity(project: Community): Observable<string[]> {
    const query = this.getProjectAdminsGroupNameByCommunity(project);
    return this.getGroupsByQuery(query);
  }

  getProjectMembersGroupNameByCommunity(project: Community): string {
    return PROJECT_MEMBERS_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectMembersGroupUUIDByCommunity(project: Community): Observable<string[]> {
    const query = this.getProjectMembersGroupNameByCommunity(project);
    return this.getGroupsByQuery(query);
  }

  getInvitationProjectMembersGroupsByCommunity(project: Community): Observable<string[]> {
    return this.getProjectMembersGroupUUIDByCommunity(project);
  }

  getInvitationProjectAllGroupsByCommunity(project: Community): Observable<string[]> {
    const query = PROJECT_GROUP_TEMPLATE.replace('%s', project.uuid);
    return this.getGroupsByQuery(query);
  }

  getInvitationSubprojectAdminsGroupsByCommunity(subproject: Community): Observable<string[]> {
    const subprojectMembers$ = this.getInvitationProjectAllGroupsByCommunity(subproject);
    const projectMembers$ = this.communityService.findByHref(subproject._links.parentCommunity.href).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((subprojectsCommunity: Community) => this.communityService.findByHref(subprojectsCommunity._links.parentCommunity.href)),
      getFirstSucceededRemoteDataPayload(),
      mergeMap((parentProjectCommunity: Community) => this.getInvitationProjectMembersGroupsByCommunity(parentProjectCommunity))
    );
    return combineLatest([subprojectMembers$, projectMembers$]).pipe(
      map(([subprojectMembers, projectMembers]) => [...subprojectMembers, ...projectMembers])
    );
  }

  getInvitationSubprojectMembersGroupsByCommunity(subproject: Community): Observable<string[]> {
    const subprojectMembers$ = this.getInvitationProjectMembersGroupsByCommunity(subproject);
    const projectMembers$ = this.communityService.findByHref(subproject._links.parentCommunity.href).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((subprojectsCommunity: Community) => this.communityService.findByHref(subprojectsCommunity._links.parentCommunity.href)),
      getFirstSucceededRemoteDataPayload(),
      mergeMap((parentProjectCommunity: Community) => this.getInvitationProjectMembersGroupsByCommunity(parentProjectCommunity))
    );
    return combineLatest([subprojectMembers$, projectMembers$]).pipe(
      map(([subprojectMembers, projectMembers]) => [...subprojectMembers, ...projectMembers])
    );
  }

  isMembersOfAdminGroup(project: Community): Observable<boolean> {
    return this.groupService.isMemberOf( this.getProjectAdminsGroupNameByCommunity(project));
  }

  private getGroupsByQuery(query: string): Observable<string[]> {
    return this.groupService.searchGroups(query).pipe(
      getFirstSucceededRemoteListPayload(),
      mergeMap((groups: Group[]) => groups),
      map((group: Group) => group.uuid),
      reduce((acc: any, value: any) => [...acc, value], []),
    );
  }
}
