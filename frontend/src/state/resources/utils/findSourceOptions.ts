import { UUID } from '../../../model/DexterModel';
import { BoundState } from '../BoundState';
import { linkSourceChildren } from './linkSourceChildren';
import { findCorpus } from './findCorpus';

export function findSourceOptions(corpusId: UUID, state: BoundState) {
  const corpus = findCorpus(corpusId, state);
  const all = state.userResources.sources.map(c =>
    linkSourceChildren(c, state),
  );
  const selectedIds = corpus.sources.map(s => s.id);
  return all.filter(c => !selectedIds.includes(c.id));
}
