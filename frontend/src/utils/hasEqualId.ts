import { ID, WithId } from '../model/Id';

export function hasEqualId<T extends WithId<ID>>(a: T, b: T) {
  return a.id === b.id;
}
