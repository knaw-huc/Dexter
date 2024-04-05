import { create } from 'zustand';
import { BoundStore } from './BoundStore';
import {
  createCorpusPageSlice,
  createSharedCorpusPageSlice,
} from './CorpusPageState';
import { createUserResourceSlice } from './UserResourcesState';
import { immer } from 'zustand/middleware/immer';
import { createLanguageSlice } from './LanguagesState';

export const useBoundStore = create<BoundStore>()(
  immer((...state) => ({
    languages: createLanguageSlice(...state),
    userResources: createUserResourceSlice(...state),
    corpusPage: {
      ...createCorpusPageSlice(...state),
      ...createSharedCorpusPageSlice(...state),
    },
  })),
);
