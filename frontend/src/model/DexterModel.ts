import { Any } from '../components/common/Any';
import { ReferenceStyle } from '../components/reference/ReferenceStyle';

export type UUID = string;
/**
 * ID defaults to UUID, but also supports numbers (i.e. tag IDs)
 */
export type ID = UUID | number;
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

export type ResultCorpusWithChildIds = ResultCorpus & {
  tags: number[];
  languages: string[];
  sources: UUID[];
  metadataValues: UUID[];
  media: UUID[];
  subcorpora: UUID[];
};

export function toResultCorpusWithChildren(
  result: ResultCorpus,
): ResultCorpusWithChildIds {
  return {
    ...result,
    tags: [],
    languages: [],
    sources: [],
    metadataValues: [],
    media: [],
    subcorpora: [],
  };
}

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

export function isCorpus(toTest: Any): toTest is Corpus {
  return !!((toTest as Corpus)?.title && (toTest as Corpus)?.contributor);
}

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

export type ResultSourceWithChildIds = ResultSource & {
  references: UUID[];
  corpora: UUID[];
  languages: string[];
  media: UUID[];
  metadataValues: UUID[];
  tags: number[];
};

export function toResultSourceWithChildren(
  result: ResultSource,
): ResultSourceWithChildIds {
  return {
    ...result,
    references: [],
    corpora: [],
    languages: [],
    media: [],
    metadataValues: [],
    tags: [],
  };
}

/**
 * Source including all child resources
 */
export type Source = ResultSource & {
  references: ResultReference[];
  corpora: ResultCorpus[];
  languages: ResultLanguage[];
  media: ResultMedia[];
  metadataValues: MetadataValue[];
  tags: ResultTag[];
};

export function isSource(toTest: Any): toTest is Source {
  return !!(
    (toTest as Source)?.description &&
    (toTest as Source)?.media &&
    (toTest as Source)?.references
  );
}

export type SubmitFormSource = Omit<Source, 'id' | 'metadataValues'> & {
  metadataValues: FormMetadataValue[];
};

export type FormTag = {
  val: string;
};

export type ResultTag = FormTag & WithId<number> & WithCreatedBy;

export function isTag(toTest: Any): toTest is ResultTag {
  return !!(toTest as ResultTag)?.val;
}

export type FormReference = {
  input: string;
  terms: string;
  csl: string;
};

export type ResultReference = Omit<FormReference, 'terms'> & WithId;

export type Reference = ResultReference;

export function isReference(toTest: Any): toTest is Reference {
  return !!(
    (toTest as Reference)?.input && (toTest as Reference).csl !== undefined
  );
}

export type SubmitFormReference = FormReference;

export enum Access {
  CLOSED = 'Closed',
  OPEN = 'Open',
}

export const AccessOptions = ['Open', 'Closed'];

// Metadata
export type WithMetadata = {
  metadataValues: MetadataValue[];
};

export type FormMetadataKey = {
  key: string;
};

export type ResultMetadataKey = FormMetadataKey & WithId & WithCreatedBy;

export type FormMetadataValue = {
  keyId: UUID;
  value: string;
};

type WithCreatedBy = {
  createdBy: UUID;
};

export type ResultMetadataValue = FormMetadataValue & WithId & WithCreatedBy;

export type MetadataValue = Omit<ResultMetadataValue, 'keyId'> & {
  key: ResultMetadataKey;
};

export function isMetadataValue(toTest: Any): toTest is MetadataValue {
  return !!((toTest as MetadataValue)?.value && (toTest as MetadataValue)?.key);
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

export function isMedia(toTest: Any): toTest is ResultMedia {
  return !!((toTest as ResultMedia)?.mediaType && (toTest as ResultMedia)?.url);
}

export type ResultDublinCoreMetadata = Record<string, string>;

export type ResultImport = {
  isValidExternalReference: boolean;
  imported?: ResultDublinCoreMetadata;
};

export type ResultListLanguage = {
  id: string;
  refName: string;
};

export type ResultLanguage = ResultListLanguage;

export type ResultListLanguages = {
  source: string;
  termsOfUse: string;
  languages: ResultListLanguage[];
};

export function isLanguage(toTest: Any): toTest is ResultLanguage {
  return !!(toTest as ResultLanguage)?.refName;
}

export type WithId<T extends ID = UUID> = {
  id: T;
};

export function isWithId(resource: Any): resource is WithId {
  return !!(resource as WithId).id;
}

export type UserSettings = {
  referenceStyle: ReferenceStyle;
};

export type User = {
  name: string;
  settings: UserSettings;
};

export function isUser(toTest: Any): toTest is User {
  return !!((toTest as User).name && (toTest as User).settings);
}

export type ResultUserResources = {
  corpora: ResultCorpusWithChildIds[];
  sources: ResultSourceWithChildIds[];
  metadataValues: ResultMetadataValue[];
  metadataKeys: ResultMetadataKey[];
  media: ResultMedia[];
  references: ResultReference[];
  tags: ResultTag[];
};

export type UserResourceByIdMaps = {
  corpora: Map<ID, ResultCorpusWithChildIds>;
  sources: Map<ID, ResultSourceWithChildIds>;
  metadataValues: Map<ID, ResultMetadataValue>;
  metadataKeys: Map<ID, ResultMetadataKey>;
  media: Map<ID, ResultMedia>;
  references: Map<ID, ResultReference>;
  tags: Map<ID, ResultTag>;
};
