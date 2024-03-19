import { create } from 'zustand';
import { isSource, Source } from '../../model/DexterModel';
import { immer } from 'zustand/middleware/immer';
import { MixedSetter, MixedSetterParam } from '../../utils/immer/Setter';
import { assign } from '../../utils/immer/assign';

interface SourcePageState {
  /**
   * Resource displayed on index page
   */
  source: Source;
  setSource: MixedSetter<Source>;
}

export const useSourcePageStore = create<SourcePageState>()(
  immer(set => ({
    source: null,
    setSource: (updater: MixedSetterParam<Source>) => {
      if (isSource(updater)) {
        set(state => assign(state, { source: updater }));
      } else {
        set(state => updater(state.source));
      }
    },
  })),
);
