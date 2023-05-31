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
    const isFunderOrganizationalManager$ = this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManagerOfAnyProject);
    const isFunderProjectManager$ = this.authorizationService.isAuthorized(FeatureID.isFunderProjectManagerOfAnyProject);
    const isFunderReaderOfAnyProject$ = this.authorizationService.isAuthorized(FeatureID.isFunderReaderOfAnyProject);
    combineLatest([
      isAdmin$,
      isFunderOrganizationalManager$,
      isFunderProjectManager$,
      isFunderReaderOfAnyProject$
    ]).pipe(
      take(1)
    ).subscribe(([isAdmin, isFunderOrganizationalManager, isFunderProjectManager, isFunderReaderOfAnyProject]) => {
      if (isAdmin || isFunderOrganizationalManager || isFunderProjectManager || isFunderReaderOfAnyProject) {
        this.queryBuilderConfigurationName = environment.projects.projectsBrowse.adminAndFunders.firstStepSearchQueryConfigurationName;
        this.projectsConfigurationName = environment.projects.projectsBrowse.adminAndFunders.firstStepSearchBrowseAllProjectConfigurationName;
        this.projectItemsConfigurationName = environment.projects.projectsBrowse.adminAndFunders.secondSearchProjectItemsConfigurationName;
      } else {
        this.queryBuilderConfigurationName = environment.projects.projectsBrowse.members.firstStepSearchQueryConfigurationName;
        this.projectsConfigurationName = environment.projects.projectsBrowse.members.firstStepSearchBrowseAllProjectConfigurationName;
        this.projectItemsConfigurationName = environment.projects.projectsBrowse.members.secondSearchProjectItemsConfigurationName;
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
        this.searchQuery = '';
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
