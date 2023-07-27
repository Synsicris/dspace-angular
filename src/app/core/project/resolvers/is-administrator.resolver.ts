import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthorizationDataService } from '../../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../data/feature-authorization/feature-id';

/**
 * This class represents a resolver that check if user is a site admin
 */
@Injectable()
export class IsAdministratorResolver implements Resolve<Observable<boolean>> {

  constructor(private authorizationService: AuthorizationDataService) {
  }

  /**
   * Method for resolving a version based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<boolean> Emits if item is version of an item
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }
}
