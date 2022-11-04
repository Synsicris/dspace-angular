import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../core/auth/auth.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { getFirstCompletedRemoteData, redirectOn4xx } from '../core/shared/operators';
import { RemoteData } from '../core/data/remote-data';
import { getPageNotFoundRoute } from '../app-routing-paths';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';

/**
 * Prevent unauthorized activating and loading of routes
 * @class ProgrammeMembersPageGuard
 */
@Injectable()
export class ProgrammeMembersPageGuard implements CanActivate {
  constructor(protected authorizationService: AuthorizationDataService,
              protected router: Router,
              protected authService: AuthService,
              protected itemService: ItemDataService) {

  }

  /**
   * Check edit metadata authorization rights
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.itemService.findById(
      route.params.id
    ).pipe(
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
      switchMap((itemRD: RemoteData<Item>) => {
        if (itemRD.hasSucceeded) {
          return this.authorizationService.isAuthorized(FeatureID.CanManageProgrammeMembers, itemRD.payload.self, undefined);
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
