import { create } from 'zustand';
import { Corpus, Source } from '../../model/DexterModel';
import { immer } from 'zustand/middleware/immer';
import { DraftSetter, Setter } from '../../utils/recipe/Setter';
import { assign } from '../../utils/recipe/assign';
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
  allCorpora: Corpus[];
  setAllCorpora: Setter<Corpus[]>;
  getCorpusOptions: () => Corpus[];

  /**
   * Sources that can be selected
   */
  allSources: Source[];
  setAllSources: Setter<Source[]>;
  getSourceOptions: () => Source[];
}

export const useCorpusPageStore = create<CorpusPageState>()(
  immer((set, get) => ({
    corpus: defaultCorpus,
    setCorpus: corpus => set(state => assign(state, { corpus })),
    setSubcorpora: recipe => set(state => recipe(state.corpus.subcorpora)),
    setSources: recipe => set(state => recipe(state.corpus.sources)),

    allCorpora: [],
    setAllCorpora: allCorpora => set(state => assign(state, { allCorpora })),
    getCorpusOptions: () => {
      const corpus = get().corpus;
      const nonOptions = corpus.subcorpora.map(s => s.id);
      nonOptions.push(corpus.id);
      const parent = corpus.parent;
      if (parent) {
        nonOptions.push(parent.id);
      }
      return get().allCorpora.filter(c => !nonOptions.includes(c.id));
    },

    allSources: [],
    setAllSources: allSources => set(state => assign(state, { allSources })),
    getSourceOptions: () => {
      const selectedIds = get().corpus.sources.map(s => s.id);
      return get().allSources.filter(c => !selectedIds.includes(c.id));
    },
  })),
);
