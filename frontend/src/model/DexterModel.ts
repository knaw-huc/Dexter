export type UUID = string;
export type LocalDate = string;
export type LocalDateTime = string;

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
 * Corpus including child resources
 */
export type Corpus = Omit<ServerResultCorpus, "parentId"> & {
    parent?: ServerResultCorpus;
    keywords: ServerKeyword[];
    languages: ServerLanguage[];
    sources: Source[];
}

/**
 * Source update
 */
export type CorpusFormSubmit = Omit<Corpus, "id">

/**
 * Source result as send by server
 */
export type ServerResultSource = {
    id: UUID,
    externalRef?: string,
    title: string,
    description: string,
    rights: string,
    access: Access,
    creator: string,
    location?: string,
    earliest?: LocalDate,
    latest?: LocalDate,
    notes?: string,
    createdBy: UUID,
    createdAt: LocalDateTime,
    updatedAt: LocalDateTime
}

/**
 * Source including all child resources
 */
export type Source = ServerResultSource & {
    keywords: ServerKeyword[];
    languages: ServerLanguage[];
}

/**
 * Source update
 */
export type SourceFormSubmit = Omit<Source, "id">

export type ServerFormSource = {
    title: string,
    description: string,
    rights: string,
    access: Access,
    creator: string,
    externalRef?: string,
    location?: string,
    earliest?: LocalDate,
    latest?: LocalDate,
    notes?: string,
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
export const AccessOptions = ["Open", "Restricted", "Closed"]

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

