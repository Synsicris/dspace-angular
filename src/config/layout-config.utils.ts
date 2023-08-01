import {
  DefaultRangeSearchFilterConfig,
  DefaultRangeSearchFilterValue,
  DefaultSearchFiltersConfig,
  DefaultSearchFiltersConfigs
} from './layout-config.interfaces';

import { environment } from '../environments/environment';
import { RelationBoxConfiguration } from '../app/core/layout/models/box.model';
import { add, format, sub } from 'date-fns';

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

export function groupRangeFilters(filters: DefaultSearchFiltersConfig<DefaultSearchFiltersConfigs> = {}): RangeFilterGroup {
  return Object.keys(filters)
    .filter(key => filters[key]?.filterType === 'range')
    .map(key => ({ key, filter: filters[key] as DefaultRangeSearchFilterConfig }))
    .map(({ key, filter }) => createRangeFilterGroup(key, filter))
    .reduce((previousValue, currentValue) => Object.assign({}, previousValue, currentValue), {});
}

export function isConfigParam(confParam: RangeFilterGroup, fkey: string) {
  const l = fkey.lastIndexOf('.');
  return l >= 0 && confParam[fkey.substring(0, l)] != null;
}

function createRangeFilterGroup(key: string, filter: DefaultRangeSearchFilterConfig): RangeFilterGroup {
  const minDate = parseRangeValue(filter?.minValue);
  const maxDate = parseRangeValue(filter?.minValue);
  const min = minDate ? format(minDate, DATE_FORMAT) : null;
  const max = maxDate ? format(maxDate, DATE_FORMAT) : null;

  return {
    [`f.${key}`]: {
      ...(min == null ? null : { min }),
      ...(max == null ? null : { max })
    }
  };
}

export function parseRangeValue(rangeValue: DefaultRangeSearchFilterValue): Date {
  let value = null;
  if (rangeValue?.value != null && rangeValue?.operator != null) {
    let now = new Date();
    if (rangeValue.operator === '-') {
      value = sub(now, rangeValue.value);
    } else if (rangeValue.operator === '+') {
      value = add(now, rangeValue.value);
    } else {
      value = now;
    }
  }
  return value;
}
