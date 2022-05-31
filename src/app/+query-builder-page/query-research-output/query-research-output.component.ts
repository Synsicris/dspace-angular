import { Component } from '@angular/core';

import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-page.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ds-query-research-output',
  templateUrl: './query-research-output.component.html',
  styleUrls: ['./query-research-output.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
})
export class QueryResearchOutputComponent {
  /**
   * First tab checker
   * Set as default opened tab
   * @memberof QueryResearchOutputComponent
   */
  searchAll = true;

  /**
   * Second tab checker
   *
   * @memberof QueryResearchOutputComponent
   */
  searchSelected = false;

  /**
   * Configuration name
   *
   * @memberof QueryResearchOutputComponent
   */
  queryBuilderConfigurationName = environment.projects.projectsFunder.searchQueryConfigurationName;

  /**
   * Configuration name
   *
   * @memberof QueryResearchOutputComponent
   */
  projectsConfigurationName = environment.projects.projectsFunder.searchProjectConfigurationName;

  /**
   * Configuration name
   *
   * @memberof QueryResearchOutputComponent
   */
  projectItemsConfigurationName = environment.projects.projectsFunder.searchProjectItemsConfigurationName;

  /**
   * Composed query
   *
   * @type {string}
   * @memberof QueryResearchOutputComponent
   */
  searchQuery: string;

  /**
   * @param tabNr number of the selected tab
   */
  onTabSelect(tabNr: number) {
    switch (tabNr) {
      case CollapsibleTabs.One:
        this.searchSelected = false;
        this.searchAll = true;
        break;

      case CollapsibleTabs.Two:
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
  One = 1,
  Two = 2,
}
