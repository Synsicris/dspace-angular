import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { RemoteData } from '../data/remote-data';
import { Community } from '../shared/community.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { ProjectDataService } from './project-data.service';

/**
 * This class represents a resolver that requests a specific project before the route is activated
 */
@Injectable()
export class ProjectCommunityResolver implements Resolve<RemoteData<Community>> {

  routeParam = 'id';

  constructor(private projectService: ProjectDataService) {
  }

  /**
   * Method for resolving a community based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Community>> Emits the found community based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Community>> {
    return this.projectService.getProjectCommunityByItem(
      route.params[this.routeParam]
    ).pipe(
      getFirstCompletedRemoteData()
    );
  }
}
