import { Any } from '../components/common/Any';
import { WithId } from './Id';
import { WithCreatedBy } from './CreatedBy';

export type FormTag = {
  val: string;
};

export type ResultTag = FormTag & WithId<number> & WithCreatedBy;

export function isTag(toTest: Any): toTest is ResultTag {
  return !!(toTest as ResultTag)?.val;
}
