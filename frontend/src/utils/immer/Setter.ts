export type Setter<T> = (update: T) => void;

/**
 * Update state using immer
 */
export type DraftRecipe<T> = (prev: T) => void;
export type DraftSetter<T> = (recipe: DraftRecipe<T>) => void;

export type MixedSetterParam<T> = T | DraftRecipe<T>;
export type MixedSetter<T> = (recipe?: MixedSetterParam<T>) => void;
