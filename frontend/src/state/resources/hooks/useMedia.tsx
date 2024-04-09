import { useUserResourcesStore } from '../useUserResourcesStore';
import { FormMedia, ResultMedia, UUID } from '../../../model/DexterModel';
import { api } from '../../../model/Resources';
import {
  deleteValidated,
  postValidated,
  putValidated,
} from '../../../utils/API';
import { toValueArray } from '../utils/toValueArray';
import { assign } from '../../../utils/recipe/assign';
import { removeIdsFrom } from '../utils/recipe/removeIdsFrom';

export function useMedia() {
  const { updateUserResources, media } = useUserResourcesStore();

  const getMedia = (): ResultMedia[] => {
    return toValueArray(media);
  };

  const getMediaItem = (id: UUID): ResultMedia => {
    return media.get(id);
  };

  const createMedia = async (form: FormMedia): Promise<ResultMedia> => {
    const created = await postValidated(`/${api}/media`, form);
    updateUserResources(draft => {
      draft.media.set(created.id, created);
    });
    return created;
  };

  const updateMedia = async (
    id: UUID,
    form: FormMedia,
  ): Promise<ResultMedia> => {
    const updated = await putValidated(`/${api}/media/${id}`, form);
    updateUserResources(draft => {
      assign(draft.media.get(id), updated);
    });
    return updated;
  };

  const deleteMedia = async (mediaId: UUID) => {
    updateUserResources(draft => {
      draft.media.delete(mediaId);
      for (const [id, source] of draft.sources) {
        removeIdsFrom(source.media, id);
      }
    });
    return deleteValidated(`/${api}/media/${mediaId}`);
  };

  const getMediaAutocomplete = async (
    input: string,
  ): Promise<ResultMedia[]> => {
    return postValidated(`/${api}/media/autocomplete`, input);
  };

  return {
    getMedia,
    createMedia,
    updateMedia,
    deleteMedia,
    getMediaAutocomplete,
    getMediaItem,
  };
}
