import {
  isSource,
  Reference,
  ResultMedia,
  Source,
} from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { ArrayMapper } from './ArrayMapper';
import { PrimitiveMapper } from './PrimitiveMapper';
import { BaseRowWithTablesMapper } from './BaseRowWithTablesMapper';
import { RowWithTablesMapper } from '../Mapper';

export class SourceMapper
  extends BaseRowWithTablesMapper<Source>
  implements RowWithTablesMapper<Source>
{
  constructor(
    tagsMapper: TagsMapper,
    languagesMapper: LanguagesMapper,
    metadataValuesMapper: MetadataValuesMapper,
    mediaMapper: ArrayMapper<ResultMedia>,
    referencesMapper: ArrayMapper<Reference>,
    primitiveMapper: PrimitiveMapper,
    keysToSkip: (keyof Source)[] = [],
    keysToPrefix: (keyof Source)[] = [],
    resourceName = 'source',
  ) {
    super(
      {
        tags: tagsMapper,
        languages: languagesMapper,
        metadataValues: metadataValuesMapper,
        media: mediaMapper,
        references: referencesMapper,
      },
      primitiveMapper,
      keysToSkip,
      keysToPrefix,
      resourceName,
    );
  }

  canMap(resource: Any): resource is Source {
    return isSource(resource);
  }
}
