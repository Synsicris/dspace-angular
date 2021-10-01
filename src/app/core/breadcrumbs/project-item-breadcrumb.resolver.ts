import { Injectable } from '@angular/core';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { Item } from '../shared/item.model';
import { ItemDataService } from '../data/item-data.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ProjectItemBreadcrumbService } from './project-item-breadcrumb.service';

/**
 * The class that resolves the BreadcrumbConfig object for a Collection
 */
@Injectable()
export class ProjectItemBreadcrumbResolver extends DSOBreadcrumbResolver<Item> {
  constructor(protected breadcrumbService: ProjectItemBreadcrumbService, protected dataService: ItemDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Item>[] {
    return [];
  }
}
