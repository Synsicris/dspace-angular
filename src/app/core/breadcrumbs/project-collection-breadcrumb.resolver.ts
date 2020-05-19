import { Injectable } from '@angular/core';

import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { Collection } from '../shared/collection.model';
import { CollectionDataService } from '../data/collection-data.service';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ProjectDsoBreadcrumbsService } from './project-dso-breadcrumbs.service';

/**
 * The class that resolves the BreadcrumbConfig object for a Collection
 */
@Injectable()
export class ProjectCollectionBreadcrumbResolver extends DSOBreadcrumbResolver<Collection> {
  constructor(protected breadcrumbService: ProjectDsoBreadcrumbsService, protected dataService: CollectionDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): Array<FollowLinkConfig<Collection>> {
    return [
      followLink('parentCommunity', undefined, true,
        followLink('parentCommunity')
      )
    ];
  }
}
