import { BoundState } from '../store/BoundState';
import { linkSourceChildren } from './linkSourceChildren';
import { Source } from '../../model/Source';
import { UUID } from '../../model/Id';

export function findSource(id: UUID, state: BoundState): Source {
  return linkSourceChildren(
    state.userResources.sources.find(s => s.id === id),
    state,
  );
}
