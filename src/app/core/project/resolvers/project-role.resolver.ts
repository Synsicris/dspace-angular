import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FeatureID } from '../../data/feature-authorization/feature-id';
import { ProjectDataService } from '../project-data.service';
import { getFirstCompletedRemoteData } from '../../shared/operators';
import { RemoteData } from '../../data/remote-data';
import { Item } from '../../shared/item.model';
import { AuthorizationDataService } from '../../data/feature-authorization/authorization-data.service';

/**
 * Abstract Resolver for evaluating specific authorization feature on the context project.
 */
export abstract class ProjectRoleResolver implements Resolve<Observable<boolean>> {

  routeParam = 'id';

  constructor(protected authorizationService: AuthorizationDataService, protected projectService: ProjectDataService) {
  }

  /**
   * The type of feature to check authorization for
   * Override this method to define a feature
   */
  abstract getFeatureID(): FeatureID;


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.projectService.getProjectItemByItemId(route.params[this.routeParam]).pipe(
      getFirstCompletedRemoteData(),
      switchMap((projectItemRD: RemoteData<Item>) => {
        if (projectItemRD.hasSucceeded && projectItemRD.hasContent) {
          return this.authorizationService.isAuthorized(this.getFeatureID(), projectItemRD.payload.self);
        } else {
          return of(false);
        }
      })
    );
  }
}
