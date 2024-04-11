import { useBoundStore } from './store/useBoundStore';

export const useIsUserResourcesLoading = (): boolean =>
  useBoundStore(
    state => state.userResources.isLoading || state.languages.isLoading,
  );
