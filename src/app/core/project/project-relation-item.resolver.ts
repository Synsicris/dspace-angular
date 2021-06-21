import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { RemoteData } from '../data/remote-data';
import { Item } from '../shared/item.model';
import { ProjectDataService } from './project-data.service';

/**
 * This class represents a resolver that retrieve item that describe the project from synsicris.relation.entity_project metadata
 */
@Injectable()
export class ProjectRelationItemResolver implements Resolve<RemoteData<Item>> {

  routeParam = 'projectId';

  constructor(private projectService: ProjectDataService) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found Item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    return this.projectService.getProjectItemByRelation(route.params[this.routeParam]);
  }
}
