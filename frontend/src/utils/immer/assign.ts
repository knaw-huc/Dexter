/**
 * Assign properties of source to target
 */
export function assign<T>(target: T, source: Partial<T>): void {
  Object.assign(target, source);
}
