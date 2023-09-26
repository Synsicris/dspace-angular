import { Config } from './config.interface';
import { FilterType } from '../app/shared/search/models/filter-type.model';


export interface UrnConfig extends Config {
  name: string;
  baseUrl: string;
}

export interface CrisRefEntityStyleConfig extends Config {
  icon: string;
  style: string;
}

export interface CrisRefConfig extends Config {
  entityType: string;
  entityStyle: {
    default: CrisRefEntityStyleConfig;
    [entity: string]: CrisRefEntityStyleConfig;
  };
}

export interface CrisLayoutMetadataBoxConfig extends Config {
  defaultMetadataLabelColStyle: string;
  defaultMetadataValueColStyle: string;
}

export interface CrisLayoutTypeConfig {
  orientation: string;
}

export interface NavbarConfig extends Config {
  showCommunityCollection: boolean;
}

export interface CrisItemPageConfig extends Config {
  [entity: string]: CrisLayoutTypeConfig;
  default: CrisLayoutTypeConfig;
}


export interface CrisLayoutConfig extends Config {
  urn: UrnConfig[];
  crisRef: CrisRefConfig[];
  crisRefStyleMetadata: string;
  itemPage: CrisItemPageConfig;
  metadataBox: CrisLayoutMetadataBoxConfig;
}

export interface LayoutConfig extends Config {
  navbar: NavbarConfig;
  search: SearchLayoutConfig;
}

export interface SuggestionConfig extends Config {
  source: string;
  collectionId: string;
}

export interface SearchLayoutConfig {
  filters: SearchFiltersConfig;
}

export interface DefaultSearchOperator<T> {
  operator?: '+' | '-';
  value: T;
}

export type DefaultRangeSearchFilterValue = DefaultSearchOperator<Duration>;

export interface DefaultRangeSearchFilterConfig extends DefaultSearchFilterConfig {
  filterType: 'range';
  minValue?: DefaultRangeSearchFilterValue;
  maxValue?: DefaultRangeSearchFilterValue;
}

export interface DefaultSearchFilterConfig {
  filterType: keyof typeof FilterType;
}

export interface DefaultSearchFiltersConfig<T extends DefaultSearchFilterConfig> {
  [searchFilterName: string]: T;
}

export type DefaultSearchFiltersConfigs = DefaultSearchFilterConfig | DefaultRangeSearchFilterConfig;

export interface DiscoveryConfiguration {
  [discoveryConfigKey: string]: DefaultSearchFiltersConfig<DefaultSearchFiltersConfigs>;
}

export interface SearchFiltersConfig {
  datepicker: string[];
  discoveryConfig?: DiscoveryConfiguration;
}
