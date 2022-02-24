import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { hasNoValue, isNotEmpty } from '../../shared/empty.util';
import { ProjectDataService } from '../project/project-data.service';
import { ProjectItemI18nBreadcrumbsService } from './project-item-i18n-breadcrumbs.service';

/**
 * The class that resolves a BreadcrumbConfig object with an i18n key string for a route
 */
@Injectable()
export class ProjectItemI18nBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>> {
  constructor(
    protected breadcrumbService: ProjectItemI18nBreadcrumbsService,
    protected projectService: ProjectDataService) {
  }

  /**
   * Method for resolving an I18n breadcrumb configuration object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    let key = route.data.breadcrumbKey;
    const projectId = route.params.projectId || route.params.id;
    if (hasNoValue(key)) {
      throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data');
    }
    const fullPath = route.url.join('');
    if (isNotEmpty(projectId)) {
      key = projectId + '::' + key;
    }
    return { provider: this.breadcrumbService, key: key, url: fullPath };
  }
}
