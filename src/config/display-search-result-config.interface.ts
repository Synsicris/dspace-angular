import { Config } from './config.interface';

export enum DisplayItemMetadataType {
  Title = 'title',
  Text = 'text',
  Link = 'link',
  Date = 'date'
}

export interface Metadata {
  name: string;
  type: DisplayItemMetadataType;
  truncable?: boolean;
}

export interface ResultViewConfig {
  metadata: Metadata[];
}

export interface DisplayItemSearchResultConfig extends Config {
  [entity: string]: ResultViewConfig[];
}
