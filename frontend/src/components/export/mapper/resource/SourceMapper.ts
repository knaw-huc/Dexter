import {
  isSource,
  Reference,
  ResultMedia,
  Source,
} from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithChildTables } from '../RowWithChildTables';
import { RowWithChildTablesMapper } from './Mapper';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import {
  appendCell,
  appendCells,
  appendTables,
  createTableFrom,
  prefixTables,
  prefixHeader,
} from '../ExportUtils';
import { ArrayMapper } from './ArrayMapper';
import { PrimitiveMapper } from './PrimitiveMapper';

export class SourceMapper implements RowWithChildTablesMapper<Source> {
  constructor(
    private tagsMapper: TagsMapper,
    private languagesMapper: LanguagesMapper,
    private metadataValuesMapper: MetadataValuesMapper,
    private mediaMapper: ArrayMapper<ResultMedia>,
    private referencesMapper: ArrayMapper<Reference>,
    private primitiveMapper: PrimitiveMapper,
    private keysToSkip: (keyof Source)[] = [],
    private resourceName = 'source',
  ) {}

  canMap(resource: Any): resource is Source {
    return isSource(resource);
  }

  map(source: Source, tableName: string): RowWithChildTables {
    const result = new RowWithChildTables(tableName);
    const prefixColumns = createTableFrom(tableName, source, ['id', 'title']);
    prefixHeader(prefixColumns, this.resourceName);

    let key: keyof Source;
    for (key in source) {
      if (this.keysToSkip.includes(key)) {
        continue;
      }
      const field = source[key];
      switch (key) {
        case 'tags':
          appendCell(result, key, field, this.tagsMapper);
          break;
        case 'languages':
          appendCell(result, key, field, this.languagesMapper);
          break;
        case 'metadataValues':
          appendCells(result, key, field, this.metadataValuesMapper);
          break;
        case 'media':
          appendTables({
            result,
            key,
            field,
            mapper: this.mediaMapper,
            modify: prefixTables(prefixColumns),
          });
          break;
        case 'references':
          appendTables({
            result,
            key,
            field,
            mapper: this.referencesMapper,
            modify: prefixTables(prefixColumns),
          });
          break;
        default:
          appendCell(result, key, field, this.primitiveMapper);
      }
    }
    return result;
  }
}
