import { WithId } from '../../model/DexterModel';

/**
 * Replace element in array with the update using ID
 * @return void
 */
export function replace(inDraft: WithId[], toUpdate: WithId): void {
  const index = inDraft.findIndex(item => item.id === toUpdate.id);
  inDraft[index] = toUpdate;
}
