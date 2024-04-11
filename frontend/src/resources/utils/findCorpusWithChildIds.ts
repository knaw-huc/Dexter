import { BoundState } from '../store/BoundState';
import { ResultCorpusWithChildIds } from '../../model/Corpus';
import { UUID } from '../../model/Id';

export function findCorpusWithChildIds(
  id: UUID,
  state: BoundState,
): ResultCorpusWithChildIds | undefined {
  return state.userResources.corpora.get(id);
}
