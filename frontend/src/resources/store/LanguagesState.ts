import { ResourceState } from './ResourceState';
import { ImmerBoundStateCreator } from './ImmerBoundStateCreator';
import { Setter } from '../../utils/recipe/Setter';
import { BoundState } from './BoundState';
import { ResultLanguage, ResultListLanguages } from '../../model/Language';

export const defaultLanguages = {
  languages: new Map(),
};

export type LanguagesState = ResourceState & {
  languages: Map<string, ResultLanguage>;
  setLanguages: Setter<ResultListLanguages>;
};

export const createLanguageSlice: ImmerBoundStateCreator<
  BoundState,
  LanguagesState
> = set => ({
  ...defaultLanguages,
  isLoading: true,
  error: null,
  setLanguages: update =>
    set(state => void (state.languages.languages = toLanguageMap(update))),
  setError: update => set(state => void (state.languages.error = update)),
  setLoading: update => set(state => void (state.languages.isLoading = update)),
});

function toLanguageMap(update: ResultListLanguages) {
  return new Map(update.languages.map(l => [l.id, l]));
}
