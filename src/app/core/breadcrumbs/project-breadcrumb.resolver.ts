import { Injectable } from '@angular/core';

import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { ProjectDsoBreadcrumbsService } from './project-dso-breadcrumbs.service';
import { Community } from '../shared/community.model';
import { CommunityDataService } from '../data/community-data.service';

/**
 * The class that resolves the BreadcrumbConfig object for a Project
 */
@Injectable()
export class ProjectBreadcrumbResolver extends DSOBreadcrumbResolver<Community> {
  constructor(protected breadcrumbService: ProjectDsoBreadcrumbsService, protected dataService: CommunityDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): Array<FollowLinkConfig<Community>> {
    return [];
  }
}
