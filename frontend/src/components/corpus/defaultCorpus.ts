import { Corpus } from '../../model/Corpus';

export const defaultCorpus: Corpus = {
  parent: undefined,
  title: '',
  description: undefined,
  rights: undefined,
  access: undefined,
  location: undefined,
  earliest: undefined,
  latest: undefined,
  contributor: undefined,
  notes: undefined,
  tags: [],
  languages: [],
  sources: [],
  metadataValues: [],
  subcorpora: [],

  // Not created or modified by form:
  id: undefined,
  createdBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};
