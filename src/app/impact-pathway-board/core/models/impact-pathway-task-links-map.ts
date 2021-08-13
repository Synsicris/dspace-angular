import { ImpactPathwayLink } from '../impact-pathway.reducer';

export interface ImpactPathwayLinksMapEntry {
  toSave: ImpactPathwayLink[];
  toDelete: ImpactPathwayLink[];
}

export interface ImpactPathwayLinksMap {
  [taskId: string]: ImpactPathwayLinksMapEntry;
}
