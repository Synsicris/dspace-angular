import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';

import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Community } from '../shared/community.model';
import { CommunityDataService } from '../data/community-data.service';
import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { COMMUNITY_PAGE_LINKS_TO_FOLLOW } from '../../community-page/community-page.resolver';
import { SubprojectBreadcrumbsService } from './subproject-breadcrumbs.service';

/**
 * The class that resolves the BreadcrumbConfig object for a Project
 */
@Injectable()
export class SubProjectBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  constructor(protected breadcrumbService: SubprojectBreadcrumbsService, protected dataService: CommunityDataService) {
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Community>[] {
    return COMMUNITY_PAGE_LINKS_TO_FOLLOW;
  }

  /**
   * Method for resolving a breadcrumb config object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BreadcrumbConfig<string>> {
    const projectUuid = route.params.projectId;
    const subprojectUuid = route.params.id;
    const fullPath = state.url;
    const key = projectUuid + '::' + subprojectUuid;
    return observableOf({ provider: this.breadcrumbService, key: key, url: fullPath });
  }
}
