import { ResourceState } from './ResourceState';
import { ImmerBoundStateCreator } from '../ImmerBoundStateCreator';
import { Setter } from '../../utils/recipe/Setter';
import { ResultUserResources } from '../../model/DexterModel';
import { BoundStore } from './BoundStore';
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
  };

export const createUserResourceSlice: ImmerBoundStateCreator<
  BoundStore,
  UserResourcesState
> = set => ({
  ...defaultUserResources,
  isLoading: true,
  error: null,
  setUserResources: update => set(state => assign(state.userResources, update)),
  setError: update => set(state => void (state.userResources.error = update)),
  setLoading: update =>
    set(state => void (state.userResources.isLoading = update)),
});
