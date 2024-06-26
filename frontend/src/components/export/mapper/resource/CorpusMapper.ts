import { isTables, RowWithTablesMapper } from '../Mapper';
import { Any } from '../../../common/Any';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { ArrayMapper } from './ArrayMapper';
import { PrimitiveMapper } from './PrimitiveMapper';
import { RowWithTablesMapperHelper } from './RowWithTablesMapperHelper';
import { ParentMapper } from './ParentMapper';
import { RowWithTables } from '../RowWithTables';
import { createPrefixRow, prefixTable } from '../MapperUtils';
import _ from 'lodash';
import { Corpus, isCorpus } from '../../../../model/Corpus';
import { Source } from '../../../../model/Source';

export class CorpusMapper implements RowWithTablesMapper<Corpus> {
  private helper: RowWithTablesMapperHelper<Corpus>;

  constructor(
    metadataValuesMapper: MetadataValuesMapper,
    tagsMapper: TagsMapper,
    languagesMapper: LanguagesMapper,
    sourcesMapper: ArrayMapper<Source>,
    parentMapper: ParentMapper,
    primitiveMapper: PrimitiveMapper,
    keysToSkip: (keyof Corpus)[] = [],
    private prefixKeys: (keyof Corpus)[] = [],
    resourceName = 'corpus',
  ) {
    this.helper = new RowWithTablesMapperHelper<Corpus>(
      {
        metadataValues: metadataValuesMapper,
        tags: tagsMapper,
        languages: languagesMapper,
        sources: sourcesMapper,
        parent: parentMapper,
        subcorpora: new ArrayMapper(this),
      },
      primitiveMapper,
      keysToSkip,
      resourceName,
    );
  }

  canMap(resource: Any): resource is Corpus {
    return isCorpus(resource);
  }

  map(resource: Corpus): RowWithTables {
    const tableName = 'corpora';
    const prefixName = 'corpus';
    const result = new RowWithTables(tableName);
    const toPrefix = createPrefixRow(resource, this.prefixKeys, prefixName);

    const mappedFields = this.helper.mapFields(resource);
    _.entries(mappedFields).forEach(([key, mapped]) => {
      if (isTables(mapped)) {
        if (key === 'subcorpora') {
          const found = mapped.find(t => t.name === 'subcorpora');
          if (found) {
            // Subcorpora should be appended to corpus table:
            found.name = tableName;
          }
        } else {
          mapped.forEach(t => prefixTable(t, toPrefix));
        }
      }
      this.helper.append(result, key, mapped);
    });
    return result;
  }
}
