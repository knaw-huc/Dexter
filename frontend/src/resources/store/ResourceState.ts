export type ResourceReadingState = {
  error: Error | null;
  isLoading: boolean;
};

export type ResourceState = ResourceReadingState & {
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
};
