import { Config } from './config.interface';

export interface Metadata {
  name: string;
  type: string;
}

export interface ResultViewConfig {
  truncable: boolean;
  metadata: Metadata[];
}

export interface DisplayItemSearchResultConfig extends Config {
  [entity: string]: ResultViewConfig[];
}
