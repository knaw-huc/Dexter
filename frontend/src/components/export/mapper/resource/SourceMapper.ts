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
import { RowWithHeader } from '../RowWithHeader';

export class BaseRowWithChildTablesMapper<RESOURCE> {
  keyToMapper: Partial<Record<keyof RESOURCE, Mapper<Any, AnyMapperResult>>>;
  prefixColumns: RowWithHeader;

  append(result: RowWithChildTables, key: string, mapped: AnyMapperResult) {
    if (isCell(mapped)) {
      result.appendCell(key, mapped);
    } else if (isRow(mapped)) {
      result.appendRow(mapped);
    } else if (isTables(mapped)) {
      prefixTables(mapped, this.prefixColumns);
      result.appendTables(mapped);
    }
  }
}

export class SourceMapper
  extends BaseRowWithChildTablesMapper<Source>
  implements RowWithChildTablesMapper<Source>
{
  private tagsMapper: TagsMapper;

  private languagesMapper: LanguagesMapper;

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
    this.languagesMapper = languagesMapper;
    this.tagsMapper = tagsMapper;
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

      map(mapper, field, key).onSuccess(mapped =>
        this.append(result, key, mapped),
      );
    }
    return result;
  }
}
