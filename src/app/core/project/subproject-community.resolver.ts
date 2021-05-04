import { Injectable } from '@angular/core';

import { ProjectCommunityResolver } from './project-community.resolver';

/**
 * This class represents a resolver that requests a specific project before the route is activated
 */
@Injectable()
export class SubprojectCommunityResolver extends ProjectCommunityResolver {

  routeParam = 'id';

}
