/**
 * Assign properties of source to target
 * @return void
 */
export function assign<T>(target: T, source: Partial<T>): void {
  Object.assign(target, source);
}
