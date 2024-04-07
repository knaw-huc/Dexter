import { ResourceState } from './ResourceState';
import { ImmerBoundStateCreator } from '../ImmerBoundStateCreator';
import { Setter } from '../../utils/recipe/Setter';
import { ResultListLanguages } from '../../model/DexterModel';
import { BoundState } from './BoundState';
import { assign } from '../../utils/recipe/assign';

export const defaultLanguages: ResultListLanguages = {
  termsOfUse: '',
  source: '',
  languages: [],
};

export type LanguagesState = ResourceState &
  ResultListLanguages & {
    setLanguages: Setter<ResultListLanguages>;
  };

export const createLanguageSlice: ImmerBoundStateCreator<
  BoundState,
  LanguagesState
> = set => ({
  ...defaultLanguages,
  isLoading: true,
  error: null,
  setLanguages: update => set(state => assign(state.languages, update)),
  setError: update => set(state => void (state.languages.error = update)),
  setLoading: update => set(state => void (state.languages.isLoading = update)),
});
