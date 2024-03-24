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
import { FieldsMapper } from './FieldsMapper';
import { isTables, RowWithTablesMapper } from '../Mapper';
import { RowWithTables } from '../RowWithTables';
import { createPrefixRow, prefixTable } from '../ExportUtils';
import _ from 'lodash';

export class SourceMapper implements RowWithTablesMapper<Source> {
  private fieldsMapper: FieldsMapper<Source>;

  constructor(
    tagsMapper: TagsMapper,
    languagesMapper: LanguagesMapper,
    metadataValuesMapper: MetadataValuesMapper,
    mediaMapper: ArrayMapper<ResultMedia>,
    referencesMapper: ArrayMapper<Reference>,
    primitiveMapper: PrimitiveMapper,
    keysToSkip: (keyof Source)[] = [],
    private prefixColumns: (keyof Source)[] = [],
    resourceName = 'source',
  ) {
    this.fieldsMapper = new FieldsMapper<Source>(
      {
        tags: tagsMapper,
        languages: languagesMapper,
        metadataValues: metadataValuesMapper,
        media: mediaMapper,
        references: referencesMapper,
      },
      primitiveMapper,
      keysToSkip,
      resourceName,
    );
  }

  canMap(resource: Any): resource is Source {
    return isSource(resource);
  }

  map(resource: Source, tableName: string): RowWithTables {
    const result = new RowWithTables(tableName);
    const prefixName = tableName === 'sources' ? 'source' : tableName;

    const toPrefix = createPrefixRow(resource, this.prefixColumns, prefixName);

    const mappedFields = this.fieldsMapper.mapFields(resource);
    _.entries(mappedFields).forEach(([key, mapped]) => {
      if (isTables(mapped)) {
        mapped.forEach(t => prefixTable(t, toPrefix));
      }
      this.fieldsMapper.append(result, key, mapped);
    });
    return result;
  }
}
