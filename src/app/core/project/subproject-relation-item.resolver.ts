import { Injectable } from '@angular/core';

import { ProjectRelationItemResolver } from './project-relation-item.resolver';

/**
 * This class represents a resolver that retrieve item that describe the subproject from synsicris.relation.entity_project metadata
 */
@Injectable()
export class SubprojectRelationItemResolver extends ProjectRelationItemResolver {

  routeParam = 'id';

}