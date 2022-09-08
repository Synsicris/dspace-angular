import { FeatureID } from './feature-id';

/**
 * Search parameters for retrieving authorizations for multiple objects from the REST API.
 */
export class AuthorizationObjectsSearchParams {
  objectsUrl: string[];
  featureIds: FeatureID[];
  ePersonUuid: string;

  constructor(objectsUrl: string[], featureIds: FeatureID[], ePersonUuid?: string) {
    this.objectsUrl = objectsUrl;
    this.ePersonUuid = ePersonUuid;
    this.featureIds = featureIds;
  }
}
