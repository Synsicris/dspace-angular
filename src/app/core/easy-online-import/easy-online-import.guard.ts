import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { DsoPageSingleFeatureGuard } from '../data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { Item } from '../shared/item.model';
import { ItemPageResolver } from '../../item-page/item-page.resolver';
import { AuthService } from '../auth/auth.service';
import { FeatureID } from '../data/feature-authorization/feature-id';

/**
 * Prevent unauthorized activating and loading of routes
 * @class EasyOnlineImportGuard
 */
@Injectable()
export class EasyOnlineImportGuard extends DsoPageSingleFeatureGuard<Item> {
  constructor(protected resolver: ItemPageResolver,
              protected authorizationService: AuthorizationDataService,
              protected router: Router,
              protected authService: AuthService) {
    super(resolver, authorizationService, router, authService);
  }

  /**
   * Check edit metadata authorization rights
   */
  getFeatureID(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(FeatureID.CanMakeEasyOnlineImport);
  }
}
