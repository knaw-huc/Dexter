import { BoundState } from '../store/BoundState';
import { ResultLanguage } from '../../model/DexterModel';

export function findLanguage(
  languageId: string,
  resources: BoundState,
): ResultLanguage | undefined {
  return resources.languages.languages.get(languageId);
}
