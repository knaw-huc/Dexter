export type Setter<T> = (update: T) => void;

/**
 * Update state using immer
 */
export type DraftModifier<T> = (prev: T) => void;
export type DraftSetter<T> = (updater: DraftModifier<T>) => void;

export type MixedSetterParam<T> = T | DraftModifier<T>;
export type MixedSetter<T> = (updater?: MixedSetterParam<T>) => void;
