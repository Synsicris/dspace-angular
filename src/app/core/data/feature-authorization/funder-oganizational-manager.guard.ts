import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { FeatureID } from './feature-id';
import { AuthorizationDataService } from './authorization-data.service';
import { AuthService } from '../../auth/auth.service';
import { SingleFeatureAuthorizationGuard } from './feature-authorization-guard/single-feature-authorization.guard';

@Injectable({
  providedIn: 'root'
})
export class FunderOrganizationalGuard extends SingleFeatureAuthorizationGuard {

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
