import { useBoundStore } from './store/useBoundStore';
import { deleteValidated, postValidated, putValidated } from '../utils/API';
import { useUserResourcesStore } from './store/useUserResourcesStore';
import { toValueArray } from './utils/toValueArray';
import { assign } from '../utils/recipe/assign';
import {
  FormMetadataKey,
  FormMetadataValue,
  MetadataValue,
  ResultMetadataKey,
  ResultMetadataValue,
  toMetadataValue,
  WithMetadata,
} from '../model/Metadata';
import { UUID } from '../model/Id';
import { UserResourceByIdMaps } from '../model/User';

export function useMetadata() {
  const { updateUserResources } = useUserResourcesStore();
  const store = useBoundStore();

  const getMetadataKeys = (): ResultMetadataKey[] => {
    return toValueArray(store.userResources.metadataKeys);
  };

  const createMetadataKey = async (
    newTag: FormMetadataKey,
  ): Promise<ResultMetadataKey> => {
    const created = await postValidated(`/api/metadata/keys`, newTag);
    updateUserResources(draft => {
      draft.metadataKeys.set(created.id, created);
    });
    return created;
  };

  const updateMetadataKey = async (
    id: UUID,
    form: FormMetadataKey,
  ): Promise<ResultMetadataKey> => {
    const updated = await putValidated(`/api/metadata/keys/${id}`, form);
    updateUserResources(draft => {
      assign(draft.metadataKeys.get(id), updated);
    });
    return updated;
  };

  const deleteMetadataKey = async (id: string): Promise<void> => {
    await deleteValidated(`/api/metadata/keys/${id}`);
    updateUserResources(draft => {
      draft.metadataKeys.delete(id);
    });
  };

  const updateMetadataValue = async (
    id: UUID,
    form: FormMetadataValue,
  ): Promise<ResultMetadataValue> => {
    const updated = await putValidated(`/api/metadata/values/${id}`, form);
    updateUserResources(draft => {
      assign(draft.metadataValues.get(id), updated);
    });
    return updated;
  };

  const createMetadataValue = async (
    form: FormMetadataValue,
  ): Promise<ResultMetadataValue> => {
    const created = await postValidated(`/api/metadata/values`, form);
    updateUserResources(draft => {
      draft.metadataValues.set(created.id, created);
    });
    return created;
  };

  const deleteMetadataValue = async (
    id: string,
    draft: UserResourceByIdMaps,
  ): Promise<void> => {
    await deleteValidated(`/api/metadata/values/${id}`);
    draft.metadataValues.delete(id);
  };

  /**
   * Create and/or update metadata values
   * Upsert: 'Update or insert'
   */
  async function upsertMetadataValues(
    toEdit: WithMetadata | undefined,
    keys: ResultMetadataKey[],
    values: FormMetadataValue[],
  ): Promise<MetadataValue[]> {
    const toCreate = toEdit
      ? values.filter(v => !findExistingValue(v, toEdit))
      : values;
    const toUpdate = toEdit
      ? values.filter(v => findExistingValue(v, toEdit))
      : [];
    const updated = await updateValues(toUpdate, toEdit);
    const created = await createValues(toCreate);
    return [...updated, ...created].map(v => toMetadataValue(v, keys));

    async function updateValues(
      toUpdate: FormMetadataValue[],
      parent: WithMetadata,
    ): Promise<ResultMetadataValue[]> {
      return await Promise.all(
        toUpdate.map(v =>
          updateMetadataValue(findExistingValue(v, parent).id, v),
        ),
      );
    }

    async function createValues(
      toCreate: FormMetadataValue[],
    ): Promise<ResultMetadataValue[]> {
      return await Promise.all(toCreate.map(createMetadataValue));
    }

    function findExistingValue(v: FormMetadataValue, parent: WithMetadata) {
      return parent.metadataValues.find(sv => sv.key.id === v.keyId);
    }
  }

  return {
    getMetadataKeys,
    createMetadataKey,
    updateMetadataKey,
    deleteMetadataKey,
    createMetadataValue,
    updateMetadataValue,
    deleteMetadataValue,
    upsertMetadataValues,
  };
}
