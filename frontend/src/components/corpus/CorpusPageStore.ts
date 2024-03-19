import { create } from 'zustand';
import { Corpus, Source } from '../../model/DexterModel';
import { immer } from 'zustand/middleware/immer';
import { DraftSetter, Setter } from '../../utils/immer/Setter';
import { assign } from '../../utils/immer/assign';

interface CorpusPageState {
  /**
   * Resource displayed on index page
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
    setCorpus: corpus => set(state => assign(state, { corpus })),
    setSubcorpora: updater => set(state => updater(state.corpus.subcorpora)),
    setSources: updater => set(state => updater(state.corpus.sources)),

    corpusOptions: [],
    setCorpusOptions: corpusOptions =>
      set(state => assign(state, { corpusOptions })),

    sourceOptions: [],
    setSourceOptions: sourceOptions =>
      set(state => assign(state, { sourceOptions })),
  })),
);
