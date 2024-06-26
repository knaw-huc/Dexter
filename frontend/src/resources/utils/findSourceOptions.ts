import { BoundState } from '../store/BoundState';
import { linkSourceChildren } from './linkSourceChildren';
import { findCorpus } from './findCorpus';
import { toValueArray } from './toValueArray';
import { Source } from '../../model/Source';
import { UUID } from '../../model/Id';

export function findSourceOptions(corpusId: UUID, state: BoundState): Source[] {
  const corpus = findCorpus(corpusId, state);
  const all = toValueArray(state.userResources.sources).map(c =>
    linkSourceChildren(c, state),
  );
  const selectedIds = corpus.sources.map(s => s.id);
  return all.filter(c => !selectedIds.includes(c.id));
}
