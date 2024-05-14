import { BoundState } from '../store/BoundState';
import { ResultReference } from '../../model/Reference';
import { UUID } from '../../model/Id';

export function findReference(
  id: UUID,
  resources: BoundState,
): ResultReference | undefined {
  return resources.userResources.references.get(id);
}
