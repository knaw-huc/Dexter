import { ResultCorpusWithChildIds, UUID } from '../../../model/DexterModel';
import { BoundState } from '../BoundState';

export function findCorpusWithChildIds(
  id: UUID,
  state: BoundState,
): ResultCorpusWithChildIds | undefined {
  return state.userResources.corpora.find(c => c.id === id);
}
