import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { RemoteData } from '../data/remote-data';
import { Item } from '../shared/item.model';
import { ProjectDataService } from './project-data.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

/**
 * This class represents a resolver that retrieve item that describe the project from synsicris.relation.parentproject metadata
 */
@Injectable()
export class ProjectItemByItemRelationResolver implements Resolve<RemoteData<Item>> {

  routeParam = 'id';

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
    return this.projectService.getProjectItemByItemId(route.params[this.routeParam]);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Item>[] {
    return [];
  }
}
