import { Corpus, UUID } from '../../model/DexterModel';
import { BoundState } from '../store/BoundState';
import { linkCorpusChildren } from './linkCorpusChildren';

export function findCorpus(id: UUID, state: BoundState): Corpus {
  return linkCorpusChildren(state.userResources.corpora.get(id), state);
}
