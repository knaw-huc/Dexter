import { BoundState } from '../store/BoundState';
import { linkCorpusChildren } from './linkCorpusChildren';
import { Corpus } from '../../model/Corpus';
import { UUID } from '../../model/Id';

export function findCorpus(id: UUID, state: BoundState): Corpus {
  return linkCorpusChildren(state.userResources.corpora.get(id), state);
}
