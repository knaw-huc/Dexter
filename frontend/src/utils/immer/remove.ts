import { UUID, WithId } from '../../model/DexterModel';
import _ from 'lodash';

/**
 * Remove element from array
 */
export function remove(removeFrom: WithId[], toRemove: UUID): void {
  _.remove(removeFrom, (item: WithId) => item.id === toRemove);
}
