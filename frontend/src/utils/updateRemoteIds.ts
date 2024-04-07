import { ID, UUID, WithId } from '../model/DexterModel';
import {
  addLanguagesToSource,
  addMediaToSource,
  addMetadataValueToSource,
  addReferencesToSource,
  addTagsToSource,
  deleteLanguageFromSource,
  deleteMediaFromSource,
  deleteMetadataValueFromSource,
  deleteReferenceFromSource,
  deleteTagFromSource,
} from './API';

type UpdateLinkedResources<T extends WithId<ID>> = (
  parentId: UUID,
  linkedResources: T[],
) => Promise<void>;

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

export const updateSourceMetadataValues = updateLinkedResourcesWith<WithId>(
  addMetadataValueToSource,
  deleteMetadataValueFromSource,
);

export const updateSourceLanguages = updateLinkedResourcesWith(
  addLanguagesToSource,
  deleteLanguageFromSource,
);

export const updateSourceTags = updateLinkedResourcesWith(
  addTagsToSource,
  deleteTagFromSource,
);

export const updateSourceMedia = updateLinkedResourcesWith(
  addMediaToSource,
  deleteMediaFromSource,
);

export const updateSourceReferences = updateLinkedResourcesWith(
  addReferencesToSource,
  deleteReferenceFromSource,
);
