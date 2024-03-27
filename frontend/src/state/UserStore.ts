import { create } from 'zustand';
import { User } from '../model/DexterModel';
import { DraftRecipe, DraftSetter } from '../utils/draft/Setter';
import { immer } from 'zustand/middleware/immer';
import { ReferenceStyle } from '../components/reference/ReferenceStyle';
import { defaultUser } from './defaultUser';

interface UserState {
  /**
   * Resource displayed on index page
   */
  user: User;
  setUser: DraftSetter<User>;
  getReferenceStyle: () => ReferenceStyle;
}

export const useUserStore = create<UserState>()(
  immer((set, get) => {
    function getSettings() {
      return { ...defaultUser.settings, ...get().user?.settings };
    }

    return {
      user: defaultUser,
      setUser: (recipe: DraftRecipe<User>) => {
        set(state => recipe(state.user));
      },
      getReferenceStyle: () => {
        return getSettings().referenceStyle;
      },
    };
  }),
);
