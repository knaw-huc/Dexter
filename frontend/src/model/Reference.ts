import { Any } from '../components/common/Any';

import { WithId } from './Id';
import { CslString } from './CslJson';

export type FormReference = {
  input: string;
  terms: string;
  csl: CslString;
};
export type ResultReference = Omit<FormReference, 'terms'> & WithId;
export type Reference = ResultReference;

export function isReference(toTest: Any): toTest is Reference {
  return !!(
    (toTest as Reference)?.input && (toTest as Reference).csl !== undefined
  );
}

export type SubmitFormReference = FormReference;
