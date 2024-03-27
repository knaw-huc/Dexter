import { Any } from '../../components/common/Any';
import _ from 'lodash';

/**
 * Set resource key to value
 * @return void
 */
export function set<T extends object>(
  resource: T,
  key: string,
  value: Any,
): void {
  _.set(resource, key, value);
}
