import { create } from 'zustand';
import { Source } from '../../model/DexterModel';
import { immer } from 'zustand/middleware/immer';
import { DraftSetter } from '../../utils/draft/Setter';
import { defaultSource } from './defaultSource';

interface SourcePageState {
  /**
   * Resource displayed on index page
   */
  source: Source;
  setSource: DraftSetter<Source>;
}

export const useSourcePageStore = create<SourcePageState>()(
  immer(set => ({
    source: defaultSource,
    setSource: recipe => set(state => recipe(state.source)),
  })),
);
