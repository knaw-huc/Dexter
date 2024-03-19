import { WithId } from '../../model/DexterModel';

/**
 * Add element to array
 */
export function add(toAdd: WithId, addTo: WithId[]): void {
  addTo.push(toAdd);
}
