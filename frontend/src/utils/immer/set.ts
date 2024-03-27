import { Any } from '../../components/common/Any';
import _ from 'lodash';

export function set<T extends object>(
  resource: T,
  path: string,
  value: Any,
): void {
  _.set(resource, path, value);
}
