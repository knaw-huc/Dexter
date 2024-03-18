import { WithId } from '../../model/DexterModel';

export function add(toAdd: WithId, addTo: WithId[]): void {
  addTo.push(toAdd);
}
