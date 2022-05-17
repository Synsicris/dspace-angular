import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';

import { LinkService } from '../cache/builders/link.service';
import { DSONameService } from './dso-name.service';
import { getFinishedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';
import { Item } from '../shared/item.model';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { ItemDataService } from '../data/item-data.service';

/**
 * The postfix for i18n breadcrumbs
 */
export const BREADCRUMB_MESSAGE_POSTFIX = '.breadcrumbs';

/**
 * Service to calculate i18n breadcrumbs for a single part of the route including the project path
 */
@Injectable()
export class ProjectItemI18nBreadcrumbsService implements BreadcrumbsProviderService<string> {

  constructor(
    protected linkService: LinkService,
    protected dsoNameService: DSONameService,
    protected projectService: ItemDataService
  ) {
  }

  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    let projectId;
    let i18nKey = key;
    if (key.includes('::')) {
      [projectId, i18nKey] = key.split('::');
      return this.projectService.findById(projectId).pipe(
        getFinishedRemoteData(),
        getRemoteDataPayload(),
        map((object: Item) => {
          const itemUrl = getItemPageRoute(object);
          return [
            new Breadcrumb(this.dsoNameService.getName(object), itemUrl),
            new Breadcrumb(i18nKey + BREADCRUMB_MESSAGE_POSTFIX, url)
          ];
        })
      );
    } else {
      return observableOf([new Breadcrumb(i18nKey + BREADCRUMB_MESSAGE_POSTFIX, url)]);
    }

  }
}
