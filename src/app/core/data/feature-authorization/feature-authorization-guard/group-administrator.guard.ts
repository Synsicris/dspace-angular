import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '../authorization-data.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Observable, of as observableOf } from 'rxjs';
import { FeatureID } from '../feature-id';
import { SomeFeatureAuthorizationGuard } from './some-feature-authorization.guard';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have group
 * management rights
 */
@Injectable({
  providedIn: 'root'
})
export class GroupAdministratorGuard extends SomeFeatureAuthorizationGuard {
  constructor(protected authorizationService: AuthorizationDataService, protected router: Router, protected authService: AuthService) {
    super(authorizationService, router, authService);
  }

  /**
   * Check group management rights
   */
  getFeatureIDs(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID[]> {
    return observableOf([FeatureID.CanManageGroups, FeatureID.isFunderOrganizationalManagerOfAnyProject]);
  }
}
