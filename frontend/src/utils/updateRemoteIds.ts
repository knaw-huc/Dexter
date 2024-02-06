import { UUID } from '../model/DexterModel';

type WithId = {
  id: string;
};

export function updateLinkedResourcesWith<T extends WithId>(
  addIdToParent: (parentId: string, updateIds: string[]) => Promise<T[]>,
  deleteIdFromParent: (
    parentId: string,
    updateId: string,
  ) => Promise<void | T[]>,
) {
  return async function (parentId: UUID, linkedResources: T[]) {
    const idsToUpdate = linkedResources.map(r => r.id);
    const responseKeywords = await addIdToParent(parentId, idsToUpdate);
    const keysToDelete: string[] = responseKeywords
      .map(r => r.id)
      .filter(r => !idsToUpdate.includes(r));
    for (const keyToDelete of keysToDelete) {
      await deleteIdFromParent(parentId, keyToDelete);
    }
  };
}
