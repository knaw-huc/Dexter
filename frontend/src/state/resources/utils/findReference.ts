import { ResultReference, UUID } from '../../../model/DexterModel';
import { BoundState } from '../BoundState';

export function findReference(
  id: UUID,
  resources: BoundState,
): ResultReference | undefined {
  return resources.userResources.references.get(id);
}
