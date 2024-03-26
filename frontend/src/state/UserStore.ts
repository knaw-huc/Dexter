import { create } from 'zustand';
import { isUser, User, UserSettings } from '../model/DexterModel';
import { MixedSetter, MixedSetterParam } from '../utils/immer/Setter';
import { immer } from 'zustand/middleware/immer';
import { ReferenceStyle } from '../components/reference/ReferenceStyle';
import { assign } from '../utils/immer/assign';

export const defaultUserSettings: UserSettings = {
  referenceStyle: ReferenceStyle.apa,
};

interface UserState {
  /**
   * Resource displayed on index page
   */
  user: User;
  setUser: MixedSetter<User>;
  getReferenceStyle: () => ReferenceStyle;
}

export const useUserStore = create<UserState>()(
  immer((set, get) => ({
    user: null,
    setUser: (recipe: MixedSetterParam<User>) => {
      if (isUser(recipe)) {
        set(state => assign(state, { user: recipe }));
      } else {
        set(state => recipe(state.user));
      }
    },
    getReferenceStyle: () => {
      return (
        get().user?.settings?.referenceStyle ||
        defaultUserSettings.referenceStyle
      );
    },
  })),
);
