import { Corpus, ResultCorpusWithChildIds } from '../../model/DexterModel';
import { BoundState } from '../store/BoundState';
import { findCorpusWithChildIds } from './findCorpusWithChildIds';
import { findTag } from './findTag';
import { findLanguage } from './findLanguage';
import { findMetadataValues } from './findMetadataValues';
import { findSourceWithChildIds } from './findSourceWithChildIds';
import { linkSourceChildren } from './linkSourceChildren';

export function linkCorpusChildren(
  corpus: ResultCorpusWithChildIds,
  state: BoundState,
): Corpus {
  return {
    ...corpus,
    parent: findCorpusWithChildIds(corpus.parentId, state),
    tags: corpus.tags.map(t => findTag(t, state)),
    languages: corpus.languages.map(t => findLanguage(t, state)),
    sources: corpus.sources
      .map(t => findSourceWithChildIds(t, state))
      .map(s => linkSourceChildren(s, state)),
    metadataValues: corpus.metadataValues.map(t =>
      findMetadataValues(t, state),
    ),
    subcorpora: corpus.subcorpora
      .map(c => findCorpusWithChildIds(c, state))
      .map(c => linkCorpusChildren(c, state)),
  };
}
