import { create } from 'zustand';
import { Setter } from '../../utils/recipe/Setter';
import { immer } from 'zustand/middleware/immer';
import { ReferenceStyle } from '../../components/reference/ReferenceStyle';
import _ from 'lodash';
import { User, UserSettings } from '../../model/User';

interface UserState {
  /**
   * Resource displayed on index page
   */
  user: User;
  setUserName: Setter<string>;
  setUserSettings: Setter<UserSettings>;
}

const defaultUser: User = {
  name: '',
  settings: {
    referenceStyle: ReferenceStyle.apa,
  },
};

export const useUserStore = create<UserState>()(
  immer(set => {
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
    };
  }),
);
