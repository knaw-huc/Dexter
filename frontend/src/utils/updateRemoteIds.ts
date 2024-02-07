import { UUID } from '../model/DexterModel';
import {
  addKeywordsToCorpus,
  addLanguagesToCorpus,
  addMetadataValueToCorpus,
  addSourcesToCorpus,
  deleteKeywordFromCorpus,
  deleteLanguageFromCorpus,
  deleteMetadataValueFromCorpus,
  deleteSourceFromCorpus,
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
    const responseKeywords = await addIdToParent(parentId, idsToUpdate);
    const keysToDelete: string[] = responseKeywords
      .map(r => r.id)
      .filter(r => !idsToUpdate.includes(r));
    for (const keyToDelete of keysToDelete) {
      await deleteIdFromParent(parentId, keyToDelete);
    }
  };
}

export const updateMetadataValues = updateLinkedResourcesWith(
  addMetadataValueToCorpus,
  deleteMetadataValueFromCorpus,
);

export const updateSources = updateLinkedResourcesWith(
  addSourcesToCorpus,
  deleteSourceFromCorpus,
);

export const updateLanguages = updateLinkedResourcesWith(
  addLanguagesToCorpus,
  deleteLanguageFromCorpus,
);

export const updateKeywords = updateLinkedResourcesWith(
  addKeywordsToCorpus,
  deleteKeywordFromCorpus,
);
