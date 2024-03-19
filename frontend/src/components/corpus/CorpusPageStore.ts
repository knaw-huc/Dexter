import { create } from 'zustand';
import { Corpus, Source } from '../../model/DexterModel';
import { immer } from 'zustand/middleware/immer';

/**
 * Update state using immer draft
 */
export type DraftSetter<T> = (updater: (prev: T) => void) => void;

export type Setter<T> = (update: T) => void;

interface CorpusPageState {
  /**
   * Corpus displayed on index page
   */
  corpus: Corpus;
  setCorpus: Setter<Corpus>;
  setSubcorpora: DraftSetter<Corpus[]>;
  setSources: DraftSetter<Source[]>;

  /**
   * Corpora that can be selected as parent or subcorpora
   */
  corpusOptions: Corpus[];
  setCorpusOptions: (update: Corpus[]) => void;

  /**
   * Sources that can be selected
   */
  sourceOptions: Source[];
  setSourceOptions: (update: Source[]) => void;
}

export const useCorpusPageStore = create<CorpusPageState>()(
  immer(set => ({
    corpus: null,
    setCorpus: update => set(state => void (state.corpus = update)),
    setSubcorpora: updater =>
      set(state => void updater(state.corpus.subcorpora)),
    setSources: updater => set(state => void updater(state.corpus.sources)),

    corpusOptions: [],
    setCorpusOptions: update =>
      set(state => void (state.corpusOptions = update)),

    sourceOptions: [],
    setSourceOptions: update =>
      set(state => void (state.sourceOptions = update)),
  })),
);
