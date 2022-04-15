import { MetadataValue } from '../../core/shared/metadata.models';
import { isNotEmpty } from '../empty.util';

export const _isMetadataEqualComparator: (baseMetadata: MetadataValue, versionMetadata: MetadataValue) => boolean = (baseMetadata, versionMetadata) => {
  return (isNotEmpty(baseMetadata?.authority) && baseMetadata?.authority === versionMetadata?.authority) || baseMetadata?.value === versionMetadata?.value;
};
