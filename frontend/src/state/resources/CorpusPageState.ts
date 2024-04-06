import { BoundStore } from './BoundStore';
import { ImmerBoundStateCreator } from '../ImmerBoundStateCreator';
import {
  Corpus,
  MetadataValue,
  ResultCorpusWithChildIds,
  ResultListLanguage,
  ResultMedia,
  ResultReference,
  ResultSourceWithChildIds,
  ResultTag,
  Source,
  toMetadataValue,
  UUID,
} from '../../model/DexterModel';

export type CorpusPageState = {
  corpusId: UUID;
  setCorpusId: (corpus: UUID) => void;
};

export const createCorpusPageSlice: ImmerBoundStateCreator<
  BoundStore,
  CorpusPageState
> = set => ({
  corpusId: '',
  setCorpusId: update =>
    set(draft => void (draft.corpusPage.corpusId = update)),
});

export type SharedCorpusPageSlice = {
  getCorpus: () => Corpus;
  getCorpusOptions: () => Corpus[];
  getSourceOptions: () => Source[];
};

export const createSharedCorpusPageSlice: ImmerBoundStateCreator<
  BoundStore,
  SharedCorpusPageSlice
> = (set, get) => {
  function getCorpus() {
    const corpusId = get().corpusPage.corpusId;
    if (!corpusId) {
      return;
    }
    return findCorpusChildren(findCorpus(corpusId, get()), get());
  }

  return {
    getCorpus,

    getCorpusOptions: () => {
      const all = get().userResources.corpora.map(c =>
        findCorpusChildren(c, get()),
      );
      const corpus = getCorpus();
      const nonOptions = corpus.subcorpora.map(s => s.id);
      nonOptions.push(corpus.id);
      const parent = corpus.parent;
      if (parent) {
        nonOptions.push(parent.id);
      }
      return all.filter(c => !nonOptions.includes(c.id));
    },
    getSourceOptions: () => {
      const corpus = getCorpus();
      const all = get().userResources.sources.map(c =>
        findSourceChildren(c, get()),
      );
      const selectedIds = corpus.sources.map(s => s.id);
      return all.filter(c => !selectedIds.includes(c.id));
    },
  };
};

function findCorpus(
  id: UUID,
  state: BoundStore,
): ResultCorpusWithChildIds | undefined {
  return state.userResources.corpora.find(c => c.id === id);
}

function findCorpusChildren(
  corpus: ResultCorpusWithChildIds,
  state: BoundStore,
): Corpus {
  return {
    ...corpus,
    parent: findCorpus(corpus.parentId, state),
    tags: corpus.tags.map(t => findTag(t, state)),
    languages: corpus.languages.map(t => findLanguage(t, state)),
    sources: corpus.sources
      .map(t => findSource(t, state))
      .map(s => findSourceChildren(s, state)),
    metadataValues: corpus.metadataValues.map(t =>
      findMetadataValues(t, state),
    ),
    subcorpora: corpus.subcorpora
      .map(c => findCorpus(c, state))
      .map(c => findCorpusChildren(c, state)),
  };
}

function findTag(id: number, resources: BoundStore): ResultTag | undefined {
  return resources.userResources.tags.find(t => t.id === id);
}

function findLanguage(
  id: string,
  resources: BoundStore,
): ResultListLanguage | undefined {
  return resources.languages.languages.find(l => l.id === id);
}

function findMetadataValues(
  id: string,
  resources: BoundStore,
): MetadataValue | undefined {
  const metadataValue = resources.userResources.metadataValues.find(
    mv => mv.id === id,
  );
  if (!metadataValue) {
    return undefined;
  }
  return toMetadataValue(metadataValue, resources.userResources.metadataKeys);
}

function findSource(
  id: UUID,
  state: BoundStore,
): ResultSourceWithChildIds | undefined {
  return state.userResources.sources.find(c => c.id === id);
}

function findSourceChildren(
  source: ResultSourceWithChildIds,
  state: BoundStore,
): Source {
  return {
    ...source,
    references: source.references.map(r => mapReference(r, state)),
    corpora: source.corpora.map(r => findCorpus(r, state)),
    languages: source.languages.map(l => findLanguage(l, state)),
    media: source.media.map(r => mapMedia(r, state)),
    metadataValues: source.metadataValues.map(t =>
      findMetadataValues(t, state),
    ),
    tags: source.tags.map(t => findTag(t, state)),
  };
}

function mapReference(
  id: UUID,
  resources: BoundStore,
): ResultReference | undefined {
  return resources.userResources.references.find(r => r.id === id);
}

function mapMedia(id: UUID, resources: BoundStore): ResultMedia | undefined {
  return resources.userResources.media.find(m => m.id === id);
}
