import { Item } from '../shared/item.model';
import { environment } from '../../../environments/environment';
import { isNotEmpty } from '../../shared/empty.util';

export const _unionComparator: (targetItem: Item, versionItem: Item) => boolean = (targetItem, versionItem) => {
  return hasVersion(targetItem, versionItem) || hasVersion(versionItem, targetItem);
};

export const _hasVersionComparator: (targetItem: Item, versionItem: Item) => boolean = (targetItem, versionItem) => {
  return hasVersion(targetItem, versionItem);
};

export const _isVersionOfComparator: (versionItem: Item, targetItem: Item) => boolean = (targetItem, versionItem) => {
  return hasVersion(versionItem, targetItem);
};

export function hasVersion(targetItem: Item, versionItem: Item): boolean {
  const targetId = targetItem.id;
  const versionUniqueId = versionItem.firstMetadataValue(environment.projects.projectVersionUniqueIdMetadata);
  return isNotEmpty(versionUniqueId) && versionUniqueId.startsWith(targetId);
}
