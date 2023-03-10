import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../data/feature-authorization/feature-id';

/**
 * This class represents a resolver that check if user is a funder Organizational/Project manager
 */
@Injectable()
export class IsFunderResolver implements Resolve<Observable<boolean>> {

  routeParam = 'id';

  constructor(private authorizationService: AuthorizationDataService) {
  }

  /**
   * Method for resolving a version based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<boolean> Emits if item is version of an item
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const isFunderOrganizationalManager$ = this.authorizationService.isAuthorized(FeatureID.isFunderOrganizationalManagerOfAnyProject);
    const isFunderProjectManager$ = this.authorizationService.isAuthorized(FeatureID.isFunderProjectManagerOfAnyProject);
    return combineLatest([
      isFunderOrganizationalManager$,
      isFunderProjectManager$
    ]).pipe(
      take(1),
      map(([isFunderOrganizationalManager, isFunderProjectManager]) => isFunderOrganizationalManager || isFunderProjectManager)
    );
  }
}
