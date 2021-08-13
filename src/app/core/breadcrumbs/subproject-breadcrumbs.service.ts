import { Injectable } from '@angular/core';

import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { DSONameService } from './dso-name.service';
import { LinkService } from '../cache/builders/link.service';
import { ProjectDataService } from '../project/project-data.service';
import { getFinishedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { Community } from '../shared/community.model';
import { BREADCRUMB_MESSAGE_POSTFIX } from './project-i18n-breadcrumbs.service';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';

/**
 * Service to calculate DSpaceObject breadcrumbs for a single part of the route including the project path
 */
@Injectable()
export class SubprojectBreadcrumbsService implements BreadcrumbsProviderService<string>  {

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
    let subprojectId;
    if (key.includes('::')) {
      [projectId, subprojectId] = key.split('::');
      const project$: Observable<Community> = this.projectService.findById(projectId).pipe(
        getFinishedRemoteData(),
        getRemoteDataPayload()
      );
      const subproject$: Observable<Community> = this.projectService.findById(subprojectId).pipe(
        getFinishedRemoteData(),
        getRemoteDataPayload()
      );
      return combineLatest([project$, subproject$]).pipe(
        take(1),
        map(([project, subproject]: [Community, Community]) => {
          return [
            new Breadcrumb(this.dsoNameService.getName(project), `/project-overview/${projectId}`),
            new Breadcrumb(this.dsoNameService.getName(subproject), url)
          ];
        })
      );
    } else {
      return observableOf([new Breadcrumb(key + BREADCRUMB_MESSAGE_POSTFIX, url)]);
    }

  }
}

