import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Community } from '../shared/community.model';
import { GroupDataService } from '../eperson/group-data.service';
import { getFirstSucceededRemoteListPayload } from '../shared/operators';
import { map, mergeMap, reduce } from 'rxjs/operators';
import { Group } from '../eperson/models/group.model';

const PROJECT_GROUP_TEMPLATE = 'project_%s_';
const PROJECT_ADMIN_GROUP_TEMPLATE = 'project_%s_members_group';
const PROJECT_MEMBERS_GROUP_TEMPLATE = 'project_%s_members_group';
const SUBPROJECT_ADMIN_GROUP_TEMPLATE = 'project_%s_members_group';
const SUBPROJECT_MEMBERS_GROUP_TEMPLATE = 'project_%s_members_group';

@Injectable()
export class ProjectGroupService {

  constructor(protected groupService: GroupDataService) {
  }

  getProjectAdminsGroupNameByCommunity(project: Community): string {
    return PROJECT_ADMIN_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getProjectMembersGroupNameByCommunity(project: Community): string {
    return PROJECT_MEMBERS_GROUP_TEMPLATE.replace('%s', project.uuid);
  }

  getAllProjectGroupsByCommunity(project: Community): Observable<string[]> {
    const query = PROJECT_GROUP_TEMPLATE.replace('%s', project.uuid);
    return this.groupService.searchGroups(query).pipe(
      getFirstSucceededRemoteListPayload(),
      mergeMap((groups: Group[]) => groups),
      map((group: Group) => group.uuid),
      reduce((acc: any, value: any) => [...acc, value], []),
    );
  }
}
