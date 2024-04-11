import { ResultSourceWithChildIds, Source } from '../../model/DexterModel';
import { BoundState } from '../store/BoundState';
import { findCorpusWithChildIds } from './findCorpusWithChildIds';
import { findLanguage } from './findLanguage';
import { findMetadataValues } from './findMetadataValues';
import { findTag } from './findTag';
import { findReference } from './findReference';
import { findMedia } from './findMedia';

export function linkSourceChildren(
  source: ResultSourceWithChildIds,
  state: BoundState,
): Source {
  return {
    ...source,
    references: source.references.map(r => findReference(r, state)),
    corpora: source.corpora.map(r => findCorpusWithChildIds(r, state)),
    languages: source.languages.map(l => findLanguage(l, state)),
    media: source.media.map(r => findMedia(r, state)),
    metadataValues: source.metadataValues.map(t =>
      findMetadataValues(t, state),
    ),
    tags: source.tags.map(t => findTag(t, state)),
  };
}
