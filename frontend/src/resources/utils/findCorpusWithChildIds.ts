import { ResultCorpusWithChildIds, UUID } from '../../model/DexterModel';
import { BoundState } from '../store/BoundState';

export function findCorpusWithChildIds(
  id: UUID,
  state: BoundState,
): ResultCorpusWithChildIds | undefined {
  return state.userResources.corpora.get(id);
}
