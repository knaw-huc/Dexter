import { BoundState } from '../BoundState';
import { MetadataValue, toMetadataValue } from '../../../model/DexterModel';
import { toValueArray } from './toValueArray';

export function findMetadataValues(
  id: string,
  resources: BoundState,
): MetadataValue | undefined {
  const metadataValue = resources.userResources.metadataValues.get(id);
  if (!metadataValue) {
    return undefined;
  }
  return toMetadataValue(
    metadataValue,
    toValueArray(resources.userResources.metadataKeys),
  );
}
