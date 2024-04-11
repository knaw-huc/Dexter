import { Any } from '../components/common/Any';

export type ResultListLanguage = {
  id: string;
  refName: string;
};
export type ResultLanguage = ResultListLanguage;
export type ResultListLanguages = {
  source: string;
  termsOfUse: string;
  languages: ResultListLanguage[];
};

export function isLanguage(toTest: Any): toTest is ResultLanguage {
  return !!(toTest as ResultLanguage)?.refName;
}
