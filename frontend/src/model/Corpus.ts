import { Any } from '../components/common/Any';
import { Source } from './Source';
import { ResultTag } from './Tag';
import { MetadataValue } from './Metadata';
import { ResultLanguage } from './Language';
import { UUID, WithId } from './Id';
import { Access } from './Access';
import { LocalDate, LocalDateTime } from './Date';

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
