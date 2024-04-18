import { Any } from '../components/common/Any';
import _ from 'lodash';

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
  if (!toTest) {
    return false;
  }
  return !_.isUndefined((toTest as ResultLanguage).refName);
}
