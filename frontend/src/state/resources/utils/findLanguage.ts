import { BoundState } from '../BoundState';
import { ResultListLanguage } from '../../../model/DexterModel';

export function findLanguage(
  id: string,
  resources: BoundState,
): ResultListLanguage | undefined {
  return resources.languages.languages.find(l => l.id === id);
}
