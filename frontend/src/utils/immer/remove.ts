import { UUID, WithId } from '../../model/DexterModel';
import _ from 'lodash';

export function remove(toRemove: UUID, removeFrom: WithId[]): void {
  _.remove(removeFrom, (item: WithId) => item.id === toRemove);
}
