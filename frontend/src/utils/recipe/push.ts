import { WithId } from '../../model/Id';

/**
 * Add element to array
 * @return void
 */
export function push(toDraft: WithId[], ...toAdd: WithId[]): void {
  toDraft.push(...toAdd);
}
