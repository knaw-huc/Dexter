import { ResourceState } from './ResourceState';
import { ImmerBoundStateCreator } from '../ImmerBoundStateCreator';
import { DraftSetter, Setter } from '../../utils/recipe/Setter';
import { ResultUserResources } from '../../model/DexterModel';
import { BoundState } from './BoundState';
import { assign } from '../../utils/recipe/assign';

export const defaultUserResources: ResultUserResources = {
  corpora: [],
  sources: [],
  metadataValues: [],
  metadataKeys: [],
  media: [],
  references: [],
  tags: [],
};

export type UserResourcesState = ResourceState &
  ResultUserResources & {
    setUserResources: Setter<ResultUserResources>;
    updateUserResources: DraftSetter<ResultUserResources>;
  };

export const createUserResourceSlice: ImmerBoundStateCreator<
  BoundState,
  UserResourcesState
> = set => ({
  ...defaultUserResources,
  isLoading: true,
  error: null,
  setUserResources: update => set(state => assign(state.userResources, update)),
  updateUserResources: recipe => set(state => recipe(state.userResources)),
  setError: update => set(state => void (state.userResources.error = update)),
  setLoading: update =>
    set(state => void (state.userResources.isLoading = update)),
});
