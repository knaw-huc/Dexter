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
import { removeIdFrom } from './utils/recipe/removeIdFrom';
import { addIdsTo } from './utils/recipe/addIdsTo';
import { useMetadata } from './useMetadata';
import {
  Corpus,
  FormCorpus,
  ResultCorpus,
  toResultCorpusWithChildren,
} from '../model/Corpus';
import { Source } from '../model/Source';
import { ResultTag } from '../model/Tag';
import { ResultMetadataValue } from '../model/Metadata';
import { ResultLanguage } from '../model/Language';
import { UUID, WithId } from '../model/Id';
import { UserResourceByIdMaps } from '../model/User';

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
    const created: ResultCorpus = await postValidated(
      `/api/corpora`,
      newCorpus,
    );
    updateUserResources(draft => {
      draft.corpora.set(created.id, toResultCorpusWithChildren(created));
      if (created.parentId) {
        addIdsTo(draft.corpora.get(created.parentId).subcorpora, [created.id]);
      }
    });
    return created;
  };

  const updateCorpus = async (
    id: string,
    form: FormCorpus,
  ): Promise<ResultCorpus> => {
    const updated: ResultCorpus = await putValidated(
      `/api/corpora/${id}`,
      form,
    );
    updateUserResources(draft => {
      const prev = draft.corpora.get(id);
      assign(prev, updated);
      updateParentSubcorpora(draft, id, prev.parentId, updated.parentId);
    });
    return updated;
  };

  function updateParentSubcorpora(
    draft: UserResourceByIdMaps,
    subcorpusId: UUID,
    prevParentId: UUID,
    nextParentId: UUID,
  ) {
    if (prevParentId === nextParentId) {
      return;
    }
    if (nextParentId) {
      addIdsTo(draft.corpora.get(nextParentId).subcorpora, [subcorpusId]);
    }
    if (prevParentId) {
      removeIdFrom(draft.corpora.get(prevParentId).subcorpora, prevParentId);
    }
  }

  const deleteCorpus = async (id: string): Promise<void> => {
    await deleteValidated(`/api/corpora/${id}`);
    updateUserResources(draft => {
      draft.corpora.delete(id);
      for (const corpus of draft.corpora.values()) {
        removeIdFrom(corpus.subcorpora, id);
        if (corpus.parentId === id) {
          corpus.parentId = null;
        }
      }
      for (const source of draft.sources.values()) {
        removeIdFrom(source.corpora, id);
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
      removeIdFrom(draft.corpora.get(corpusId).sources, sourceId);
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
      removeIdFrom(draft.corpora.get(corpusId).languages, languageId);
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
      removeIdFrom(draft.corpora.get(corpusId).metadataValues, metadataValueId);
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
      removeIdFrom(draft.corpora.get(corpusId).tags, tagId);
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
