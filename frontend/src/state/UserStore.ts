import { create } from 'zustand';
import { User } from '../model/DexterModel';
import { DraftRecipe, DraftSetter } from '../utils/immer/Setter';
import { immer } from 'zustand/middleware/immer';
import { ReferenceStyle } from '../components/reference/ReferenceStyle';

export const defaultUser: User = {
  name: '',
  settings: {
    referenceStyle: ReferenceStyle.apa,
  },
};

interface UserState {
  /**
   * Resource displayed on index page
   */
  user: User;
  setUser: DraftSetter<User>;
  getReferenceStyle: () => ReferenceStyle;
}

export const useUserStore = create<UserState>()(
  immer((set, get) => ({
    user: null,
    setUser: (recipe: DraftRecipe<User>) => {
      set(state => recipe(state.user));
    },
    getReferenceStyle: () => {
      return (
        get().user.settings.referenceStyle ||
        defaultUser.settings.referenceStyle
      );
    },
  })),
);
