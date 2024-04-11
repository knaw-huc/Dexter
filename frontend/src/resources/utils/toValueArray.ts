import { ID, WithId } from '../../model/Id';

export function toValueArray<T extends WithId<ID>>(
  resourceMap: Map<ID, T>,
): T[] {
  return Array.from(resourceMap.values());
}
