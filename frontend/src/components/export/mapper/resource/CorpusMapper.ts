import {
  AnyMapperResult,
  isCell,
  isRow,
  isTables,
  RowWithChildTablesMapper,
} from './Mapper';
import { Corpus, isCorpus, Source } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { ArrayMapper } from './ArrayMapper';
import { PrimitiveMapper } from './PrimitiveMapper';
import { RowWithChildTablesBaseMapper } from './RowWithChildTablesBaseMapper';
import { ParentMapper } from './ParentMapper';
import { RowWithChildTables } from '../RowWithChildTables';
import { prefixTable } from '../ExportUtils';

export class CorpusMapper
  extends RowWithChildTablesBaseMapper<Corpus>
  implements RowWithChildTablesMapper<Corpus>
{
  constructor(
    metadataValuesMapper: MetadataValuesMapper,
    tagsMapper: TagsMapper,
    languagesMapper: LanguagesMapper,
    sourcesMapper: ArrayMapper<Source>,
    parentMapper: ParentMapper,
    primitiveMapper: PrimitiveMapper,
    keysToSkip: (keyof Corpus)[] = [],
    prefixColumns: (keyof Corpus)[] = [],
    resourceName = 'corpus',
  ) {
    super(
      {
        metadataValues: metadataValuesMapper,
        tags: tagsMapper,
        languages: languagesMapper,
        sources: sourcesMapper,
        parent: parentMapper,
      },
      primitiveMapper,
      keysToSkip,
      prefixColumns,
      resourceName,
    );
    this.keyToMapper.subcorpora = new ArrayMapper(this);
  }

  canMap(resource: Any): resource is Corpus {
    return isCorpus(resource);
  }

  append(result: RowWithChildTables, key: string, mapped: AnyMapperResult) {
    if (isCell(mapped)) {
      result.appendCell(key, mapped);
    } else if (isRow(mapped)) {
      result.appendRow(mapped);
    } else if (isTables(mapped)) {
      if (key === 'subcorpora') {
        mapped.find(t => t.name === 'subcorpora').name = 'corpus';
      } else {
        mapped.forEach(t => prefixTable(t, this.prefixColumns));
      }
      result.appendTables(mapped);
    }
  }
}
