import { Injectable } from '@angular/core';

import { map, switchMap, take } from 'rxjs/operators';
import { combineLatest, Observable, of as observableOf } from 'rxjs';

import { DSONameService } from './dso-name.service';
import {
  FUNDING_ENTITY,
  FUNDING_RELATION_METADATA,
  PROJECT_ENTITY,
  PROJECT_RELATION_METADATA,
  ProjectDataService
} from '../project/project-data.service';
import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';

import { ChildHALResource } from '../shared/child-hal-resource.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { RemoteData } from '../data/remote-data';
import { hasValue } from '../../shared/empty.util';
import { getDSORoute } from '../../app-routing-paths';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { LinkService } from '../cache/builders/link.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { BREADCRUMB_ENTITY_PREFIX } from './project-item-i18n-breadcrumbs.service';
import { Metadata } from '../shared/metadata.utils';
import { Item } from '../shared/item.model';

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
    const entityType: string = this.dsoNameService.getEntityType(key);
    const relatedProject = Metadata.first(key.metadata, PROJECT_RELATION_METADATA);
    const relatedFunding = Metadata.first(key.metadata, FUNDING_RELATION_METADATA);
    let fundingCrumbs$ = observableOf([]);
    let projectCrumbs$ = observableOf([]);
    let crumbs$ = observableOf([]);
    let parentUrl = null;
    if (entityType !== FUNDING_ENTITY && entityType !== PROJECT_ENTITY && hasValue(relatedFunding?.authority)) {
      fundingCrumbs$ =
        this.getNestedBreadcrumb(
          this.projectService.getFundingItemByItemId(key.uuid), key, parentUrl, entityType, label, url
        );
    } else if (entityType !== PROJECT_ENTITY && hasValue(relatedProject?.authority)) {
      projectCrumbs$ =
        this.getNestedBreadcrumb(
          this.projectService.getProjectItemByItemId(key.uuid), key, parentUrl, entityType, label, url
        );
    } else {
      crumbs$ = observableOf(
        [].concat(
          entityType != null ?
            [
              new Breadcrumb(
                BREADCRUMB_ENTITY_PREFIX + entityType,
                null,
                { [entityType]: true, separator: true }
              ),
            ] :
            []
        )
          .concat([new Breadcrumb(label, url)])
      );
    }

    return combineLatest([
      crumbs$,
      fundingCrumbs$,
      projectCrumbs$
    ]).pipe(
      take(1),
      map(([crumb, fundingCrumb, projectCrumb]) => [].concat(...projectCrumb, ...fundingCrumb, ...crumb))
    );
  }

  private getNestedBreadcrumb(
    remoteItem$: Observable<RemoteData<Item>>,
    key: ChildHALResource & DSpaceObject,
    parentUrl: string,
    entityType: string,
    label: string,
    url: string
  ): Observable<Breadcrumb[]> {
    return remoteItem$.pipe(
      getFirstCompletedRemoteData(),
      switchMap((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => {
        if (hasValue(parentRD?.payload) && parentRD?.payload?.uuid !== key.uuid) {
          const parent = parentRD.payload;
          parentUrl = getDSORoute(parent);
          return this.getBreadcrumbs(parent, parentUrl).pipe(
            map((breadcrumbs: Breadcrumb[]) => {
              return breadcrumbs.concat(
                entityType != null ?
                  [
                    new Breadcrumb(
                      BREADCRUMB_ENTITY_PREFIX + entityType,
                      `${parentUrl}/${entityType}`,
                      { [entityType]: true, separator: true }
                    )
                  ]
                  : [],
                new Breadcrumb(label, url)
              );
            })
          );
        }
        return observableOf([]);
      })
    );
  }
}
