import { isNotEmpty } from './empty.util';
import { isEqual, isObject, transform } from 'lodash';

/**
 * Returns passed object without specified property
 */
export function deleteProperty(object: object, key: string): object {
  const { [key]: deletedKey, ...otherKeys } = object as { [key: string]: any };
  return otherKeys;
}

/**
 * Returns true if the passed object is empty or has only empty property.
 * hasOnlyEmptyProperties({});               // true
 * hasOnlyEmptyProperties({a: null});        // true
 * hasOnlyEmptyProperties({a: []});          // true
 * hasOnlyEmptyProperties({a: [], b: {});    // true
 * hasOnlyEmptyProperties({a: 'a', b: 'b'}); // false
 * hasOnlyEmptyProperties({a: [], b: 'b'});  // false
 */
export function hasOnlyEmptyProperties(obj: object): boolean {
  const objectType = typeof obj;
  if (objectType === 'object') {
    if (Object.keys(obj).length === 0) {
      return true;
    } else {
      let result = true;
      for (const key in obj) {
        if (isNotEmpty(obj[key])) {
          result = false;
          break;
        }
      }
      return result;
    }
  }
}

/**
 * Returns diff from the base object.
 * difference({}, {});                      // {}
 * difference({a: 'a', b: 'b'}, {a: 'a'});  // {b: 'b'}
 * difference({a: 'a', b: {}}, {a: 'a'});   // {}
 * difference({a: 'a'}, {a: 'a', b: 'b'});  // {}
 */
export function difference(object: object, base: object) {
  const changes = (o, b) => {
    return transform(o, (result, value, key) => {
      if (!isEqual(value, b[key]) && isNotEmpty(value)) {
        const resultValue = ((isObject(value) && isObject(b[key])) ? changes(value, b[key]) : value) as object;
        if (!hasOnlyEmptyProperties(resultValue)) {
          result[key] = resultValue;
        }
      }
    });
  };
  return changes(object, base);
}

/**
 * This function flatten an object by taking its nested properties
 * and using their path as a top level key, and their value as the value of the
 * newest top level property.
 *
 * Example:
 * ```
 *   const toFlatten = {
 *     a: 1,
 *     custom: {
 *       nested: {
 *         object: 'hello'
 *       }
 *     },
 *     another: {
 *       nested: {
 *         object: 'awesome'
 *       }
 *     }
 *   };
 *
 *   flattenObject(toFlatten); // { a: 1, custom.nested.object: 'hello', another.nested.object: 'awesome' };
 * ```
 *
 * @param obj
 * @param prefix
 */
export const flattenObject = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object') {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
