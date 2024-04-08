import { ID, WithId } from '../../../model/DexterModel';

export function toValueArray<T extends WithId<ID>>(
  resourceMap: Map<ID, T>,
): T[] {
  return Array.from(resourceMap.values());
}
