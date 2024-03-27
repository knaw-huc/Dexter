import { WithId } from '../../model/DexterModel';

/**
 * Replace element in array with the update using ID
 * @return void
 */
export function replace(updateIn: WithId[], toUpdate: WithId): void {
  const index = updateIn.findIndex(item => item.id === toUpdate.id);
  updateIn[index] = toUpdate;
}
