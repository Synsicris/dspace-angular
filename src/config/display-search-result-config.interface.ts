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
}

export interface ResultViewConfig {
  truncable: boolean;
  metadata: Metadata[];
}

export interface DisplayItemSearchResultConfig extends Config {
  [entity: string]: ResultViewConfig[];
}
