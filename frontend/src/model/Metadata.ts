import { Any } from '../components/common/Any';
import { UUID, WithId } from './Id';
import { WithCreatedBy } from './CreatedBy';
import _ from 'lodash';

export type FormMetadataKey = {
  key: string;
};
export type ResultMetadataKey = FormMetadataKey & WithId & WithCreatedBy;
export type FormMetadataValue = {
  keyId: UUID;
  value: string;
};
export type ResultMetadataValue = FormMetadataValue & WithId & WithCreatedBy;
export type MetadataValue = Omit<ResultMetadataValue, 'keyId'> & {
  key: ResultMetadataKey;
};

export function isMetadataValue(toTest: Any): toTest is MetadataValue {
  if (!toTest) {
    return false;
  }

  return (
    !_.isUndefined((toTest as MetadataValue).value) &&
    !_.isUndefined((toTest as MetadataValue).key)
  );
}

export function toFormMetadataValue(value: MetadataValue): FormMetadataValue {
  return { value: value.value, keyId: value.key.id };
}

export function toResultMetadataValue(
  value: MetadataValue,
): ResultMetadataValue {
  return {
    id: value.id,
    createdBy: value.createdBy,
    value: value.value,
    keyId: value.key.id,
  };
}

export function toMetadataValue(
  value: ResultMetadataValue,
  keys: ResultMetadataKey[],
): MetadataValue {
  const { keyId, ...result } = value;
  return {
    ...result,
    key: keys.find(k => k.id === keyId),
  };
}

export type WithMetadata = {
  metadataValues: MetadataValue[];
};
