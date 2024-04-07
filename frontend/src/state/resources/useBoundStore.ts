import { create } from 'zustand';
import { BoundState } from './BoundState';

import { createUserResourceSlice } from './UserResourcesState';
import { immer } from 'zustand/middleware/immer';
import { createLanguageSlice } from './LanguagesState';

export const useBoundStore = create<BoundState>()(
  immer((...state) => ({
    languages: createLanguageSlice(...state),
    userResources: createUserResourceSlice(...state),
  })),
);
