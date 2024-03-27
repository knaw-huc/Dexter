import { create } from 'zustand';
import { User, UserSettings } from '../model/DexterModel';
import { Setter } from '../utils/draft/Setter';
import { immer } from 'zustand/middleware/immer';
import { ReferenceStyle } from '../components/reference/ReferenceStyle';
import { defaultUser } from './defaultUser';
import _ from 'lodash';

interface UserState {
  /**
   * Resource displayed on index page
   */
  user: User;
  setUserName: Setter<string>;
  setUserSettings: Setter<UserSettings>;
  getReferenceStyle: () => ReferenceStyle;
}

export const useUserStore = create<UserState>()(
  immer((set, get) => {
    function createSettings(update: Partial<UserSettings>) {
      const cleaned = _.omitBy(update, _.isNil);
      return { ...defaultUser.settings, ...cleaned };
    }

    return {
      user: defaultUser,
      setUserName: (update: string) => {
        set(state => void (state.user.name = update));
      },
      setUserSettings: (update: Partial<UserSettings>) => {
        set(state => void (state.user.settings = createSettings(update)));
      },
      getReferenceStyle: () => {
        return get().user.settings.referenceStyle;
      },
    };
  }),
);
