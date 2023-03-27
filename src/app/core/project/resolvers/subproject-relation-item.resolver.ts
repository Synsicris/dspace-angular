import { Injectable } from '@angular/core';

import { ProjectItemByCommunityRelationResolver } from './project-item-by-community-relation.resolver';

/**
 * This class represents a resolver that retrieve item that describe the subproject from synsicris.relation.entity_project metadata
 */
@Injectable()
export class SubprojectRelationItemResolver extends ProjectItemByCommunityRelationResolver {

  routeParam = 'id';

}
