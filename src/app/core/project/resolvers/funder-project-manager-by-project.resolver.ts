import { ProjectRoleResolver } from './project-role.resolver';
import { FeatureID } from '../../data/feature-authorization/feature-id';
import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '../../data/feature-authorization/authorization-data.service';
import { ProjectDataService } from '../project-data.service';

/**
 * Resolver for evaluating isFunderOfProject authorization feature on the context project.
 */
@Injectable()
export class FunderProjectManagerByProjectResolver extends ProjectRoleResolver {

  constructor(protected authorizationService: AuthorizationDataService, protected projectService: ProjectDataService) {
    super(authorizationService, projectService);
  }

  getFeatureID() {
    return FeatureID.isFunderOfProject;
  }
}
