import { ResultReference, UUID } from '../../model/DexterModel';
import { BoundState } from '../store/BoundState';

export function findReference(
  id: UUID,
  resources: BoundState,
): ResultReference | undefined {
  return resources.userResources.references.get(id);
}
