import {
  isSource,
  Reference,
  ResultMedia,
  Source,
} from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithChildTables } from '../RowWithChildTables';
import {
  AnyMapperResult,
  isCell,
  isRow,
  isTables,
  Mapper,
  RowWithChildTablesMapper,
} from './Mapper';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import {
  createTableFrom,
  map,
  prefixHeader,
  prefixTables,
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
      let mapper: Mapper<Any, AnyMapperResult>;
      switch (key) {
        case 'tags':
          mapper = this.tagsMapper;
          break;
        case 'languages':
          mapper = this.languagesMapper;
          break;
        case 'metadataValues':
          mapper = this.metadataValuesMapper;
          break;
        case 'media': {
          mapper = this.mediaMapper;
          break;
        }
        case 'references':
          mapper = this.referencesMapper;
          break;
        default:
          mapper = this.primitiveMapper;
      }

      map(mapper, field, key).success(mapped => {
        if (isCell(mapped)) {
          result.appendCell(key, mapped);
        } else if (isRow(mapped)) {
          result.appendRow(mapped);
        } else if (isTables(mapped)) {
          prefixTables(mapped, prefixColumns);
          result.appendTables(mapped);
        }
      });
    }
    return result;
  }
}
