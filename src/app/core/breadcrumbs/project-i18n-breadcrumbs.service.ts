import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from './breadcrumbs.service';

/**
 * The postfix for i18n breadcrumbs
 */
export const BREADCRUMB_MESSAGE_POSTFIX = '.breadcrumbs';

/**
 * Service to calculate i18n breadcrumbs for a single part of the route including the project path
 */
@Injectable()
export class ProjectI18nBreadcrumbsService implements BreadcrumbsService<string> {

  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return observableOf([
      new Breadcrumb('project-overview.breadcrumbs', '/project-overview'),
      new Breadcrumb(key + BREADCRUMB_MESSAGE_POSTFIX, url)]
    );
  }
}
