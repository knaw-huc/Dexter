import { UUID } from '../model/DexterModel';
import {
  addKeywordsToCorpus,
  addKeywordsToSource,
  addLanguagesToCorpus,
  addLanguagesToSource,
  addMetadataValueToCorpus,
  addMetadataValueToSource,
  addSourcesToCorpus,
  deleteKeywordFromCorpus,
  deleteKeywordFromSource,
  deleteLanguageFromCorpus,
  deleteLanguageFromSource,
  deleteMetadataValueFromCorpus,
  deleteMetadataValueFromSource,
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

export const updateCorpusKeywords = updateLinkedResourcesWith(
  addKeywordsToCorpus,
  deleteKeywordFromCorpus,
);

export const updateSourceMetadataValues = updateLinkedResourcesWith(
  addMetadataValueToSource,
  deleteMetadataValueFromSource,
);

export const updateSourceLanguages = updateLinkedResourcesWith(
  addLanguagesToSource,
  deleteLanguageFromSource,
);

export const updateSourceKeywords = updateLinkedResourcesWith(
  addKeywordsToSource,
  deleteKeywordFromSource,
);
