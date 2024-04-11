import { UserResourcesState } from './UserResourcesState';

import { LanguagesState } from './LanguagesState';

export type BoundState = {
  languages: LanguagesState;
  userResources: UserResourcesState;
};
