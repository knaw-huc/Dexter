import {
  Corpus,
  FormCorpus,
  ResultCorpus,
  ResultLanguage,
  ResultMetadataValue,
  ResultTag,
  Source,
  toResultCorpusWithChildren,
  UUID,
  WithId,
} from '../model/DexterModel';

import { deleteValidated, postValidated, putValidated } from '../utils/API';
import { updateLinkedResourcesWith } from '../utils/updateRemoteIds';
import { useUserResourcesStore } from './store/useUserResourcesStore';
import { assign } from '../utils/recipe/assign';
import { useBoundStore } from './store/useBoundStore';
import { findCorpusWithChildIds } from './utils/findCorpusWithChildIds';
import { linkCorpusChildren } from './utils/linkCorpusChildren';
import { findSourceOptions } from './utils/findSourceOptions';
import { findCorpusOptions } from './utils/findCorpusOptions';
import { toValueArray } from './utils/toValueArray';
import { removeIdsFrom } from './utils/recipe/removeIdsFrom';
import { addIdsTo } from './utils/recipe/addIdsTo';
import { useMetadata } from './useMetadata';

export function useCorpora() {
  const { updateUserResources } = useUserResourcesStore();
  const store = useBoundStore();
  const { deleteMetadataValue } = useMetadata();

  function getCorpus(corpusId: UUID): Corpus {
    return linkCorpusChildren(findCorpusWithChildIds(corpusId, store), store);
  }

  function getCorpora(): Corpus[] {
    return toValueArray(store.userResources.corpora).map(c =>
      linkCorpusChildren(c, store),
    );
  }

  const createCorpus = async (newCorpus: FormCorpus): Promise<ResultCorpus> => {
    const created = await postValidated(`/api/corpora`, newCorpus);
    updateUserResources(draft => {
      draft.corpora.set(created.id, toResultCorpusWithChildren(created));
    });
    return created;
  };

  const updateCorpus = async (
    id: string,
    form: FormCorpus,
  ): Promise<ResultCorpus> => {
    const updated = await putValidated(`/api/corpora/${id}`, form);
    updateUserResources(draft => {
      assign(draft.corpora.get(id), updated);
    });
    return updated;
  };

  const deleteCorpus = async (id: string): Promise<void> => {
    await deleteValidated(`/api/corpora/${id}`);
    updateUserResources(draft => {
      draft.corpora.delete(id);
      for (const corpus of draft.corpora.values()) {
        removeIdsFrom(corpus.subcorpora, id);
        if (corpus.parentId === id) {
          corpus.parentId = null;
        }
      }
      for (const source of draft.sources.values()) {
        removeIdsFrom(source.corpora, id);
      }
    });
  };

  const addSourcesToCorpus = async (
    id: string,
    sourceIds: string[],
  ): Promise<Source[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.corpora.get(id).sources, sourceIds);
    });
    return postValidated(`/api/corpora/${id}/sources`, sourceIds);
  };

  const deleteSourceFromCorpus = async (
    corpusId: string,
    sourceId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdsFrom(draft.corpora.get(corpusId).sources, sourceId);
    });
    return deleteValidated(`/api/corpora/${corpusId}/sources/${sourceId}`);
  };

  const addLanguagesToCorpus = async (
    corpusId: string,
    languageIds: string[],
  ): Promise<ResultLanguage[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.corpora.get(corpusId).languages, languageIds);
    });
    return postValidated(`/api/corpora/${corpusId}/languages`, languageIds);
  };

  const deleteLanguageFromCorpus = async (
    corpusId: string,
    languageId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdsFrom(draft.corpora.get(corpusId).languages, languageId);
    });
    return deleteValidated(`/api/corpora/${corpusId}/languages/${languageId}`);
  };

  const addMetadataValuesToCorpus = async (
    corpusId: string,
    metadataValueIds: string[],
  ): Promise<ResultMetadataValue[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.corpora.get(corpusId).metadataValues, metadataValueIds);
    });
    return postValidated(
      `/api/corpora/${corpusId}/metadata/values`,
      metadataValueIds,
    );
  };

  const deleteMetadataValueFromCorpus = async (
    corpusId: string,
    metadataValueId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdsFrom(
        draft.corpora.get(corpusId).metadataValues,
        metadataValueId,
      );
    });
    return deleteMetadataValue(metadataValueId);
  };

  const addTagsToCorpus = async (
    corpusId: string,
    tagIds: number[],
  ): Promise<ResultTag[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.corpora.get(corpusId).tags, tagIds);
    });
    return postValidated(`/api/corpora/${corpusId}/tags`, tagIds);
  };

  const deleteTagFromCorpus = async (
    corpusId: string,
    tagId: number,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdsFrom(draft.corpora.get(corpusId).tags, tagId);
    });
    return deleteValidated(`/api/corpora/${corpusId}/tags/${tagId}`);
  };

  const updateCorpusMetadataValues = updateLinkedResourcesWith(
    addMetadataValuesToCorpus,
    deleteMetadataValueFromCorpus,
  );

  const updateSources = updateLinkedResourcesWith(
    addSourcesToCorpus,
    deleteSourceFromCorpus,
  );

  const updateCorpusLanguages = updateLinkedResourcesWith(
    addLanguagesToCorpus,
    deleteLanguageFromCorpus,
  );

  const updateCorpusTags = updateLinkedResourcesWith<WithId<number>>(
    addTagsToCorpus,
    deleteTagFromCorpus,
  );

  return {
    getCorpus,
    getCorpora,
    createCorpus,
    updateSources,
    deleteCorpus,
    updateCorpus,
    updateCorpusTags,
    updateCorpusLanguages,
    updateCorpusMetadataValues,
    deleteSourceFromCorpus,
    addSourcesToCorpus,
    findSourceOptions: (corpusId: UUID) => findSourceOptions(corpusId, store),
    findCorpusOptions: (corpusId: UUID) => findCorpusOptions(corpusId, store),
  };
}
