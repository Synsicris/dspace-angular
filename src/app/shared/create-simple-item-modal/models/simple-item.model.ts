import { MetadataMap } from '../../../core/shared/metadata.models';
import { FormFieldMetadataValueObject } from '../../form/builder/models/form-field-metadata-value.model';

export interface SimpleItem {
  id?: string
  type: FormFieldMetadataValueObject;
  metadata: MetadataMap

}
