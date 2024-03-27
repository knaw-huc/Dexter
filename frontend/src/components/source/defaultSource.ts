import { Source } from '../../model/DexterModel';

export const defaultSource: Source = {
  title: '',
  description: undefined,
  rights: undefined,
  access: undefined,
  location: undefined,
  earliest: undefined,
  latest: undefined,
  notes: undefined,

  references: [],
  corpora: [],
  languages: [],
  media: [],
  metadataValues: [],
  tags: [],

  // Not created or modified by form:
  id: undefined,
  createdBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
};
