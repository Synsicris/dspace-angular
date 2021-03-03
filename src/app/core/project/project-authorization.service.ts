import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { ProjectDataService } from './project-data.service';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, take } from 'rxjs/operators';
import { Community } from '../shared/community.model';
import { FeatureID } from '../data/feature-authorization/feature-id';

@Injectable()
export class ProjectAuthorizationService {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected configurationService: ConfigurationDataService,
    protected projectDataService: ProjectDataService) {
  }

  /**
   * Check if user has permission to create a new project
   */
  canCreateProject(): Observable<boolean> {
    return this.projectDataService.getCommunityProjects().pipe(
      map((community: Community) => community._links.self.href),
      mergeMap((href: string) => combineLatest([this.authorizationService.isAuthorized(
        FeatureID.CanCreateCommunities,
        href),
        this.authorizationService.isAuthorized(FeatureID.AdministratorOf)
        ]
      )),
      take(1),
      map(([isCommunityAdmin, isAdmin]) => isCommunityAdmin || isAdmin),
      distinctUntilChanged()
    );
  }

  /**
   * Check if user has permission to create a new sub-project
   */
  canCreateSubproject(parentProjectUUID): Observable<boolean> {
    return this.projectDataService.getSubprojectCommunityByParentProjectUUID(parentProjectUUID).pipe(
      map((community: Community) => community._links.self.href),
      mergeMap((href: string) => combineLatest([this.authorizationService.isAuthorized(
        FeatureID.CanCreateCommunities,
        href),
          this.authorizationService.isAuthorized(FeatureID.AdministratorOf)
        ]
      )),
      take(1),
      map(([isCommunityAdmin, isAdmin]) => isCommunityAdmin || isAdmin),
      distinctUntilChanged()
    );
  }
}
