import { ID } from '../../../model/DexterModel';

export function addIdsTo<T extends ID>(addTo: T[], toAdd: T[]) {
  for (const id of toAdd) {
    if (addTo.indexOf(id) === -1) {
      addTo.push(id);
    }
  }
}
