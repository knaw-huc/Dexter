import { UserResourcesState } from './UserResourcesState';

import { CorpusPageState, SharedCorpusPageSlice } from './CorpusPageState';
import { LanguagesState } from './LanguagesState';

export type BoundStore = {
  languages: LanguagesState;
  userResources: UserResourcesState;
  corpusPage: CorpusPageState & SharedCorpusPageSlice;
};
