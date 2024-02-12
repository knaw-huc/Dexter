import { ResultDublinCoreMetadata } from '../utils/API';

export type UUID = string;
export type LocalDate = string;
export type LocalDateTime = string;

/**
 * Corpus form as required by server
 */
export type FormCorpus = {
  title: string;
  description?: string;
  rights?: string;
  access?: Access;
  parentId?: UUID;
  location?: string;
  earliest?: LocalDate;
  latest?: LocalDate;
  contributor?: string;
  notes?: string;
};

/**
 * Corpus result as sent by server
 */
export type ResultCorpus = FormCorpus & {
  id: UUID;
  createdBy: UUID;
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
};

/**
 * Corpus including child resources
 */
export type Corpus = Omit<ResultCorpus, 'parentId'> & {
  parent?: ResultCorpus;
  tags: ResultTag[];
  languages: ResultLanguage[];
  sources: Source[];
  metadataValues: MetadataValue[];
};

/**
 * Source update
 */
export type CorpusFormSubmit = Omit<Corpus, 'id'>;

export type FormSource = {
  title: string;
  description?: string;
  rights?: string;
  access?: Access;
  creator?: string;
  externalRef?: string;
  location?: string;
  earliest?: LocalDate;
  latest?: LocalDate;
  notes?: string;
};

/**
 * Source result as send by server
 */
export type ResultSource = FormSource & {
  id: UUID;
  createdBy: UUID;
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
};

/**
 * Source including all child resources
 */
export type Source = ResultSource & {
  tags: ResultTag[];
  languages: ResultLanguage[];
  metadataValues: MetadataValue[];
};

/**
 * Source update
 */
export type SourceFormSubmit = Omit<Source, 'id'>;

export interface ResultTag {
  id: string;
  val: string;
}

export enum Access {
  CLOSED = 'Closed',
  RESTRICTED = 'Restricted',
  OPEN = 'Open',
}
export const AccessOptions = ['Open', 'Restricted', 'Closed'];

// Metadata
export type WithMetadata = {
  metadataValues: MetadataValue[];
};

export type FormTag = {
  val: string;
};

export type FormMetadataKey = {
  key: string;
};

export type ResultMetadataKey = {
  id: UUID;
  key: string;
};

export type FormMetadataValue = {
  keyId: UUID;
  value: string;
};

export type ResultMetadataValue = {
  id: UUID;
  keyId: UUID;
  value: string;
};

export type MetadataValue = Omit<ResultMetadataValue, 'keyId'> & {
  key: ResultMetadataKey;
};

export function toFormMetadataValue(value: MetadataValue): FormMetadataValue {
  return { value: value.value, keyId: value.key.id };
}

export function toResultMetadataValue(
  value: MetadataValue,
): ResultMetadataValue {
  return { id: value.id, value: value.value, keyId: value.key.id };
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

export type ResultImport = {
  isValidExternalReference: boolean;
  imported?: ResultDublinCoreMetadata;
};

export interface ResultLanguage {
  id: string;
  part2b: string;
  part2t: string;
  part1: string;
  scope: string;
  type: string;
  refName: string;
  comment: string;
}
