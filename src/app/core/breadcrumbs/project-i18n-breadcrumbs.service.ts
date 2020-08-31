import { Injectable } from '@angular/core';

import { Observable, of as obeservableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { LinkService } from '../cache/builders/link.service';
import { DSONameService } from './dso-name.service';
import { ProjectDataService } from '../project/project-data.service';
import { getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { Community } from '../shared/community.model';

/**
 * The postfix for i18n breadcrumbs
 */
export const BREADCRUMB_MESSAGE_POSTFIX = '.breadcrumbs';

/**
 * Service to calculate i18n breadcrumbs for a single part of the route including the project path
 */
@Injectable()
export class ProjectI18nBreadcrumbsService implements BreadcrumbsService<string> {

  constructor(
    protected linkService: LinkService,
    protected dsoNameService: DSONameService,
    protected projectService: ProjectDataService
  ) {
  }

  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    let projectId;
    let i18nKey = key
    if (key.includes('::')) {
      [projectId, i18nKey] = key.split('::');
      return this.projectService.findById(projectId).pipe(
        getFirstSucceededRemoteDataPayload(),
        map((project: Community) => {
          return [
            new Breadcrumb(this.dsoNameService.getName(project), `/project-overview/${projectId}`),
            new Breadcrumb(i18nKey + BREADCRUMB_MESSAGE_POSTFIX, url)
          ];
        })
      )
    } else {
      return obeservableOf([new Breadcrumb(i18nKey + BREADCRUMB_MESSAGE_POSTFIX, url)])
    }

  }
}
