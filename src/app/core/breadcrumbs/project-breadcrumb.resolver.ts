import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ProjectDsoBreadcrumbsService } from './project-dso-breadcrumbs.service';
import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { getFinishedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { ProjectDataService } from '../project/project-data.service';
import { Item } from '../shared/item.model';
import { ItemDataService } from '../data/item-data.service';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';

/**
 * The class that resolves the BreadcrumbConfig object for a Project
 */
@Injectable()
export class ProjectBreadcrumbResolver extends DSOBreadcrumbResolver<Item> {
  constructor(
    protected breadcrumbService: ProjectDsoBreadcrumbsService,
    protected dataService: ItemDataService,
    protected projectService: ProjectDataService
  ) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Item>[] {
    return [];
  }

  /**
   * Method for resolving a breadcrumb config object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BreadcrumbConfig<Item>> {
    const uuid = route.params.projectId;
    this.projectService.getProjectItemByProjectCommunityId(uuid);
    return this.projectService.getProjectItemByProjectCommunityId(uuid).pipe(
      getFinishedRemoteData(),
      getRemoteDataPayload(),
      map((object: Item) => {
        const url = getItemPageRoute(object);
        return { provider: this.breadcrumbService, key: object, url: url };
      })
    );
  }
}
