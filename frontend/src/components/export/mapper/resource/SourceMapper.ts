import { Any } from '../../../common/Any';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { ArrayMapper } from './ArrayMapper';
import { PrimitiveMapper } from './PrimitiveMapper';
import { RowWithTablesMapperHelper } from './RowWithTablesMapperHelper';
import { isTables, RowWithTablesMapper } from '../Mapper';
import { RowWithTables } from '../RowWithTables';
import { createPrefixRow, prefixTable } from '../MapperUtils';
import _ from 'lodash';
import { isSource, Source } from '../../../../model/Source';
import { ResultMedia } from '../../../../model/Media';
import { Reference } from '../../../../model/Reference';

export class SourceMapper implements RowWithTablesMapper<Source> {
  private helper: RowWithTablesMapperHelper<Source>;

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
    this.helper = new RowWithTablesMapperHelper<Source>(
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

    const mappedFields = this.helper.mapFields(resource);
    _.entries(mappedFields).forEach(([key, mapped]) => {
      if (isTables(mapped)) {
        mapped.forEach(t => prefixTable(t, toPrefix));
      }
      this.helper.append(result, key, mapped);
    });
    return result;
  }
}
