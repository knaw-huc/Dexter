import { WithId } from '../../model/DexterModel';

/**
 * Add element to array
 * @return void
 */
export function push(toDraft: WithId[], ...toAdd: WithId[]): void {
  toDraft.push(...toAdd);
}
