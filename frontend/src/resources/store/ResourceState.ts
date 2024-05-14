export type ResourceReadingState = {
  isLoading: boolean;
};

export type ResourceState = ResourceReadingState & {
  setLoading: (loading: boolean) => void;
};
