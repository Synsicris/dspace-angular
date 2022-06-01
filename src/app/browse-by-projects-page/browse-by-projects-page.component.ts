import { Component } from '@angular/core';

import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'ds-browse-by-projects-page',
  templateUrl: './browse-by-projects-page.component.html',
  styleUrls: ['./browse-by-projects-page.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
})
export class BrowseByProjectsPageComponent {
  /**
   * First tab checker
   * Set as default opened tab
   * @memberof BrowseByProjectsPageComponent
   */
  searchAll = true;

  /**
   * Second tab checker
   *
   * @memberof BrowseByProjectsPageComponent
   */
  searchSelected = false;

  /**
   * Configuration name
   *
   * @memberof BrowseByProjectsPageComponent
   */
  queryBuilderConfigurationName = environment.projects.projectsFunder.searchQueryConfigurationName;

  /**
   * Configuration name
   *
   * @memberof BrowseByProjectsPageComponent
   */
  projectsConfigurationName = environment.projects.projectsFunder.searchProjectConfigurationName;

  /**
   * Configuration name
   *
   * @memberof BrowseByProjectsPageComponent
   */
  projectItemsConfigurationName = environment.projects.projectsFunder.searchProjectItemsConfigurationName;

  /**
   * Composed query
   *
   * @type {string}
   * @memberof BrowseByProjectsPageComponent
   */
  searchQuery: string;

  /**
   * @param tabNr number of the selected tab
   */
  onTabSelect(tabNr: number) {
    switch (tabNr) {
      case CollapsibleTabs.All:
        this.searchSelected = false;
        this.searchAll = true;
        break;

      case CollapsibleTabs.Query:
        this.searchAll = false;
        this.searchSelected = true;
        break;

      default:
        break;
    }
  }

  /**
   * @param query the event to get the query value from the query-builder
   */
  getSearchQuery(query: string) {
    this.searchQuery = query;
  }
}

export enum CollapsibleTabs {
  All = 1,
  Query = 2,
}
