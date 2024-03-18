import { WithId } from '../model/DexterModel';

export function hasEqualId<T extends WithId>(a: T, b: T) {
  return a.id === b.id;
}
