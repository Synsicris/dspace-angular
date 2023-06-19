import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { ConfigurationDataService } from '../data/configuration-data.service';
import {
  CALL_ENTITY,
  FUNDING_ENTITY,
  FUNDING_OBJECTIVE_ENTITY,
  ORGANISATION_UNIT_ENTITY,
  PROGRAMME_ENTITY,
  ProjectDataService
} from './project-data.service';
import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, take } from 'rxjs/operators';
import { Community } from '../shared/community.model';
import { FeatureID } from '../data/feature-authorization/feature-id';
import { Item } from '../shared/item.model';
import { FindListOptions } from '../data/find-list-options.model';
import { getRemoteDataPayload } from '../shared/operators';
import { PaginatedList } from '../data/paginated-list.model';
import { Collection } from '../shared/collection.model';
import { CollectionDataService } from '../data/collection-data.service';

@Injectable()
export class ProjectAuthorizationService {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected configurationService: ConfigurationDataService,
    protected projectDataService: ProjectDataService,
    private collectionDataService: CollectionDataService) {
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

  isProjectReader(projectItem: Item) {
    return this.authorizationService.isAuthorized(FeatureID.isReaderOfProject, projectItem.self);
  }

  /**
   * Check if there is at least one collection available for the given entityType and scope
   */
  hasAtLeastOneCollection(scope: string, targetEntityType: string): Observable<boolean> {
    if (targetEntityType === FUNDING_ENTITY) {
      return of(true);
    }
    const findListOptions = Object.assign({}, new FindListOptions(), {
      elementsPerPage: 1,
      currentPage: 1,
    });

    if (this.isSharedEntity(targetEntityType)) {
      return this.canCreateSharedEntity(findListOptions, targetEntityType);
    } else {
      return this.canCreateProjectEntity(findListOptions, scope, targetEntityType);
    }
  }

  protected isSharedEntity(entityType: string){
    return entityType === FUNDING_OBJECTIVE_ENTITY ||
           entityType === CALL_ENTITY ||
           entityType === ORGANISATION_UNIT_ENTITY ||
           entityType === PROGRAMME_ENTITY;
  }

  /**
   * Checks if the user has permission to create a shared entity by having at least one collection
   */
  private canCreateSharedEntity(findListOptions: FindListOptions, targetEntityType: string): Observable<boolean> {
    return this.collectionDataService.getAuthorizedCollectionByEntityType('', targetEntityType, findListOptions).pipe(
      getRemoteDataPayload(),
      map((collections: PaginatedList<Collection>) => collections?.totalElements === 1)
    );
  }

  /**
   * Checks if the user has permission to create a project entity by having at least one collection based on the scope
   */
  private canCreateProjectEntity(findListOptions: FindListOptions, scope: string, targetEntityType: string) {
    return this.collectionDataService.getAuthorizedCollectionByCommunityAndEntityType(scope, targetEntityType, findListOptions).pipe(
      getRemoteDataPayload(),
      map((collections: PaginatedList<Collection>) => collections?.totalElements === 1)
    );
  }

}
