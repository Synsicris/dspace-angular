import { Injectable } from '@angular/core';

import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ProjectDsoBreadcrumbsService } from './project-dso-breadcrumbs.service';
import { Item } from '../shared/item.model';
import { ItemDataService } from '../data/item-data.service';

/**
 * The class that resolves the BreadcrumbConfig object for a Collection
 */
@Injectable()
export class ProjectItemBreadcrumbResolver extends DSOBreadcrumbResolver<Item> {
  constructor(protected breadcrumbService: ProjectDsoBreadcrumbsService, protected dataService: ItemDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): Array<FollowLinkConfig<Item>> {
    return [
      followLink('owningCollection', undefined, true,
        followLink('parentCommunity', undefined, true,
          followLink('parentCommunity'))
      ),
      followLink('bundles'),
      followLink('relationships')
    ];
  }
}
