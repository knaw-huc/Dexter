import { Any } from '../components/common/Any';
import { WithId } from './Id';
import { WithCreatedBy } from './CreatedBy';
import _ from 'lodash';

export type FormTag = {
  val: string;
};

export type ResultTag = FormTag & WithId<number> & WithCreatedBy;

export function isTag(toTest: Any): toTest is ResultTag {
  if (!toTest) {
    return false;
  }
  return !_.isUndefined((toTest as ResultTag).val);
}
