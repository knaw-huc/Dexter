import { ResourceState } from './ResourceState';
import { ImmerBoundStateCreator } from '../ImmerBoundStateCreator';
import { DraftSetter, Setter } from '../../utils/recipe/Setter';
import {
  ResultUserResources,
  UserResourceIdsMaps,
} from '../../model/DexterModel';
import { BoundState } from './BoundState';
import { assign } from '../../utils/recipe/assign';

export const defaultUserResources: UserResourceIdsMaps = {
  corpora: new Map(),
  sources: new Map(),
  metadataValues: new Map(),
  metadataKeys: new Map(),
  media: new Map(),
  references: new Map(),
  tags: new Map(),
};

export type UserResourcesState = ResourceState &
  UserResourceIdsMaps & {
    setUserResources: Setter<ResultUserResources>;
    updateUserResources: DraftSetter<UserResourceIdsMaps>;
  };

export const createUserResourceSlice: ImmerBoundStateCreator<
  BoundState,
  UserResourcesState
> = set => ({
  ...defaultUserResources,
  isLoading: true,
  error: null,
  setUserResources: update =>
    set(state => assign(state.userResources, toIdMaps(update))),
  updateUserResources: recipe => set(state => recipe(state.userResources)),
  setError: update => set(state => void (state.userResources.error = update)),
  setLoading: update =>
    set(state => void (state.userResources.isLoading = update)),
});

function toIdMaps(update: ResultUserResources): UserResourceIdsMaps {
  return {
    ...update,
    corpora: new Map(update.corpora.map(e => [e.id, e])),
    sources: new Map(update.sources.map(e => [e.id, e])),
    metadataValues: new Map(update.metadataValues.map(e => [e.id, e])),
    metadataKeys: new Map(update.metadataKeys.map(e => [e.id, e])),
    media: new Map(update.media.map(e => [e.id, e])),
    references: new Map(update.references.map(e => [e.id, e])),
    tags: new Map(update.tags.map(e => [e.id, e])),
  };
}
