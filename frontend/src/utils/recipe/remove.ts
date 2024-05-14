import _ from 'lodash';
import { UUID, WithId } from '../../model/Id';

/**
 * Remove element from array
 * @return void
 */
export function remove(inDraft: WithId[], toRemove: UUID): void {
  _.remove(inDraft, (item: WithId) => item.id === toRemove);
}
