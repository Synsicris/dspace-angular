import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { ProjectDataService } from './project-data.service';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, take } from 'rxjs/operators';
import { Community } from '../shared/community.model';
import { FeatureID } from '../data/feature-authorization/feature-id';
import { Item } from '../shared/item.model';

@Injectable()
export class ProjectAuthorizationService {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected configurationService: ConfigurationDataService,
    protected projectDataService: ProjectDataService) {
  }

  /**
   * Check if user has permission to create a new project
   */
  canCreateProject(): Observable<boolean> {
    return this.projectDataService.getCommunityProjects().pipe(
      map((community: Community) => community._links.self.href),
      mergeMap((href: string) => combineLatest([this.authorizationService.isAuthorized(
        FeatureID.CanCreateCommunities,
        href),
        this.authorizationService.isAuthorized(FeatureID.AdministratorOf)
        ]
      )),
      take(1),
      map(([isCommunityAdmin, isAdmin]) => isCommunityAdmin || isAdmin),
      distinctUntilChanged()
    );
  }

  /**
   * Check if user has permission to create a new sub-project
   */
  canCreateSubproject(parentProjectUUID): Observable<boolean> {
    return this.projectDataService.getFundingRootCommunityByProjectUUID(parentProjectUUID).pipe(
      map((community: Community) => community._links.self.href),
      mergeMap((href: string) => combineLatest([this.authorizationService.isAuthorized(
        FeatureID.CanCreateCommunities,
        href),
          this.authorizationService.isAuthorized(FeatureID.AdministratorOf)
        ]
      )),
      take(1),
      map(([isCommunityAdmin, isAdmin]) => isCommunityAdmin || isAdmin),
      distinctUntilChanged()
    );
  }

  /**
   * Check if user is an administrator
   */
  isAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }

  /**
   * Check if user is a funder organizational manager
   */
  isFunderOrganizationalManager(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManagerOfAnyProject);
  }

  /**
   * Check if user is a Coordinator of project
   */
  isCoordinator(item: Item): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfProject, item.self);
  }

  /**
   * Check if user is a Funder project manager for any project
   */
  isFunderManager(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.isFunderProjectManagerOfAnyProject);
  }

  /**
   * Check if user is a Funder for a given project
   */
  isFunderProjectManager(item: Item): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, item.self);
  }

  isFunderOrganizationalManagerOfProgramme(projectItem: Item) {
    return this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManagerOfProgramme, projectItem.self);
  }

  isFunderProjectOfProgramme(projectItem: Item) {
    return this.authorizationService.isAuthorized(FeatureID.isFunderProjectOfProgramme, projectItem.self);
  }

  isFunderReaderOfProgramme(projectItem: Item) {
    return this.authorizationService.isAuthorized(FeatureID.isFunderReaderOfProgramme, projectItem.self);
  }

}
