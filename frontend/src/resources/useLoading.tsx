import { useBoundStore } from './store/useBoundStore';

export const useIsResourcesLoading = (): boolean =>
  useBoundStore(
    state => state.userResources.isLoading || state.languages.isLoading,
  );
