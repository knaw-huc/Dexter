import { create } from 'zustand';
import { Corpus, Source } from '../../model/DexterModel';
import { immer } from 'zustand/middleware/immer';
import { DraftSetter, Setter } from '../../utils/draft/Setter';
import { assign } from '../../utils/draft/assign';
import { defaultCorpus } from './defaultCorpus';

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
  setCorpusOptions: DraftSetter<Corpus[]>;

  /**
   * Sources that can be selected
   */
  sourceOptions: Source[];
  setSourceOptions: DraftSetter<Source[]>;
}

export const useCorpusPageStore = create<CorpusPageState>()(
  immer(set => ({
    corpus: defaultCorpus,
    setCorpus: corpus => set(state => assign(state, { corpus })),
    setSubcorpora: recipe => set(state => recipe(state.corpus.subcorpora)),
    setSources: recipe => set(state => recipe(state.corpus.sources)),

    corpusOptions: [],
    setCorpusOptions: recipe => set(state => recipe(state.corpusOptions)),

    sourceOptions: [],
    setSourceOptions: recipe => set(state => recipe(state.sourceOptions)),
  })),
);
