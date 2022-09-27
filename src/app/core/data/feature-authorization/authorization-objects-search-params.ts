import { FeatureID } from './feature-id';

/**
 * Search parameters for retrieving authorizations for multiple objects from the REST API.
 */
export class AuthorizationObjectsSearchParams {
  ids: string[];
  featureIds: FeatureID[];
  type: string;
  ePersonUuid: string;

  constructor(ids: string[], featureIds: FeatureID[], type: string, ePersonUuid?: string) {
    this.ids = ids;
    this.ePersonUuid = ePersonUuid;
    this.featureIds = featureIds;
    this.type = type;
  }
}
