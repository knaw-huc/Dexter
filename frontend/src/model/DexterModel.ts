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
  ethics?: string;
};

/**
 * Corpus result as sent by server
 */
export type ResultCorpus = FormCorpus &
  WithId & {
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
  subcorpora: Corpus[];
};

export type SubmitFormCorpus = Omit<Corpus, 'id'>;

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
  ethics?: string;
};

/**
 * Source result as send by server
 */
export type ResultSource = FormSource &
  WithId & {
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
  media: ResultMedia[];
  corpora: ResultCorpus[];
};

export type SubmitFormSource = Omit<Source, 'id' | 'metadataValues'> & {
  metadataValues: FormMetadataValue[];
};

export type FormTag = {
  val: string;
};

export type ResultTag = FormTag & WithId;

export type FormCitation = {
  input: string;
  terms: string;
};

export type ResultCitation = FormCitation & WithId;

export type Citation = ResultCitation & {
  isLoading: boolean;
  formatted: string;
};

export type SubmitFormCitation = Omit<Citation, 'id'>;

export function isFormatted(
  citation?: ResultCitation | Citation,
): citation is Citation {
  return !!(citation as Citation)?.formatted;
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

export type FormMetadataKey = {
  key: string;
};

export type ResultMetadataKey = FormMetadataKey & WithId;

export type FormMetadataValue = {
  keyId: UUID;
  value: string;
};

export type ResultMetadataValue = FormMetadataValue & WithId;

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

export type SupportedMediaType = 'image/jpeg' | 'image/png';
export const supportedMediaTypes = ['image/jpeg', 'image/png'];

export function isImage(mediaType: string): boolean {
  return mediaType.split('/')[0] === 'image';
}

export type SupportedMediaTypeType = 'image';

export const image = 'image';

export type FormMedia = {
  title: string;
  url: string;
};

export type ResultMedia = FormMedia &
  WithId & {
    mediaType: SupportedMediaType;
    createdBy: UUID;
  };

export type ResultDublinCoreMetadata = Record<string, string>;

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

export type WithId = {
  id: string;
};
