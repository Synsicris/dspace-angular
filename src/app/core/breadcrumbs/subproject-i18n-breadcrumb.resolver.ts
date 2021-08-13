import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';

import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Community } from '../shared/community.model';
import { CommunityDataService } from '../data/community-data.service';
import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { COMMUNITY_PAGE_LINKS_TO_FOLLOW } from '../../+community-page/community-page.resolver';
import { hasNoValue } from '../../shared/empty.util';
import { SubprojectI18nBreadcrumbsService } from './subproject-i18n-breadcrumbs.service';

/**
 * The class that resolves the BreadcrumbConfig object for a Project
 */
@Injectable()
export class SubProjectI18nBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  constructor(protected breadcrumbService: SubprojectI18nBreadcrumbsService, protected dataService: CommunityDataService) {
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
    let key = route.data.breadcrumbKey;
    if (hasNoValue(key)) {
      throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data');
    }
    const i18nKey = key;
    const projectUuid = route.params.projectId;
    const subprojectUuid = route.params.id;
    const fullPath = state.url;
    key = projectUuid + '::' + subprojectUuid + '::' + i18nKey;
    return observableOf({ provider: this.breadcrumbService, key: key, url: fullPath });
  }
}
