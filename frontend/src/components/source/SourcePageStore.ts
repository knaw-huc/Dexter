import { create } from 'zustand';
import { Source } from '../../model/DexterModel';
import { immer } from 'zustand/middleware/immer';
import { DraftRecipe, DraftSetter } from '../../utils/immer/Setter';

interface SourcePageState {
  /**
   * Resource displayed on index page
   */
  source: Source;
  setSource: DraftSetter<Source>;
}

export const useSourcePageStore = create<SourcePageState>()(
  immer(set => ({
    source: null,
    setSource: (recipe: DraftRecipe<Source>) => {
      set(state => recipe(state.source));
    },
  })),
);
