import { useUserResourcesStore } from './store/useUserResourcesStore';
import { deleteValidated, postValidated, putValidated } from '../utils/API';
import { toValueArray } from './utils/toValueArray';
import { assign } from '../utils/recipe/assign';
import { removeIdFrom } from './utils/recipe/removeIdFrom';
import { FormReference, ResultReference } from '../model/Reference';
import { UUID } from '../model/Id';

export function useReferences() {
  const { updateUserResources, references } = useUserResourcesStore();

  const getReferences = (): ResultReference[] => {
    return toValueArray(references);
  };

  const createReference = async (
    form: FormReference,
  ): Promise<ResultReference> => {
    const created = await postValidated(`/api/references`, form);
    updateUserResources(draft => {
      draft.references.set(created.id, created);
    });
    return created;
  };

  const updateReference = async (
    id: UUID,
    form: FormReference,
  ): Promise<ResultReference> => {
    const updated = await putValidated(`/api/references/${id}`, form);
    updateUserResources(draft => {
      assign(draft.references.get(id), updated);
    });
    return updated;
  };

  const deleteReference = async (id: string): Promise<void> => {
    await deleteValidated(`/api/references/${id}`);
    updateUserResources(draft => {
      draft.references.delete(id);
      for (const source of draft.sources.values()) {
        removeIdFrom(source.references, id);
      }
    });
  };

  const getReferenceAutocomplete = async (
    input: string,
  ): Promise<ResultReference[]> => {
    return postValidated(`/api/references/autocomplete`, input);
  };

  return {
    getReferences,
    getReferenceAutocomplete,
    createReference,
    updateReference,
    deleteReference,
  };
}
