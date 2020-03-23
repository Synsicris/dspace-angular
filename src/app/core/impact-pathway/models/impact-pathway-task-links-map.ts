import { ImpactPathwayLink } from '../impact-pathway.reducer';
import { MetadataValueInterface } from '../../shared/metadata.models';

export interface ImpactPathwayLinksMapEntry {
  toSave: ImpactPathwayLink[];
  toDelete: ImpactPathwayLink[];
}

export interface ImpactPathwayLinksMap {
  [taskId: string]: ImpactPathwayLinksMapEntry;
}
