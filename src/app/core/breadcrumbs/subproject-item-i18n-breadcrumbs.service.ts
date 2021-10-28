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
export class SubprojectItemI18nBreadcrumbsService implements BreadcrumbsProviderService<string>  {

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
    let subprojectId;
    let i18nKey = key;
    if (key.includes('::')) {
      [subprojectId, i18nKey] = key.split('::');
      const project$: Observable<Item> = this.projectService.getProjectItemByItemId(subprojectId).pipe(
        getFinishedRemoteData(),
        getRemoteDataPayload()
      );
      const subproject$: Observable<Item> = this.projectService.getSubprojectItemByItemId(subprojectId).pipe(
        getFinishedRemoteData(),
        getRemoteDataPayload()
      );
      return combineLatest([project$, subproject$]).pipe(
        take(1),
        map(([project, subproject]: [Item, Item]) => {
          const breadcrumb = [];
          let itemUrl;
          if (project) {
            itemUrl = getItemPageRoute(project);
            breadcrumb.push(new Breadcrumb(this.dsoNameService.getName(project), itemUrl));
          }
          if (subproject && project?.id !== subproject?.id) {
            itemUrl = getItemPageRoute(subproject);
            breadcrumb.push(new Breadcrumb(this.dsoNameService.getName(subproject), itemUrl));
          }
          breadcrumb.push(new Breadcrumb(i18nKey + BREADCRUMB_MESSAGE_POSTFIX, url));
          return breadcrumb;
        })
      );
    } else {
      return observableOf([new Breadcrumb(key + BREADCRUMB_MESSAGE_POSTFIX, url)]);
    }

  }
}

