import { useBoundStore } from '../useBoundStore';

export const useIsUserResourcesLoading = (): boolean =>
  useBoundStore(
    state => state.userResources.isLoading || state.languages.isLoading,
  );
