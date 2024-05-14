export type Setter<T> = (update: T) => void;

/**
 * Update state using immer draft
 */
export type DraftRecipe<T> = (prev: T) => void;
export type DraftSetter<T> = (recipe: DraftRecipe<T>) => void;
