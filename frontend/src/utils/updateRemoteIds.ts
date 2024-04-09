import { ID, UUID, WithId } from '../model/DexterModel';

type UpdateLinkedResources<T extends WithId<ID>> = (
  parentId: UUID,
  linkedResources: T[],
) => Promise<void>;

/**
 * Update list of child resources linked to parent using
 * the 'add' (POST) and 'delete' (DELETE) endpoint
 */
export function updateLinkedResourcesWith<T extends WithId<ID>>(
  addIdToParent: (parentId: ID, updateIds: ID[]) => Promise<T[]>,
  deleteIdFromParent: (parentId: ID, updateId: ID) => Promise<void | T[]>,
): UpdateLinkedResources<T> {
  return async function (parentId: UUID, linkedResources: T[]) {
    const idsToUpdate = linkedResources.map(r => r.id);
    const responseResources = await addIdToParent(parentId, idsToUpdate);
    const idsToDelete: ID[] = responseResources
      .map(r => r.id)
      .filter(r => !idsToUpdate.includes(r));
    for (const idToDelete of idsToDelete) {
      await deleteIdFromParent(parentId, idToDelete);
    }
  };
}
