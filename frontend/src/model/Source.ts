import { ResultCorpus } from './Corpus';
import { Any } from '../components/common/Any';
import { ResultTag } from './Tag';
import { FormMetadataValue, MetadataValue } from './Metadata';
import { ResultMedia } from './Media';
import { ResultLanguage } from './Language';
import { ResultReference } from './Reference';
import { UUID, WithId } from './Id';
import { Access } from './Access';
import { LocalDate, LocalDateTime } from './Date';
import _ from 'lodash';

export type FormSource = {
  title: string;
  description?: string;
  rights?: string;
  access?: Access;
  creator?: string;
  externalRef?: string;
  externalId?: string;
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
  if (!toTest) {
    return false;
  }
  return (
    !_.isUndefined((toTest as Source)?.description) &&
    !_.isUndefined((toTest as Source)?.media) &&
    !_.isUndefined((toTest as Source)?.references)
  );
}

export type SubmitFormSource = Omit<Source, 'id' | 'metadataValues'> & {
  metadataValues: FormMetadataValue[];
};
