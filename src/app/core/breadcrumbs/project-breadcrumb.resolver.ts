import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ProjectDsoBreadcrumbsService } from './project-dso-breadcrumbs.service';
import { Community } from '../shared/community.model';
import { CommunityDataService } from '../data/community-data.service';
import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { getFinishedRemoteData, getRemoteDataPayload } from '../shared/operators';

/**
 * The class that resolves the BreadcrumbConfig object for a Project
 */
@Injectable()
export class ProjectBreadcrumbResolver extends DSOBreadcrumbResolver<Community> {
  constructor(protected breadcrumbService: ProjectDsoBreadcrumbsService, protected dataService: CommunityDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): Array<FollowLinkConfig<Community>> {
    return [];
  }

  /**
   * Method for resolving a breadcrumb config object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BreadcrumbConfig<Community>> {
    const uuid = route.params.projectId;
    return this.dataService.findById(uuid, ...this.followLinks).pipe(
      getFinishedRemoteData(),
      getRemoteDataPayload(),
      map((object: Community) => {
        const fullPath = state.url;
        const url = fullPath.substr(0, fullPath.indexOf(uuid)) + uuid;
        return { provider: this.breadcrumbService, key: object, url: url };
      })
    );
  }
}
