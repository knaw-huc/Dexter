import { useBoundStore } from './useBoundStore';
import { UserResourcesState } from './UserResourcesState';

export const useUserResourcesStore = (): UserResourcesState =>
  useBoundStore(state => state.userResources);
