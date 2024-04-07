import { BoundState } from '../BoundState';
import { MetadataValue, toMetadataValue } from '../../../model/DexterModel';

export function findMetadataValues(
  id: string,
  resources: BoundState,
): MetadataValue | undefined {
  const metadataValue = resources.userResources.metadataValues.find(
    mv => mv.id === id,
  );
  if (!metadataValue) {
    return undefined;
  }
  return toMetadataValue(metadataValue, resources.userResources.metadataKeys);
}
