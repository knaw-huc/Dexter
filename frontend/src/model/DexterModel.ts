type UUID = string;
type LocalDate = string;
type LocalDateTime = string;

/**
 * Corpus form as required by server
 */
export type ServerFormCorpus = {
    title: string,
    description: string,
    rights: string,
    access: Access,
    parentId?: UUID,
    location?: string,
    earliest?: LocalDate,
    latest?: LocalDate,
    contributor?: string,
    notes?: string
}

/**
 * Corpus result as sent by server
 */
export type ServerResultCorpus = {
    id: UUID,
    parentId?: UUID,
    title: string,
    description: string,
    rights: string,
    access: Access,
    location: string,
    earliest?: LocalDateTime,
    latest?: LocalDateTime,
    contributor?: string,
    notes?: string,
    createdBy: UUID,
    createdAt: LocalDateTime,
    updatedAt: LocalDateTime
}

/**
 * All server resources combined
 */
export interface ServerCorpus {
  id: string;
  parent?: {
      id: string, title: string
  };
  title: string;
  description: string;
  rights: string;
  access: Access;
  location?: string;
  earliest?: string;
  latest?: string;
  contributor?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  keywords: ServerKeyword[];
  languages: ServerLanguage[];
  sources: ServerSource[];
}

export interface FormCorpus {
  sourceIds: string[]
  languages: any
  keywords: any
  title: string;
  description: string;
  rights: string;
  access: string;
  parentId: string | null;
  location: string | null;
  earliest: string | null;
  latest: string | null;
  contributor: string | null;
  notes: string | null;
}

export interface ServerSource {
  id: string;
  externalRef: string | null;
  title: string;
  description: string;
  creator: string;
  rights: string;
  access: string;
  location: string | null;
  earliest: string | null;
  latest: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  keywords: ServerKeyword[];
  languages: ServerLanguage[];
  partOfCorpus: string[];
}

export interface ServerKeyword {
    id: string;
    val: string;
}

export enum Access {
    CLOSED = "Closed",
    RESTRICTED = "Restricted",
    OPEN = "Open"
}

export interface Source {
    id: string,
    externalRef: string | null,
    title: string,
    description: string,
    rights: string,
    access: Access,
    location: string | null,
    earliest: string | null,
    latest: string | null,
    notes: string | null,
    createdBy: string,
    createdAt: string,
    updatedAt: string
}

export interface FormKeyword {
  val: string;
}

export interface ServerLanguage {
  id: string;
  part2b: string;
  part2t: string;
  part1: string;
  scope: string;
  type: string;
  refName: string;
  comment: string;
}

export interface FormLanguage {
  id: string;
  refName: string;
}
