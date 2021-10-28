import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { ItemPageResolver } from '../item-page/item-page.resolver';
import { AuthService } from '../core/auth/auth.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getFirstCompletedRemoteData, redirectOn4xx } from '../core/shared/operators';
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
  constructor(protected resolver: ItemPageResolver,
              protected authorizationService: AuthorizationDataService,
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
          return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, projectCommunityRD.payload.self, undefined);
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
