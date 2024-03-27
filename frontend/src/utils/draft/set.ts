import { Any } from '../../components/common/Any';
import _ from 'lodash';

/**
 * Set resource key to value
 * @return void
 */
export function set<T extends object>(
  inDraft: T,
  key: string,
  value: Any,
): void {
  _.set(inDraft, key, value);
}
