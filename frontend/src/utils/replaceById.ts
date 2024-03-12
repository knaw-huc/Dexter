import { WithId } from '../model/DexterModel';

export function replaceById<T extends WithId>(replacement: T, all: T[]) {
  return all.map(c => (c.id === replacement.id ? replacement : c));
}
