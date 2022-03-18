import { Injectable } from '@angular/core';

import { ProjectItemPageResolver } from './project-item-page.resolver';

/**
 * This class represents a resolver that retrieve item which id is present in 'objId' route param
 */
@Injectable()
export class ProjectObjectivesItemResolver extends ProjectItemPageResolver {

  routeParam = 'objId';

}
