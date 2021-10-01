import { Injectable } from '@angular/core';

import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { DSONameService } from './dso-name.service';
import { LinkService } from '../cache/builders/link.service';
import { ProjectDataService } from '../project/project-data.service';
import { getFinishedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { BREADCRUMB_MESSAGE_POSTFIX } from './project-i18n-breadcrumbs.service';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';
import { Item } from '../shared/item.model';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';

/**
 * Service to calculate DSpaceObject breadcrumbs for a single part of the route including the project path
 */
@Injectable()
export class SubprojectI18nBreadcrumbsService implements BreadcrumbsProviderService<string>  {

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
    let i18nKey = key;
    if (key.includes('::')) {
      [projectId, subprojectId, i18nKey] = key.split('::');
      const project$: Observable<Item> = this.projectService.getProjectItemByProjectCommunityId(projectId).pipe(
        getFinishedRemoteData(),
        getRemoteDataPayload()
      );
      const subproject$: Observable<Item> = this.projectService.getProjectItemByProjectCommunityId(subprojectId).pipe(
        getFinishedRemoteData(),
        getRemoteDataPayload()
      );
      return combineLatest([project$, subproject$]).pipe(
        take(1),
        map(([project, subproject]: [Item, Item]) => {
          const projectUrl = getItemPageRoute(project);
          const subprojectUrl = getItemPageRoute(subproject);
          return [
            new Breadcrumb(this.dsoNameService.getName(project), projectUrl),
            new Breadcrumb(this.dsoNameService.getName(subproject), subprojectUrl),
            new Breadcrumb(i18nKey + BREADCRUMB_MESSAGE_POSTFIX, url)
          ];
        })
      );
    } else {
      return observableOf([new Breadcrumb(key + BREADCRUMB_MESSAGE_POSTFIX, url)]);
    }

  }
}

