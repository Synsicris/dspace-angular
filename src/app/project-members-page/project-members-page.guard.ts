import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../core/auth/auth.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { ProjectDataService } from '../core/project/project-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { getPageNotFoundRoute } from '../app-routing-paths';

/**
 * Prevent unauthorized activating and loading of routes
 * @class ProjectMembersPageGuard
 */
@Injectable()
export class ProjectMembersPageGuard implements CanActivate {
  constructor(protected authorizationService: AuthorizationDataService,
              protected router: Router,
              protected authService: AuthService,
              protected projectService: ProjectDataService) {

  }

  /**
   * Check edit metadata authorization rights
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.projectService.getProjectCommunityByProjectItemId(
      route.params.id
    ).pipe(
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
      switchMap((projectCommunityRD: RemoteData<Community>) => {
        if (projectCommunityRD.hasSucceeded) {
          return combineLatest([
            this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManager),
            this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, projectCommunityRD.payload.self, undefined),
            this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfProject, projectCommunityRD.payload.self, undefined),
            this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfFunding, projectCommunityRD.payload.self, undefined),
            this.authorizationService.isAuthorized(FeatureID.AdministratorOf)
          ]).pipe(
            map(([
                   isFunderOrganizationalManager,
                   isFunderOfProject,
                   isCoordinatorOfProject,
                   isCoordinatorOfFunding,
                   isAdministrator
                 ]) => isFunderOrganizationalManager || isFunderOfProject || isCoordinatorOfProject || isCoordinatorOfFunding || isAdministrator)
          );
        } else {
          return observableOf(false);
        }
      }),
      tap((canActivate: boolean) => {
        if (!canActivate) {
          this.router.navigateByUrl(getPageNotFoundRoute(), { skipLocationChange: true });
        }
      })
    );
  }
}
