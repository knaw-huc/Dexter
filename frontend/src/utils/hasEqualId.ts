import { ID, WithId } from '../model/DexterModel';

export function hasEqualId<T extends WithId<ID>>(a: T, b: T) {
  return a.id === b.id;
}
