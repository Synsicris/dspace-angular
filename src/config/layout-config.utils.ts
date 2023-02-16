import {
  DefaultRangeSearchFilterConfig,
  DefaultRangeSearchFilterValue,
  DefaultSearchFiltersConfig,
  DefaultSearchFiltersConfigs
} from './layout-config.interfaces';
import * as moment from 'moment';
import { Moment } from 'moment';
import { environment } from '../environments/environment';
import { RelationBoxConfiguration } from '../app/core/layout/models/box.model';

export const DATE_FORMAT = 'YYYY-MM-DD';

export interface RangeFilterGroup {
  [fkey: string]: { min?: string, max?: string }
}

export function getDiscoveryConfiguration(configuration: RelationBoxConfiguration): DefaultSearchFiltersConfig<DefaultSearchFiltersConfigs> | null {
  if (configuration == null) {
    return null;
  }
  return environment.layout.search.filters.discoveryConfig[configuration['discovery-configuration']];
}

export function groupRangeFilters(filters: DefaultSearchFiltersConfig<DefaultSearchFiltersConfigs>): RangeFilterGroup {
  return Object.keys(filters)
    .filter(key => filters[key]?.filterType === 'range')
    .map(key => ({ key, filter: filters[key] as DefaultRangeSearchFilterConfig }))
    .map(({ key, filter }) => createRangeFilterGroup(key, filter))
    .reduce((previousValue, currentValue) => Object.assign({}, previousValue, currentValue));
}

export function isConfigParam(confParam: RangeFilterGroup, fkey: string) {
  const l = fkey.lastIndexOf('.');
  return l >= 0 && confParam[fkey.substring(0, l)] != null;
}

function createRangeFilterGroup(key: string, filter: DefaultRangeSearchFilterConfig): RangeFilterGroup {
  const min = parseRangeValue(filter?.minValue)?.format(DATE_FORMAT),
    max = parseRangeValue(filter?.maxValue)?.format(DATE_FORMAT);
  return {
    [`f.${key}`]: {
      ...(min == null ? null : { min }),
      ...(max == null ? null : { max })
    }
  };
}

export function parseRangeValue(rangeValue: DefaultRangeSearchFilterValue): Moment {
  let value = null;
  if (rangeValue?.value != null && rangeValue?.operator != null) {
    let now = moment();
    if (rangeValue.operator === '-') {
      value = now.subtract(rangeValue.value);
    } else if (rangeValue.operator === '+') {
      value = now.add(rangeValue.value);
    } else {
      value = moment(rangeValue.value);
    }
  }
  return value;
}
