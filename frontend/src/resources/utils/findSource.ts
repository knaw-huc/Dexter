import { Source, UUID } from '../../model/DexterModel';
import { BoundState } from '../store/BoundState';
import { linkSourceChildren } from './linkSourceChildren';

export function findSource(id: UUID, state: BoundState): Source {
  return linkSourceChildren(
    state.userResources.sources.find(s => s.id === id),
    state,
  );
}
