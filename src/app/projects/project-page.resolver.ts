import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { hasValue } from '../shared/empty.util';

/**
 * This class represents a resolver that requests a specific project before the route is activated
 */
@Injectable()
export class ProjectPageResolver implements Resolve<RemoteData<Community>> {
  constructor(private communityService: CommunityDataService) {
  }

  /**
   * Method for resolving a community based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Community>> Emits the found community based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Community>> {
    return this.communityService.findById(
      route.params.projectId
    ).pipe(
      find((RD) => hasValue(RD.error) || RD.hasSucceeded)
    );
  }
}
