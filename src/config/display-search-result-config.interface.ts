import { Config } from './config.interface';

export enum DisplayItemMetadataType {
  Title = 'title',
  Text = 'text',
  Link = 'link',
  Date = 'date',
  ValuePair = 'valuepair'
}

export interface Metadata {
  name: string;
  type: DisplayItemMetadataType;
  truncatable?: boolean;
  vocabularyName?: string;
}

export interface ResultViewConfig {
  metadata: Metadata[];
}

export interface DisplayItemSearchResultConfig extends Config {
  [entity: string]: ResultViewConfig[];
}
