/**
 * Assign properties of source to target
 * @return void
 */
export function assign<T>(toDraft: T, source: Partial<T>): void {
  Object.assign(toDraft, source);
}
