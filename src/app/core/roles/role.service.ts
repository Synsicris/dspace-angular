import { Injectable } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { RoleType } from './role-types';
import { CollectionDataService } from '../data/collection-data.service';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../data/feature-authorization/feature-id';

/**
 * A service that provides methods to identify user role.
 */
@Injectable()
export class RoleService {

  /**
   * Initialize instance variables
   *
   * @param {AuthorizationDataService} authorizationService
   * @param {CollectionDataService} collectionService
   */
  constructor(
    private authorizationService: AuthorizationDataService,
    private collectionService: CollectionDataService) {
  }

  /**
   * Check if current user is a submitter
   */
  isSubmitter(): Observable<boolean> {
    return this.collectionService.hasAuthorizedCollection().pipe(
      distinctUntilChanged()
    );
  }

  /**
   * Check if current user is a controller
   */
  isController(): Observable<boolean> {
    // TODO find a way to check if user is a controller
    return observableOf(true);
  }

  /**
   * Check if current user is an admin
   */
  isAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
  }

  /**
   * Check if current user by role type
   *
   * @param {RoleType} role
   *    the role type
   */
  checkRole(role: RoleType): Observable<boolean> {
    let check: Observable<boolean>;
    switch (role) {
      case RoleType.Submitter:
        check = this.isSubmitter();
        break;
      case RoleType.Controller:
        check = this.isController();
        break;
      case RoleType.Admin:
        check = this.isAdmin();
        break;
    }

    return check;
  }
}
