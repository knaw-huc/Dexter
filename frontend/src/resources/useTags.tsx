import { useUserResourcesStore } from './store/useUserResourcesStore';
import { FormTag, ResultTag } from '../model/DexterModel';
import { deleteValidated, postValidated } from '../utils/API';
import { removeIdsFrom } from './utils/recipe/removeIdsFrom';
import { toValueArray } from './utils/toValueArray';

export function useTags() {
  const { updateUserResources, tags } = useUserResourcesStore();

  const getTags = () => toValueArray(tags);

  const createTag = async (form: FormTag): Promise<ResultTag> => {
    const created = await postValidated(`/api/tags`, form);
    updateUserResources(draft => {
      draft.tags.set(created.id, created);
    });
    return created;
  };

  const deleteTag = async (tagId: number): Promise<void> => {
    await deleteValidated(`/api/tags/${tagId}`);
    updateUserResources(draft => {
      draft.tags.delete(tagId);
      for (const corpus of draft.corpora.values()) {
        removeIdsFrom(corpus.tags, tagId);
      }
      for (const source of draft.sources.values()) {
        removeIdsFrom(source.tags, tagId);
      }
    });
  };

  const getTagsAutocomplete = async (input: string): Promise<ResultTag[]> => {
    return postValidated(`/api/tags/autocomplete`, input);
  };

  return {
    getTags,
    getTagsAutocomplete,
    createTag,
    deleteTag,
  };
}
