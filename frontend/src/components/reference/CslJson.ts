import { Any } from '../common/Any';
import _ from 'lodash';

export type CslJson = {
  author: { family: string }[];
  title: string;
  issued: { ['date-parts']: number[][] };
  id?: string;
}[];

export type CslString = string;

export function isCsl(toTest: Any): toTest is CslString {
  if (!toTest || !_.isString(toTest)) {
    return false;
  }
  const parsed = JSON.parse(toTest);
  return !!(
    (parsed as CslJson)?.[0]?.author && (parsed as CslJson)?.[0]?.title
  );
}
