import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Observable, of } from 'rxjs';
import { Item } from '../../../core/shared/item.model';
import { ProjectAuthorizationService } from '../../../core/project/project-authorization.service';

const defaultContentKeyMapper = (contentKey: string) => contentKey;

export const defaultRole = {
  contentSuffix: null,
  mapContentKey: defaultContentKeyMapper,
  isAuthorized() {
    return of(true);
  }
}

export interface AlertRole {
  feature: FeatureID;

  mapContentKey(contentKey: string): string | null;

  item?: Item;

  isAuthorized(): Observable<boolean>;
}

const suffixContentKeyMapper = (suffix: string) => (contentKey: string) => `${contentKey}.${suffix}`;

export function administratorRole(authorizationService: ProjectAuthorizationService): AlertRole {
  return {
    feature: FeatureID.AdministratorOf,
    mapContentKey: defaultContentKeyMapper,
    isAuthorized: () => authorizationService.isAdmin()
  };
}

export function getDefaultRoles(authorizationService: ProjectAuthorizationService): AlertRole[] {
  return [
    {
      feature: FeatureID.AdministratorOf,
      mapContentKey: defaultContentKeyMapper,
      isAuthorized: () => authorizationService.isAdmin()
    },
    {
      feature: FeatureID.isFunderOrganizationalManagerOfAnyProject,
      mapContentKey: defaultContentKeyMapper,
      isAuthorized: () => authorizationService.isFunderOrganizationalManager()
    }
  ]
}

export function getProjectRoles(projectItem: Item, authorizationService: ProjectAuthorizationService): AlertRole[] {
  return [
    {
      feature: FeatureID.isFunderOfProject,
      mapContentKey: defaultContentKeyMapper,
      item: projectItem,
      isAuthorized: () => authorizationService.isFunderProjectManager(projectItem)
    },
    {
      feature: FeatureID.isCoordinatorOfProject,
      mapContentKey: defaultContentKeyMapper,
      item: projectItem,
      isAuthorized: () => authorizationService.isCoordinator(projectItem)
    }
  ]
}

export function getProgrammeRoles(projectItem: Item, authorizationService: ProjectAuthorizationService): AlertRole[] {
  return [
    {
      feature: FeatureID.isFunderOrganizationalManagerOfProgramme,
      mapContentKey: suffixContentKeyMapper('funder-manager'),
      item: projectItem,
      isAuthorized: () => authorizationService.isFunderOrganizationalManagerOfProgramme(projectItem)
    },
    {
      feature: FeatureID.isFunderProjectOfProgramme,
      mapContentKey: suffixContentKeyMapper('funder-project'),
      item: projectItem,
      isAuthorized: () => authorizationService.isFunderProjectOfProgramme(projectItem)
    },
    {
      feature: FeatureID.isFunderReaderOfProgramme,
      mapContentKey: suffixContentKeyMapper('funder-reader'),
      item: projectItem,
      isAuthorized: () => authorizationService.isFunderReaderOfProgramme(projectItem)
    }
  ]
}
