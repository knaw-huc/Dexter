import { WithId } from '../../model/DexterModel';

/**
 * Replace element in array with the update using ID
 * @param updateIn
 * @param toUpdate
 */
export function update(updateIn: WithId[], toUpdate: WithId): void {
  const index = updateIn.findIndex(item => item.id === toUpdate.id);
  updateIn[index] = toUpdate;
}
