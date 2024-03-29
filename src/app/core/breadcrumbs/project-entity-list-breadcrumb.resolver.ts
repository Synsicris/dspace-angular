import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { hasNoValue } from '../../shared/empty.util';
import { ProjectI18nBreadcrumbsService } from './project-i18n-breadcrumbs.service';

/**
 * The class that resolves a BreadcrumbConfig object with an i18n key string for a route
 */
@Injectable()
export class ProjectEntityListBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  constructor(protected breadcrumbService: ProjectI18nBreadcrumbsService) {
  }

  /**
   * Method for resolving an I18n breadcrumb configuration object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    const key = route.params.name + '_' + route.params.type;
    if (hasNoValue(key)) {
      throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data');
    }
    const fullPath = route.url.join('');
    return { provider: this.breadcrumbService, key: key, url: fullPath };
  }
}
