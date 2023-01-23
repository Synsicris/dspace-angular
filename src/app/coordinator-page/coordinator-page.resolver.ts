import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { EMPTY, Observable } from 'rxjs';
import { mergeMap, switchMap, tap } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { Item } from '../core/shared/item.model';
import { ResearcherProfileDataService } from '../core/profile/researcher-profile-data.service';
import { AuthService } from '../core/auth/auth.service';
import { isNotEmpty } from '../shared/empty.util';
import { EPerson } from '../core/eperson/models/eperson.model';
import { getItemPageRoute } from '../item-page/item-page-routing-paths';
import { ItemDataService } from '../core/data/item-data.service';
import { ResearcherProfile } from '../core/profile/model/researcher-profile.model';
import { getHomePageRoute } from '../app-routing-paths';

/**
 * This class represents a resolver that requests a specific collection before the route is activated
 */
@Injectable()
export class CoordinatorPageResolver implements Resolve<RemoteData<Item>> {
  constructor(
    private authService: AuthService,
    private itemService: ItemDataService,
    private researcherProfileService: ResearcherProfileDataService,
    private router: Router,
  ) {
  }

  /**
   * Method for resolving a collection based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<string> Emits the found researcher profile,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    return this.authService.isAuthenticated().pipe(
      switchMap((isAuth: boolean) => {
        if (isAuth) {
          return this.authService.getAuthenticatedUserFromStore().pipe(
            switchMap((eperson: EPerson) => {
              return this.researcherProfileService.findById(eperson.id).pipe(
                getFirstCompletedRemoteData(),
                switchMap((researcherProfileRD: RemoteData<ResearcherProfile>) => {
                  if (researcherProfileRD.hasSucceeded && isNotEmpty(researcherProfileRD.payload)) {
                    return this.researcherProfileService.findRelatedItemId(researcherProfileRD.payload).pipe(
                      mergeMap((researcherProfileID) => this.itemService.findById(researcherProfileID)),
                      getFirstCompletedRemoteData(),
                      tap((researcherProfileItemRD: RemoteData<Item>) => {
                        if (researcherProfileItemRD.hasSucceeded) {
                          this.router.navigate([getItemPageRoute(researcherProfileItemRD.payload)]);
                        } else {
                          this.router.navigate([getHomePageRoute()]);
                        }
                      })
                    )
                  } else {
                    this.router.navigate([getHomePageRoute()]);
                  }
                })
              );
            })
          );
        } else {
          return EMPTY;
        }
      })
    );
  }
}
