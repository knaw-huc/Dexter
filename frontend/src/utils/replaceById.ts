import { WithId } from '../model/Id';

export function replaceById<T extends WithId>(replacement: T, all: T[]) {
  return all.map(c => (c.id === replacement.id ? replacement : c));
}
