import { useBoundStore } from './store/useBoundStore';
import { findSourceWithChildIds } from './utils/findSourceWithChildIds';
import { linkSourceChildren } from './utils/linkSourceChildren';
import { toValueArray } from './utils/toValueArray';

import { deleteValidated, postValidated, putValidated } from '../utils/API';
import { useUserResourcesStore } from './store/useUserResourcesStore';
import { assign } from '../utils/recipe/assign';
import { addIdsTo } from './utils/recipe/addIdsTo';
import { removeIdFrom } from './utils/recipe/removeIdFrom';
import { updateLinkedResourcesWith } from '../utils/updateRemoteIds';
import { useMetadata } from './useMetadata';
import {
  FormSource,
  ResultSource,
  Source,
  toResultSourceWithChildren,
} from '../model/Source';
import { ResultTag } from '../model/Tag';
import { ResultMetadataValue } from '../model/Metadata';
import { ResultMedia } from '../model/Media';
import { ResultLanguage } from '../model/Language';
import { ResultReference } from '../model/Reference';
import { UUID, WithId } from '../model/Id';

export function useSources() {
  const { updateUserResources } = useUserResourcesStore();
  const store = useBoundStore();
  const { deleteMetadataValue } = useMetadata();

  function getSource(sourceId: UUID): Source {
    return linkSourceChildren(findSourceWithChildIds(sourceId, store), store);
  }

  function getSources(): Source[] {
    return toValueArray(store.userResources.sources).map(c =>
      linkSourceChildren(c, store),
    );
  }

  const createSource = async (newSource: FormSource): Promise<ResultSource> => {
    const created = await postValidated(`/api/sources`, newSource);
    updateUserResources(draft => {
      draft.sources.set(created.id, toResultSourceWithChildren(created));
    });
    return created;
  };

  const updateSource = async (
    id: string,
    form: FormSource,
  ): Promise<Source> => {
    const updated = await putValidated(`/api/sources/${id}`, form);
    updateUserResources(draft => {
      assign(draft.sources.get(id), updated);
    });
    return updated;
  };

  const deleteSource = async (id: string): Promise<void> => {
    await deleteValidated(`/api/sources/${id}`);
    updateUserResources(draft => {
      draft.sources.delete(id);
      for (const corpus of draft.corpora.values()) {
        removeIdFrom(corpus.sources, id);
      }
    });
  };

  const addLanguagesToSource = async (
    sourceId: string,
    languageId: string[],
  ): Promise<ResultLanguage[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.sources.get(sourceId).languages, languageId);
    });
    return postValidated(`/api/sources/${sourceId}/languages`, languageId);
  };

  const deleteLanguageFromSource = async (
    sourceId: string,
    languageId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdFrom(draft.sources.get(sourceId).languages, languageId);
    });
    await deleteValidated(`/api/sources/${sourceId}/languages/${languageId}`);
  };

  const addTagsToSource = async (
    sourceId: string,
    tagId: number[],
  ): Promise<ResultTag[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.sources.get(sourceId).tags, tagId);
    });
    return postValidated(`/api/sources/${sourceId}/tags`, tagId);
  };

  const deleteTagFromSource = async (
    sourceId: string,
    tagId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdFrom(draft.sources.get(sourceId).tags, tagId);
    });
    await deleteValidated(`/api/sources/${sourceId}/tags/${tagId}`);
  };

  const addReferencesToSource = async (
    sourceId: string,
    referenceIds: string[],
  ): Promise<ResultReference[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.sources.get(sourceId).references, referenceIds);
    });
    return postValidated(`/api/sources/${sourceId}/references`, referenceIds);
  };

  const deleteReferenceFromSource = async (
    sourceId: string,
    referenceId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdFrom(draft.sources.get(sourceId).references, referenceId);
    });
    await deleteValidated(`/api/sources/${sourceId}/references/${referenceId}`);
  };

  const deleteMetadataValueFromSource = async (
    sourceId: string,
    metadataValueId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdFrom(draft.sources.get(sourceId).metadataValues, metadataValueId);
    });
    await deleteMetadataValue(metadataValueId);
  };

  const addMetadataValueToSource = async (
    sourceId: string,
    metadataValueIds: string[],
  ): Promise<ResultMetadataValue[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.sources.get(sourceId).metadataValues, metadataValueIds);
    });
    return postValidated(
      `/api/sources/${sourceId}/metadata/values`,
      metadataValueIds,
    );
  };

  const addMediaToSource = async (
    sourceId: string,
    mediaIds: string[],
  ): Promise<ResultMedia[]> => {
    updateUserResources(draft => {
      addIdsTo(draft.sources.get(sourceId).media, mediaIds);
    });
    return postValidated(`/api/sources/${sourceId}/media`, mediaIds);
  };

  const deleteMediaFromSource = async (
    sourceId: string,
    mediaId: string,
  ): Promise<void> => {
    updateUserResources(draft => {
      removeIdFrom(draft.sources.get(sourceId).media, mediaId);
    });
    await deleteValidated(`/api/sources/${sourceId}/media/${mediaId}`);
  };

  const updateSourceMetadataValues = updateLinkedResourcesWith<WithId>(
    addMetadataValueToSource,
    deleteMetadataValueFromSource,
  );

  const updateSourceLanguages = updateLinkedResourcesWith(
    addLanguagesToSource,
    deleteLanguageFromSource,
  );

  const updateSourceTags = updateLinkedResourcesWith(
    addTagsToSource,
    deleteTagFromSource,
  );

  const updateSourceMedia = updateLinkedResourcesWith(
    addMediaToSource,
    deleteMediaFromSource,
  );

  const updateSourceReferences = updateLinkedResourcesWith(
    addReferencesToSource,
    deleteReferenceFromSource,
  );

  return {
    getSource,
    getSources,
    deleteSource,
    updateSource,
    createSource,
    addMediaToSource,
    deleteMediaFromSource,
    addMetadataValueToSource,
    deleteMetadataValueFromSource,
    addReferencesToSource,
    deleteReferenceFromSource,
    addTagsToSource,
    deleteTagFromSource,
    addLanguagesToSource,
    deleteLanguageFromSource,
    updateSourceReferences,
    updateSourceMedia,
    updateSourceTags,
    updateSourceLanguages,
    updateSourceMetadataValues,
  };
}
