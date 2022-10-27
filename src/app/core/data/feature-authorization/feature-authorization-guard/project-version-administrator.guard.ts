import { getRemoteDataPayload } from './../../../shared/operators';
import { Item } from './../../../shared/item.model';
import { ItemDataService } from './../../item-data.service';
import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '../authorization-data.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { Observable, of as observableOf } from 'rxjs';
import { FeatureID } from '../feature-id';
import { SomeFeatureAuthorizationGuard } from './some-feature-authorization.guard';
import { map } from 'rxjs/operators';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have group
 * management rights
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectVersionAdministratorGuard extends SomeFeatureAuthorizationGuard {
  constructor(protected authorizationService: AuthorizationDataService,
    protected router: Router,
    protected authService: AuthService,
    protected aroute: ActivatedRoute,
    protected itemService: ItemDataService,) {
    super(authorizationService, router, authService);
  }

  /**
   * Check group management rights
   */
  getFeatureIDs(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID[]> {
    return observableOf([FeatureID.isCoordinatorOfProject, FeatureID.isFundersOfProject]);
  }

  getObjectUrl(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return this.itemService.findById(route.params.id).pipe(
      getRemoteDataPayload(),
      map((project: Item) => {
        return project._links.self.href;
      })
    );
  }
}
