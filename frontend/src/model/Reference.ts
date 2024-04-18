import { Any } from '../components/common/Any';

import { WithId } from './Id';
import { CslString } from './CslJson';
import _ from 'lodash';

export type FormReference = {
  input: string;
  terms: string;
  csl: CslString;
};
export type ResultReference = Omit<FormReference, 'terms'> & WithId;
export type Reference = ResultReference;

export function isReference(toTest: Any): toTest is Reference {
  if (!toTest) {
    return false;
  }
  return (
    !_.isUndefined((toTest as Reference).input) &&
    !_.isUndefined((toTest as Reference).csl)
  );
}

export type SubmitFormReference = FormReference;
