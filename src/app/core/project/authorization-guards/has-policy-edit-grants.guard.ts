import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { AuthorizationDataService } from '../../data/feature-authorization/authorization-data.service';
import { getFirstCompletedRemoteData } from '../../shared/operators';
import { RemoteData } from '../../data/remote-data';
import { ItemDataService } from '../../data/item-data.service';
import { Item } from '../../shared/item.model';
import { FeatureID } from '../../data/feature-authorization/feature-id';
import { isNotEmpty } from '../../../shared/empty.util';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have edit grants on
 * the given item
 */
@Injectable()
export class HasPolicyEditGrantsGuard implements CanActivate {

  constructor(
    protected authorizationService: AuthorizationDataService,
    protected itemService: ItemDataService,
    protected router: Router
  ) {
  }

  /**
   * True when user has edit grants
   * Reroutes to a 404 page when the page cannot be activated
   * @method canActivate
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const itemRD$ = this.retrieveItem(route);

    return itemRD$.pipe(
      switchMap((itemRD: RemoteData<Item>) => {
        if (isNotEmpty(itemRD) && itemRD.hasSucceeded) {
          return combineLatest([
              this.authorizationService.isAuthorized(FeatureID.HasEditGrantsOnItem, itemRD.payload.self),
              this.authorizationService.isAuthorized(FeatureID.AdministratorOf)
            ]
          ).pipe(
            map(([hasGrants, isAdmin]) => hasGrants || isAdmin)
          );
        } else {
          return observableOf(false);
        }
      }),
      tap((isValid: boolean) => {
        if (!isValid) {
          this.router.navigate(['/403']);
        }
      })
    );
  }

  protected retrieveItem(route: ActivatedRouteSnapshot): Observable<RemoteData<Item>> {
    return this.itemService.findById(route.params.id).pipe(
      getFirstCompletedRemoteData(),
    );
  }
}
