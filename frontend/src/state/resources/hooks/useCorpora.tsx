import {
  Corpus,
  FormCorpus,
  ResultCorpus,
  ResultCorpusWithChildIds,
  ResultLanguage,
  ResultMetadataValue,
  ResultTag,
  Source,
  toResultCorpusWithChildren,
  UserResourceIdsMaps,
  UUID,
  WithId,
} from '../../../model/DexterModel';
import {
  api,
  corpora,
  metadata,
  sources,
  tags,
  values,
} from '../../../model/Resources';
import {
  deleteMetadataValue,
  deleteValidated,
  postValidated,
  putValidated,
} from '../../../utils/API';
import { updateLinkedResourcesWith } from '../../../utils/updateRemoteIds';
import { useUserResourcesStore } from '../useUserResourcesStore';
import _ from 'lodash';
import { assign } from '../../../utils/recipe/assign';
import { useBoundStore } from '../useBoundStore';
import { findCorpusWithChildIds } from '../utils/findCorpusWithChildIds';
import { linkCorpusChildren } from '../utils/linkCorpusChildren';
import { findSourceOptions } from '../utils/findSourceOptions';
import { findCorpusOptions } from '../utils/findCorpusOptions';
import { toValueArray } from '../utils/toValueArray';
import { removeIdsFrom } from '../utils/recipe/removeIdsFrom';
import { addIdsTo } from '../utils/recipe/addIdsTo';

export function useCorpora() {
  const { updateUserResources } = useUserResourcesStore();
  const store = useBoundStore();

  function getCorpusFrom(
    draft: UserResourceIdsMaps,
    corpusId: string,
  ): ResultCorpusWithChildIds {
    return draft.corpora.get(corpusId);
  }

  const addSourcesToCorpus = async (
    corpusId: string,
    sourceIds: string[],
  ): Promise<Source[]> => {
    updateUserResources(draft => {
      const corpus = getCorpusFrom(draft, corpusId);
      corpus.sources = _.union(corpus.sources, sourceIds);
    });
    return postValidated(
      `/${api}/${corpora}/${corpusId}/${sources}`,
      sourceIds,
    );
  };

  const deleteSourceFromCorpus = async (
    corpusId: string,
    sourceId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdsFrom(getCorpusFrom(draft, corpusId).sources, sourceId);
    });
    return deleteValidated(
      `/${api}/${corpora}/${corpusId}/${sources}/${sourceId}`,
    );
  };

  const addLanguagesToCorpus = async (
    corpusId: string,
    languageIds: string[],
  ): Promise<ResultLanguage[]> => {
    updateUserResources(draft => {
      addIdsTo(getCorpusFrom(draft, corpusId).languages, languageIds);
    });
    return postValidated(
      `/${api}/${corpora}/${corpusId}/languages`,
      languageIds,
    );
  };

  const deleteLanguageFromCorpus = async (
    corpusId: string,
    languageId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdsFrom(getCorpusFrom(draft, corpusId).languages, languageId);
    });
    return deleteValidated(
      `/${api}/${corpora}/${corpusId}/languages/${languageId}`,
    );
  };

  const addMetadataValuesToCorpus = async (
    corpusId: string,
    metadataValueIds: string[],
  ): Promise<ResultMetadataValue[]> => {
    updateUserResources(draft => {
      addIdsTo(getCorpusFrom(draft, corpusId).metadataValues, metadataValueIds);
    });
    return postValidated(
      `/${api}/${corpora}/${corpusId}/${metadata}/${values}`,
      metadataValueIds,
    );
  };

  const deleteMetadataValueFromCorpus = async (
    corpusId: string,
    metadataValueId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdsFrom(
        getCorpusFrom(draft, corpusId).metadataValues,
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
      addIdsTo(getCorpusFrom(draft, corpusId).tags, tagIds);
    });
    return postValidated(`/${api}/${corpora}/${corpusId}/${tags}`, tagIds);
  };

  const deleteTagFromCorpus = async (
    corpusId: string,
    tagId: number,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdsFrom(getCorpusFrom(draft, corpusId).tags, tagId);
    });
    return deleteValidated(`/${api}/${corpora}/${corpusId}/${tags}/${tagId}`);
  };

  return {
    getCorpus(corpusId: UUID): Corpus {
      return linkCorpusChildren(findCorpusWithChildIds(corpusId, store), store);
    },

    getCorpora(): Corpus[] {
      return toValueArray(store.userResources.corpora).map(c =>
        linkCorpusChildren(c, store),
      );
    },

    createCorpus: async (newCorpus: FormCorpus): Promise<ResultCorpus> => {
      const created = await postValidated(`/${api}/${corpora}`, newCorpus);
      updateUserResources(draft => {
        draft.corpora.set(created.id, toResultCorpusWithChildren(created));
      });
      return created;
    },

    updateCorpus: async (
      id: string,
      form: FormCorpus,
    ): Promise<ResultCorpus> => {
      const updated = await putValidated(`/${api}/${corpora}/${id}`, form);
      updateUserResources(draft => {
        assign(getCorpusFrom(draft, id), updated);
      });
      return updated;
    },

    deleteCorpus: async (id: string): Promise<void> => {
      updateUserResources(draft => {
        draft.corpora.delete(id);
      });
      return deleteValidated(`/${api}/${corpora}/${id}`);
    },

    updateCorpusMetadataValues: updateLinkedResourcesWith(
      addMetadataValuesToCorpus,
      deleteMetadataValueFromCorpus,
    ),

    updateSources: updateLinkedResourcesWith(
      addSourcesToCorpus,
      deleteSourceFromCorpus,
    ),

    updateCorpusLanguages: updateLinkedResourcesWith(
      addLanguagesToCorpus,
      deleteLanguageFromCorpus,
    ),

    updateCorpusTags: updateLinkedResourcesWith<WithId<number>>(
      addTagsToCorpus,
      deleteTagFromCorpus,
    ),

    deleteSourceFromCorpus,
    addSourcesToCorpus,
    findSourceOptions: (corpusId: UUID) => findSourceOptions(corpusId, store),
    findCorpusOptions: (corpusId: UUID) => findCorpusOptions(corpusId, store),
  };
}
