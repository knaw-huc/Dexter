import { WithId } from '../../model/DexterModel';

/**
 * Add element to array
 * @return void
 */
export function push(addTo: WithId[], toAdd: WithId): void {
  addTo.push(toAdd);
}
