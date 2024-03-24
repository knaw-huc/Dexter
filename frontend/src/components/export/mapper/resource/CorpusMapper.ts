import { isTables, RowWithTablesMapper } from '../Mapper';
import { Corpus, isCorpus, Source } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { ArrayMapper } from './ArrayMapper';
import { PrimitiveMapper } from './PrimitiveMapper';
import { FieldsMapper } from './FieldsMapper';
import { ParentMapper } from './ParentMapper';
import { RowWithTables } from '../RowWithTables';
import { createPrefixRow, prefixTable } from '../ExportUtils';
import _ from 'lodash';

export class CorpusMapper implements RowWithTablesMapper<Corpus> {
  private baseMapper: FieldsMapper<Corpus>;

  constructor(
    metadataValuesMapper: MetadataValuesMapper,
    tagsMapper: TagsMapper,
    languagesMapper: LanguagesMapper,
    sourcesMapper: ArrayMapper<Source>,
    parentMapper: ParentMapper,
    primitiveMapper: PrimitiveMapper,
    keysToSkip: (keyof Corpus)[] = [],
    private toPrefix: (keyof Corpus)[] = [],
    resourceName = 'corpus',
  ) {
    this.baseMapper = new FieldsMapper<Corpus>(
      {
        metadataValues: metadataValuesMapper,
        tags: tagsMapper,
        languages: languagesMapper,
        sources: sourcesMapper,
        parent: parentMapper,
      },
      primitiveMapper,
      keysToSkip,
      resourceName,
    );
    this.baseMapper.keyToMapper.subcorpora = new ArrayMapper(this);
  }

  canMap(resource: Any): resource is Corpus {
    return isCorpus(resource);
  }

  map(resource: Corpus, tableName: string): RowWithTables {
    const result = new RowWithTables(tableName);
    const prefixName = tableName === 'subcorpora' ? 'corpus' : tableName;
    const toPrefix = createPrefixRow(resource, this.toPrefix, prefixName);

    const mappedFields = this.baseMapper.mapFields(resource);
    _.entries(mappedFields).forEach(([key, mapped]) => {
      if (isTables(mapped)) {
        // Prevent double prefixing of subcorpora:
        if (key === 'subcorpora') {
          mapped.find(t => t.name === 'subcorpora').name = 'corpus';
        } else {
          mapped.forEach(t => prefixTable(t, toPrefix));
        }
      }
      this.baseMapper.append(result, key, mapped);
    });
    return result;
  }
}
