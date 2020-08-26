import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { DSONameService } from './dso-name.service';
import { ChildHALResource } from '../shared/child-hal-resource.model';
import { LinkService } from '../cache/builders/link.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';

/**
 * Service to calculate DSpaceObject breadcrumbs for a single part of the route including the project path
 */
@Injectable()
export class ProjectDsoBreadcrumbsService extends DSOBreadcrumbsService {

  constructor(
    protected linkService: LinkService,
    protected dsoNameService: DSONameService
  ) {
    super(linkService, dsoNameService)
  }

  /**
   * Method to calculate the breadcrumbs
   * @param key The key (a DSpaceObject) used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: ChildHALResource & DSpaceObject, url: string): Observable<Breadcrumb[]> {
    const label = this.dsoNameService.getName(key);
    const projectCrumb = new Breadcrumb(label, url);
    return observableOf([projectCrumb])
  }
}
