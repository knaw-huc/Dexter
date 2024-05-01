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
import { createDraft, current } from 'immer';
import { Any } from '../components/common/Any';

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
      updateParentSubcorpora(draft, id, prev.parentId, updated.parentId);
      assign(prev, updated);
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
      removeIdFrom(draft.corpora.get(prevParentId).subcorpora, subcorpusId);
    }
  }

  const deleteCorpus = async (id: string): Promise<void> => {
    const batch = createDraft(store.userResources);
    for (const valueId of batch.corpora.get(id).metadataValues) {
      await deleteMetadataValue(valueId, batch);
    }
    await deleteValidated(`/api/corpora/${id}`);
    batch.corpora.delete(id);
    for (const corpus of batch.corpora.values()) {
      removeIdFrom(corpus.subcorpora, id);
      if (corpus.parentId === id) {
        corpus.parentId = null;
      }
    }
    for (const source of batch.sources.values()) {
      removeIdFrom(source.corpora, id);
    }
    updateUserResources(draft => assign(draft, batch));
  };

  const addSourcesToCorpus = async (
    id: string,
    sourceIds: string[],
  ): Promise<Source[]> => {
    const updated = await postValidated(
      `/api/corpora/${id}/sources`,
      sourceIds,
    );
    updateUserResources(draft => {
      addIdsTo(draft.corpora.get(id).sources, sourceIds);
    });
    return updated;
  };

  const deleteSourceFromCorpus = async (
    corpusId: string,
    sourceId: string,
  ): Promise<void> => {
    await deleteValidated(`/api/corpora/${corpusId}/sources/${sourceId}`);
    updateUserResources(draft => {
      removeIdFrom(draft.corpora.get(corpusId).sources, sourceId);
    });
  };

  const addLanguagesToCorpus = async (
    corpusId: string,
    languageIds: string[],
  ): Promise<ResultLanguage[]> => {
    const updated = await postValidated(
      `/api/corpora/${corpusId}/languages`,
      languageIds,
    );
    updateUserResources(draft => {
      addIdsTo(draft.corpora.get(corpusId).languages, languageIds);
    });
    return updated;
  };

  const deleteLanguageFromCorpus = async (
    corpusId: string,
    languageId: string,
  ): Promise<void> => {
    await deleteValidated(`/api/corpora/${corpusId}/languages/${languageId}`);
    updateUserResources(draft => {
      removeIdFrom(draft.corpora.get(corpusId).languages, languageId);
    });
  };

  const addMetadataValuesToCorpus = async (
    corpusId: string,
    metadataValueIds: string[],
  ): Promise<ResultMetadataValue[]> => {
    const updated = await postValidated(
      `/api/corpora/${corpusId}/metadata/values`,
      metadataValueIds,
    );
    updateUserResources(draft => {
      addIdsTo(draft.corpora.get(corpusId).metadataValues, metadataValueIds);
    });
    return updated;
  };

  const deleteMetadataValueFromCorpus = async (
    corpusId: string,
    metadataValueId: string,
  ): Promise<void> => {
    const batch = createDraft(store.userResources);
    await deleteMetadataValue(metadataValueId, batch);
    removeIdFrom(batch.corpora.get(corpusId).metadataValues, metadataValueId);
    updateUserResources(draft => assign(draft, batch));
  };

  const addTagsToCorpus = async (
    corpusId: string,
    tagIds: number[],
  ): Promise<ResultTag[]> => {
    const updated = await postValidated(
      `/api/corpora/${corpusId}/tags`,
      tagIds,
    );
    updateUserResources(draft => {
      addIdsTo(draft.corpora.get(corpusId).tags, tagIds);
    });
    return updated;
  };

  const deleteTagFromCorpus = async (
    corpusId: string,
    tagId: number,
  ): Promise<void> => {
    await deleteValidated(`/api/corpora/${corpusId}/tags/${tagId}`);
    updateUserResources(draft => {
      removeIdFrom(draft.corpora.get(corpusId).tags, tagId);
    });
  };

  const updateCorpusMetadataValues = updateLinkedResourcesWith(
    addMetadataValuesToCorpus,
    deleteMetadataValueFromCorpus,
  );

  const updateCorpusSources = updateLinkedResourcesWith(
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
    deleteCorpus,
    updateCorpus,
    updateCorpusSources,
    updateCorpusTags,
    updateCorpusLanguages,
    updateCorpusMetadataValues,
    deleteSourceFromCorpus,
    addSourcesToCorpus,
    findSourceOptions: (corpusId: UUID) => findSourceOptions(corpusId, store),
    findCorpusOptions: (corpusId: UUID) => findCorpusOptions(corpusId, store),
  };
}

(window as Any).current = current;
