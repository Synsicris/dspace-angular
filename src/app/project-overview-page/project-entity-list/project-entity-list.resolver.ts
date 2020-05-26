import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { hasNoValue } from '../../shared/empty.util';
import { ProjectEntityList } from './project-entity-list.model';

/**
 * The class that resolves an entity list for a route
 */
@Injectable()
export class ProjectEntityListResolver implements Resolve<string[]> {

  /**
   * Method for resolving a project entity list
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns entity list
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string[] {
    const name = route.params.name;
    const type = route.params.type;
    if (hasNoValue(name) || hasNoValue(type)) {
      throw new Error('You provided an ProjectEntityListResolver for url \"' + route.url + '\" but no name or type in the route\'s data')
    }

    return this.getEntityList(name, type);
  }

  private getEntityList(name, type): string[] {
    let list: string[] = []
    if (ProjectEntityList.has(name) && ProjectEntityList.get(name).has(type)) {
      list = ProjectEntityList.get(name).get(type)
    }

    return list
  }
}
