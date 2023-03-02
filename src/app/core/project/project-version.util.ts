import { Item } from '../shared/item.model';
import { environment } from '../../../environments/environment';

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
  let compareResult = false;
  let versionItemUniqueId = versionItem.firstMetadataValue(environment.projects.projectVersionUniqueIdMetadata);
  let targetItemUniqueId = targetItem.firstMetadataValue(environment.projects.projectVersionUniqueIdMetadata);
  // both versioned
  if (versionItemUniqueId != null && targetItemUniqueId != null) {
    compareResult = targetItemUniqueId.startsWith(versionItemUniqueId.split('_')[0]) ||
      versionItemUniqueId.startsWith(targetItemUniqueId.split('_')[0]);
  } else if (versionItemUniqueId != null) {
    const targetId = targetItem.id;
    compareResult = versionItemUniqueId?.startsWith(targetId);
  } else {
    const targetId = versionItem.id;
    compareResult = targetItemUniqueId?.startsWith(targetId);
  }
  return compareResult;
}
