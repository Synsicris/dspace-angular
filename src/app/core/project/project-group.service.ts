import { Injectable } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';

import { Community } from '../shared/community.model';
import { GroupDataService } from '../eperson/group-data.service';
import { getFirstSucceededRemoteDataPayload, getFirstSucceededRemoteListPayload } from '../shared/operators';
import { map, mergeMap, reduce } from 'rxjs/operators';
import { Group } from '../eperson/models/group.model';
import { CommunityDataService } from '../data/community-data.service';

const PROJECT_GROUP_TEMPLATE = 'project_%s_';
const PROJECT_COORDINATORS_GROUP_TEMPLATE = 'project_%s_coordinators_group';
const PROJECT_FUNDERS_GROUP_TEMPLATE = 'project_%s_funders_group';
const PROJECT_MEMBERS_GROUP_TEMPLATE = 'project_%s_members_group';
const PROJECT_READERS_GROUP_TEMPLATE = 'project_%s_readers_group';

const FUNDING_GROUP_TEMPLATE = 'funding_%s_';
const FUNDING_COORDINATORS_GROUP_TEMPLATE = 'funding_%s_coordinators_group';
const FUNDING_MEMBERS_GROUP_TEMPLATE = 'funding_%s_members_group';

@Injectable()
export class ProjectGroupService {

  constructor(
    protected communityService: CommunityDataService,
    protected groupService: GroupDataService) {
  }

  getCommunityIdByGroupName(groupName: string): string {
    const groupNameArray = groupName.split('_');

    return groupNameArray[1];
  }

  getFundingAdminsGroupNameByCommunity(project: Community): string {
    return FUNDING_COORDINATORS_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectCoordinatorsGroupNameByCommunity(project: Community): string {
    return PROJECT_COORDINATORS_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectCoordinatorsGroupUUIDByCommunity(project: Community): Observable<string[]> {
    const query = this.getProjectCoordinatorsGroupNameByCommunity(project);
    return this.getGroupsByQuery(query);
  }

  getProjectFundersGroupNameByCommunity(project: Community): string {
    return PROJECT_FUNDERS_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectFundersGroupUUIDByCommunity(project: Community): Observable<string[]> {
    const query = this.getProjectFundersGroupNameByCommunity(project);
    return this.getGroupsByQuery(query);
  }

  getProjectMembersGroupNameByCommunity(project: Community): string {
    return PROJECT_MEMBERS_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectReadersGroupNameByCommunity(project: Community): string {
    return PROJECT_READERS_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectReadersGroupUUIDByCommunity(project: Community): Observable<string[]> {
    const query = this.getProjectReadersGroupNameByCommunity(project);
    return this.getGroupsByQuery(query);
  }

  getFundingMembersGroupNameByCommunity(project: Community): string {
    return FUNDING_MEMBERS_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectMembersGroupUUIDByCommunity(project: Community): Observable<string[]> {
    const query = this.getProjectMembersGroupNameByCommunity(project);
    return this.getGroupsByQuery(query);
  }

  getFundingMembersGroupUUIDByCommunity(project: Community): Observable<string[]> {
    const query = this.getFundingMembersGroupNameByCommunity(project);
    return this.getGroupsByQuery(query);
  }

  getInvitationProjectMembersGroupsByCommunity(project: Community): Observable<string[]> {
    return this.getProjectMembersGroupUUIDByCommunity(project);
  }

  getAllFundingGroupsByCommunity(funding: Community): Observable<string[]> {
    const query = FUNDING_GROUP_TEMPLATE.replace('%s', funding.uuid);
    return this.getGroupsByQuery(query);
  }

  getInvitationProjectAllGroupsByCommunity(project: Community): Observable<string[]> {
    const query = PROJECT_GROUP_TEMPLATE.replace('%s', project.uuid);
    return this.getGroupsByQuery(query);
  }

  getInvitationProjectCoordinatorsAndMembersGroupsByCommunity(project: Community): Observable<string[]> {
    const projectCoordinators$ = this.getProjectCoordinatorsGroupUUIDByCommunity(project);
    const projectMembers$ = this.getProjectMembersGroupUUIDByCommunity(project);
    return combineLatest([projectCoordinators$, projectMembers$]).pipe(
      map(([projectCoordinators, projectMembers]) => [...projectCoordinators, ...projectMembers])
    );
  }

  getInvitationFundingCoordinatorsAndMembersGroupsByCommunity(funding: Community): Observable<string[]> {
    const fundingMembers$ = this.getAllFundingGroupsByCommunity(funding);
    const projectMembers$ = this.communityService.findByHref(funding._links.parentCommunity.href).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((subprojectsCommunity: Community) => this.communityService.findByHref(subprojectsCommunity._links.parentCommunity.href)),
      getFirstSucceededRemoteDataPayload(),
      mergeMap((parentProjectCommunity: Community) => this.getInvitationProjectMembersGroupsByCommunity(parentProjectCommunity))
    );
    return combineLatest([fundingMembers$, projectMembers$]).pipe(
      map(([fundingMembers, projectMembers]) => [...fundingMembers, ...projectMembers])
    );
  }

  getInvitationFundingMembersGroupsByCommunity(funding: Community): Observable<string[]> {
    const fundingMembers$ = this.getFundingMembersGroupUUIDByCommunity(funding);
    const projectMembers$ = this.communityService.findByHref(funding._links.parentCommunity.href).pipe(
      getFirstSucceededRemoteDataPayload(),
      mergeMap((fundingCommunity: Community) => this.communityService.findByHref(fundingCommunity._links.parentCommunity.href)),
      getFirstSucceededRemoteDataPayload(),
      mergeMap((parentProjectCommunity: Community) => this.getInvitationProjectMembersGroupsByCommunity(parentProjectCommunity))
    );
    return combineLatest([fundingMembers$, projectMembers$]).pipe(
      map(([fundingMembers, projectMembers]) => [...fundingMembers, ...projectMembers])
    );
  }

  isMembersOfAdminGroup(project: Community): Observable<boolean> {
    return this.groupService.isMemberOf( this.getProjectCoordinatorsGroupNameByCommunity(project));
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
