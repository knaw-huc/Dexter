import { UUID } from '../model/DexterModel';
import {
  addTagsToCorpus,
  addTagsToSource,
  addLanguagesToCorpus,
  addLanguagesToSource,
  addMetadataValueToCorpus,
  addMetadataValueToSource,
  addSourcesToCorpus,
  deleteTagFromCorpus,
  deleteTagFromSource,
  deleteLanguageFromCorpus,
  deleteLanguageFromSource,
  deleteMetadataValueFromCorpus,
  deleteMetadataValueFromSource,
  deleteSourceFromCorpus,
  addMediaToSource,
  addMediaToCorpus,
} from './API';

type WithId = {
  id: string;
};

type UpdateLinkedResources<T extends WithId> = (
  parentId: UUID,
  linkedResources: T[],
) => Promise<void>;

export function updateLinkedResourcesWith<T extends WithId>(
  addIdToParent: (parentId: string, updateIds: string[]) => Promise<T[]>,
  deleteIdFromParent: (
    parentId: string,
    updateId: string,
  ) => Promise<void | T[]>,
): UpdateLinkedResources<T> {
  return async function (parentId: UUID, linkedResources: T[]) {
    const idsToUpdate = linkedResources.map(r => r.id);
    const responseTags = await addIdToParent(parentId, idsToUpdate);
    const keysToDelete: string[] = responseTags
      .map(r => r.id)
      .filter(r => !idsToUpdate.includes(r));
    for (const keyToDelete of keysToDelete) {
      await deleteIdFromParent(parentId, keyToDelete);
    }
  };
}

export const updateCorpusMetadataValues = updateLinkedResourcesWith(
  addMetadataValueToCorpus,
  deleteMetadataValueFromCorpus,
);

export const updateSources = updateLinkedResourcesWith(
  addSourcesToCorpus,
  deleteSourceFromCorpus,
);

export const updateCorpusLanguages = updateLinkedResourcesWith(
  addLanguagesToCorpus,
  deleteLanguageFromCorpus,
);

export const updateCorpusTags = updateLinkedResourcesWith(
  addTagsToCorpus,
  deleteTagFromCorpus,
);

export const updateCorpusMedia = updateLinkedResourcesWith(
  addMediaToCorpus,
  deleteMetadataValueFromCorpus,
);
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
  deleteMetadataValueFromSource,
);
