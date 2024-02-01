import {
  FormMetadataValue,
  MetadataValue,
  ResultMetadataKey,
  ResultMetadataValue,
  toMetadataValue,
  WithMetadata,
} from '../model/DexterModel';
import { createMetadataValue, updateMetadataValue } from './API';

export async function submitMetadataValues(
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
}

async function updateValues(
  toUpdate: FormMetadataValue[],
  parent: WithMetadata,
): Promise<ResultMetadataValue[]> {
  return await Promise.all(
    toUpdate.map(v => updateMetadataValue(findExistingValue(v, parent).id, v)),
  );
}

async function createValues(
  toCreate: FormMetadataValue[],
): Promise<ResultMetadataValue[]> {
  return await Promise.all(toCreate.map(createMetadataValue));
}

export function findExistingValue(v: FormMetadataValue, parent: WithMetadata) {
  return parent.metadataValues.find(sv => sv.key.id === v.keyId);
}
