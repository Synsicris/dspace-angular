import { Component, OnInit } from '@angular/core';

import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { environment } from '../../environments/environment';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

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
export class BrowseByProjectsPageComponent implements OnInit {
  initialized$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
  queryBuilderConfigurationName: string;

  /**
   * Configuration name
   *
   * @memberof BrowseByProjectsPageComponent
   */
  projectsConfigurationName: string;

  /**
   * Configuration name
   *
   * @memberof BrowseByProjectsPageComponent
   */
  projectItemsConfigurationName: string;

  /**
   * Configuration name
   *
   * @memberof BrowseByProjectsPageComponent
   */
  projectItemsWithQueryConfigurationName: string;

  /**
   * Composed query
   *
   * @type {string}
   * @memberof BrowseByProjectsPageComponent
   */
  searchQuery: string;

  constructor(private authorizationService: AuthorizationDataService) {
  }

  ngOnInit(): void {
    const isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
    const isFunderOrganizationalManager$ = this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManager);
    const isFunderProjectManager$ = this.authorizationService.isAuthorized(FeatureID.isFunderProjectManager);
    combineLatest([
      isAdmin$,
      isFunderOrganizationalManager$,
      isFunderProjectManager$
    ]).pipe(
      take(1)
    ).subscribe(([isAdmin, isFunderOrganizationalManager, isFunderProjectManager]) => {
      if (isAdmin || isFunderOrganizationalManager || isFunderProjectManager) {
        this.queryBuilderConfigurationName = environment.projects.projectsBrowse.adminAndFunders.searchQueryConfigurationName;
        this.projectsConfigurationName = environment.projects.projectsBrowse.adminAndFunders.searchProjectConfigurationName;
        this.projectItemsConfigurationName = environment.projects.projectsBrowse.adminAndFunders.searchProjectItemsConfigurationName;
        this.projectItemsWithQueryConfigurationName = environment.projects.projectsBrowse.adminAndFunders.searchProjectItemsWithQueryConfigurationName;
      } else {
        this.queryBuilderConfigurationName = environment.projects.projectsBrowse.members.searchQueryConfigurationName;
        this.projectsConfigurationName = environment.projects.projectsBrowse.members.searchProjectConfigurationName;
        this.projectItemsConfigurationName = environment.projects.projectsBrowse.members.searchProjectItemsConfigurationName;
        this.projectItemsWithQueryConfigurationName = environment.projects.projectsBrowse.members.searchProjectItemsWithQueryConfigurationName;
      }

      this.initialized$.next(true);
    });
  }

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
