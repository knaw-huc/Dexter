import { WithId } from '../../model/DexterModel';

/**
 * Add element to array
 */
export function add(addTo: WithId[], toAdd: WithId): void {
  addTo.push(toAdd);
}
