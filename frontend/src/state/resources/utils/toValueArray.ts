import { UUID, WithId } from '../../../model/DexterModel';

export function toValueArray<T extends WithId>(resourceMap: Map<UUID, T>): T[] {
  return Array.from(resourceMap.values());
}
