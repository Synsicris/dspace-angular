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
import { BREADCRUMB_ENTITY_PREFIX } from './project-item-i18n-breadcrumbs.service';
import { getDSORoute } from '../../app-routing-paths';

/**
 * Service to calculate DSpaceObject breadcrumbs for a single part of the route including the project path
 */
@Injectable()
export class SubprojectItemI18nBreadcrumbsService implements BreadcrumbsProviderService<string> {

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
      const subproject$: Observable<Item> = this.projectService.getFundingItemByItemId(subprojectId).pipe(
        getFinishedRemoteData(),
        getRemoteDataPayload()
      );
      return combineLatest([project$, subproject$]).pipe(
        take(1),
        map(([project, subproject]: [Item, Item]) =>
          [].concat(
            project ? this.computeBreadCrumbs(null, project) : [],
            subproject && project?.id !== subproject?.id ? this.computeBreadCrumbs(project, subproject) : [],
            new Breadcrumb(i18nKey + BREADCRUMB_MESSAGE_POSTFIX, url)
          )
        )
      );
    } else {
      return observableOf([new Breadcrumb(key + BREADCRUMB_MESSAGE_POSTFIX, url)]);
    }

  }

  private computeBreadCrumbs(parent: Item, item: Item): Breadcrumb[] {
    const entityType = this.dsoNameService.getEntityType(item);
    return [].concat(
      entityType && new Breadcrumb(BREADCRUMB_ENTITY_PREFIX + entityType, getDSORoute(parent)) || [],
      new Breadcrumb(this.dsoNameService.getName(item), getItemPageRoute(item))
    );
  }
}

