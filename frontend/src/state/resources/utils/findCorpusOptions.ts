import { Corpus, UUID } from '../../../model/DexterModel';
import { BoundState } from '../BoundState';
import { linkCorpusChildren } from './linkCorpusChildren';
import { findCorpus } from './findCorpus';
import { toValueArray } from './toValueArray';

export function findCorpusOptions(corpusId: UUID, state: BoundState): Corpus[] {
  const corpora = toValueArray(state.userResources.corpora);
  const all = corpora.map(c => linkCorpusChildren(c, state));
  const corpus = findCorpus(corpusId, state);
  const nonOptions = corpus.subcorpora.map(s => s.id);
  nonOptions.push(corpus.id);
  const parent = corpus.parent;
  if (parent) {
    nonOptions.push(parent.id);
  }
  return all.filter(c => !nonOptions.includes(c.id));
}
