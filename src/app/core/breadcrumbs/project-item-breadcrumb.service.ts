import { Injectable } from '@angular/core';
import { DSONameService } from './dso-name.service';
import { ProjectDataService } from '../project/project-data.service';
import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf } from 'rxjs';
import { ChildHALResource } from '../shared/child-hal-resource.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { RemoteData } from '../data/remote-data';
import { hasValue } from '../../shared/empty.util';
import { getDSORoute } from '../../app-routing-paths';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { LinkService } from '../cache/builders/link.service';
import { getFirstCompletedRemoteData } from '../shared/operators';

/**
 * The class that resolves the BreadcrumbConfig object for a Collection
 */
@Injectable()
export class ProjectItemBreadcrumbService extends DSOBreadcrumbsService {

  constructor(
    protected linkService: LinkService,
    protected dsoNameService: DSONameService,
    protected projectService: ProjectDataService
  ) {
    super(linkService, dsoNameService);
  }

  /**
   * Method to recursively calculate the breadcrumbs
   * This method returns the name and url of the key and all its parent DSOs recursively, top down
   * @param key The key (a DSpaceObject) used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: ChildHALResource & DSpaceObject, url: string): Observable<Breadcrumb[]> {
    const label = this.dsoNameService.getName(key);
    const crumb = new Breadcrumb(label, url);

    return this.projectService.getProjectItemByItemId(key.uuid).pipe(
      getFirstCompletedRemoteData(),
      switchMap((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => {
        if (hasValue(parentRD?.payload) && parentRD?.payload?.uuid !== key.uuid) {
          const parent = parentRD.payload;
          return this.getBreadcrumbs(parent, getDSORoute(parent));
        }
        return observableOf([]);
      }),
      map((breadcrumbs: Breadcrumb[]) => [...breadcrumbs, crumb])
    );
  }
}
