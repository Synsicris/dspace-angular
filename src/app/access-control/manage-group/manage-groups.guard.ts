import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../../core/auth/auth.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { map } from 'rxjs/operators';
import { SingleFeatureAuthorizationGuard } from '../../core/data/feature-authorization/feature-authorization-guard/single-feature-authorization.guard';

@Injectable({
  providedIn: 'root'
})
export class ManageGroupsGuard extends SingleFeatureAuthorizationGuard {

  constructor(
    protected authorizationService: AuthorizationDataService,
    protected router: Router,
    protected authService: AuthService) {
    super(authorizationService, router, authService);
  }

  getFeatureID(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(FeatureID.isFunderOrganizationalManager);
  }

}
