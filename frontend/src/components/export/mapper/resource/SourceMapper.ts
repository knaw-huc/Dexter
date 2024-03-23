import {
  isSource,
  Reference,
  ResultMedia,
  Source,
} from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithChildTables } from '../RowWithChildTables';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { createTableFrom, prefixHeader } from '../ExportUtils';
import { ArrayMapper } from './ArrayMapper';
import { PrimitiveMapper } from './PrimitiveMapper';
import { RowWithChildTablesBaseMapper } from './RowWithChildTablesBaseMapper';
import { RowWithChildTablesMapper } from './Mapper';

export class SourceMapper
  extends RowWithChildTablesBaseMapper<Source>
  implements RowWithChildTablesMapper<Source>
{
  constructor(
    tagsMapper: TagsMapper,
    languagesMapper: LanguagesMapper,
    metadataValuesMapper: MetadataValuesMapper,
    mediaMapper: ArrayMapper<ResultMedia>,
    referencesMapper: ArrayMapper<Reference>,
    private primitiveMapper: PrimitiveMapper,
    private keysToSkip: (keyof Source)[] = [],
    private resourceName = 'source',
  ) {
    super();
    this.keyToMapper = {
      tags: tagsMapper,
      languages: languagesMapper,
      metadataValues: metadataValuesMapper,
      media: mediaMapper,
      references: referencesMapper,
    };
  }

  canMap(resource: Any): resource is Source {
    return isSource(resource);
  }

  map(source: Source, tableName: string): RowWithChildTables {
    const result = new RowWithChildTables(tableName);
    this.prefixColumns = createTableFrom(tableName, source, ['id', 'title']);
    prefixHeader(this.prefixColumns, this.resourceName);

    let key: keyof Source;
    for (key in source) {
      if (this.keysToSkip.includes(key)) {
        continue;
      }
      const field = source[key];
      const mapper = this.keyToMapper[key] || this.primitiveMapper;

      if (mapper.canMap(field)) {
        const fieldName = String(key);
        const mapped = mapper.map(field, fieldName);
        this.append(result, key, mapped);
      }
    }
    return result;
  }
}
