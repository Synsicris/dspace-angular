/**
 * Clones an item from one array to another, leaving it in its
 * original position in current array.
 * @param cloneItem The item to copy.
 * @param targetArray Array into which is copy the item.
 * @param currentIndex Index of the item in its current array.
 * @param targetIndex Index at which to insert the item.
 *
 */
export function cloneArrayItem<T = any>(cloneItem: T, targetArray: T[], currentIndex: number, targetIndex: number): void {
  const to = clamp$1(targetIndex, targetArray.length);
  if (cloneItem) {
    targetArray.splice(to, 0, cloneItem);
  }
}

/**
 * Clamps a number between zero and a maximum.
 * @param {?} value
 * @param {?} max
 * @return {?}
 */
function clamp$1(value, max) {
  return Math.max(0, Math.min(max, value));
}

export function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}
