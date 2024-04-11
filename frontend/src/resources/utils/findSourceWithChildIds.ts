import { BoundState } from '../store/BoundState';
import { ResultSourceWithChildIds } from '../../model/Source';
import { UUID } from '../../model/Id';

export function findSourceWithChildIds(
  id: UUID,
  state: BoundState,
): ResultSourceWithChildIds | undefined {
  return state.userResources.sources.get(id);
}
