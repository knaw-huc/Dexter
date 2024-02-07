/**
 * Upsert: 'Update or insert'...
 *
 * Create new array in which:
 * - update replaces first element that matches predicate, or:
 * - update is pushed when nothing matches
 */
export function upsert<T>(
  arr: T[],
  update: T,
  predicate: (a: T) => boolean,
): T[] {
  const result = [...arr];
  const i = arr.findIndex(predicate);
  if (i > -1) {
    result[i] = update;
  } else {
    result.push(update);
  }
  return result;
}
