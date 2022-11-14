export interface ServerCorpus {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  rights: string;
  access: string;
  location: string | null;
  earliest: string | null;
  latest: string | null;
  contributor: string | null;
  notes: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  keywords: ServerKeyword[];
  languages: ServerLanguage[];
  sourceIds: string[];
}

export interface FormCorpus {
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
