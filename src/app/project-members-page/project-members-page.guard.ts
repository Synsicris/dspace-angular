import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { combineLatest, forkJoin, Observable, of as observableOf, OperatorFunction } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../core/auth/auth.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { ProjectDataService } from '../core/project/project-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { getPageNotFoundRoute } from '../app-routing-paths';
import { Item } from '../core/shared/item.model';

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
    return forkJoin([
      this.projectService.getProjectCommunityByProjectItemId(route.params.id)
        .pipe(getFirstCompletedRemoteData()),
      this.projectService.getFundingItemByItemId(route.params.id)
        .pipe(getFirstCompletedRemoteData())
    ])
      .pipe(
        switchMap(([projectCommunityRD, itemRemoteData]: [RemoteData<Community>, RemoteData<Item>]) => {
          if (!projectCommunityRD.hasSucceeded && !itemRemoteData.hasSucceeded) {
            return observableOf(false);
          }
          const authorizationsToCheck = [this.getAdministrativeAuthorizations()];
          if (projectCommunityRD.hasSucceeded) {
            authorizationsToCheck.push(this.getProjectAuthorizations(projectCommunityRD));
          }
          if (itemRemoteData.hasSucceeded) {
            authorizationsToCheck.push(this.getFundingAuthorizations(itemRemoteData));
          }
          return combineLatest(authorizationsToCheck).pipe(this.isAnyTrue());
        }),
        tap((canActivate: boolean) => {
          if (!canActivate) {
            this.router.navigateByUrl(getPageNotFoundRoute(), { skipLocationChange: true });
          }
        })
      );
  }

  private getAdministrativeAuthorizations() {
    return forkJoin([
      this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManagerOfAnyProject),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf)
    ]).pipe(
      this.isAnyTrue()
    );
  }

  private getFundingAuthorizations(itemRemoteData: RemoteData<Item>) {
    return forkJoin([
      this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfFunding, itemRemoteData.payload.self, undefined),
    ]).pipe(
      this.isAnyTrue()
    );
  }

  private getProjectAuthorizations(projectCommunityRD: RemoteData<Community>) {
    return forkJoin([
      this.authorizationService.isAuthorized(FeatureID.isFunderOfProject, projectCommunityRD.payload.self, undefined),
      this.authorizationService.isAuthorized(FeatureID.isCoordinatorOfProject, projectCommunityRD.payload.self, undefined),
    ]).pipe(
      this.isAnyTrue()
    );
  }

  private isAnyTrue(): OperatorFunction<boolean[], boolean> {
    return map((authorizations: boolean[]) => authorizations.some(Boolean));
  }
}
