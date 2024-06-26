import { ResourceState } from './ResourceState';
import { ImmerBoundStateCreator } from './ImmerBoundStateCreator';
import { DraftSetter, Setter } from '../../utils/recipe/Setter';
import { BoundState } from './BoundState';
import { assign } from '../../utils/recipe/assign';
import { ResultUserResources, UserResourceByIdMaps } from '../../model/User';
import { ID, WithId } from '../../model/Id';

export const defaultUserResources: UserResourceByIdMaps = {
  corpora: new Map(),
  sources: new Map(),
  metadataValues: new Map(),
  metadataKeys: new Map(),
  media: new Map(),
  references: new Map(),
  tags: new Map(),
};

export type UserResourcesState = ResourceState &
  UserResourceByIdMaps & {
    setUserResources: Setter<ResultUserResources>;
    updateUserResources: DraftSetter<UserResourceByIdMaps>;
  };

export const createUserResourceSlice: ImmerBoundStateCreator<
  BoundState,
  UserResourcesState
> = set => ({
  ...defaultUserResources,
  isLoading: true,
  setUserResources: update =>
    set(state => assign(state.userResources, toIdMaps(update))),
  updateUserResources: recipe => set(state => recipe(state.userResources)),
  setLoading: update =>
    set(state => void (state.userResources.isLoading = update)),
});

function toResourceByIdMap<T extends WithId<ID>>(update: T[]) {
  return new Map(update.map(e => [e.id, e]));
}

function toIdMaps(update: ResultUserResources): UserResourceByIdMaps {
  return {
    ...update,
    corpora: toResourceByIdMap(update.corpora),
    sources: toResourceByIdMap(update.sources),
    metadataValues: toResourceByIdMap(update.metadataValues),
    metadataKeys: toResourceByIdMap(update.metadataKeys),
    media: toResourceByIdMap(update.media),
    references: toResourceByIdMap(update.references),
    tags: toResourceByIdMap(update.tags),
  };
}
