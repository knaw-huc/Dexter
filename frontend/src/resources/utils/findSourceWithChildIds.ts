import { ResultSourceWithChildIds, UUID } from '../../model/DexterModel';
import { BoundState } from '../store/BoundState';

export function findSourceWithChildIds(
  id: UUID,
  state: BoundState,
): ResultSourceWithChildIds | undefined {
  return state.userResources.sources.get(id);
}
