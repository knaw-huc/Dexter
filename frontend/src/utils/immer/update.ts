import { WithId } from '../../model/DexterModel';

/**
 * Replace element in array with the update using ID
 * @param toUpdate
 * @param updateIn
 */
export function update(toUpdate: WithId, updateIn: WithId[]): void {
  const index = updateIn.findIndex(item => item.id === toUpdate.id);
  updateIn[index] = toUpdate;
}
