import { ReferenceStyle } from '../components/reference/ReferenceStyle';
import { ResultCorpusWithChildIds } from './Corpus';
import { ResultSourceWithChildIds } from './Source';
import { ResultMetadataKey, ResultMetadataValue } from './Metadata';
import { ResultMedia } from './Media';
import { ResultReference } from './Reference';
import { ResultTag } from './Tag';

import { ID } from './Id';

export type UserSettings = {
  referenceStyle: ReferenceStyle;
};

export type User = {
  name: string;
  settings: UserSettings;
};

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
