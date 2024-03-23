import { RowWithChildTablesMapper } from './Mapper';
import { Corpus, isCorpus, Source } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithChildTables } from '../RowWithChildTables';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { ArrayMapper } from './ArrayMapper';
import {
  appendCell,
  appendCells,
  appendTables,
  createTableFrom,
  prefixHeader,
  prefixTablesOld,
} from '../ExportUtils';
import { PrimitiveMapper } from './PrimitiveMapper';
import { RowWithHeader } from '../RowWithHeader';

export class CorpusMapper implements RowWithChildTablesMapper<Corpus> {
  private subcorporaMapper: ArrayMapper<Corpus>;

  constructor(
    private metadataValuesMapper: MetadataValuesMapper,
    private tagsMapper: TagsMapper,
    private languagesMapper: LanguagesMapper,
    private sourcesMapper: ArrayMapper<Source>,
    private primitiveMapper: PrimitiveMapper,
    private keysToSkip: (keyof Corpus)[] = [],
    private resourceName = 'corpus',
  ) {
    this.subcorporaMapper = new ArrayMapper(this);
  }

  canMap(resource: Any): resource is Corpus {
    return isCorpus(resource);
  }

  map(corpus: Corpus, name: string): RowWithChildTables {
    const result = new RowWithChildTables(name);
    const prefixColumns = createTableFrom(name, corpus, ['id', 'title']);
    prefixHeader(prefixColumns, this.resourceName);
    let key: keyof Corpus;
    for (key in corpus) {
      if (this.keysToSkip.includes(key)) {
        continue;
      }
      const field = corpus[key];
      switch (key) {
        case 'parent':
          if (this.canMap(field)) {
            result.appendRow(
              new RowWithHeader('prefix', [
                ['parent_id', 'parent_title'],
                [field.id, field.title],
              ]),
            );
          }
          break;
        case 'tags':
          appendCell(result, key, field, this.tagsMapper);
          break;
        case 'languages':
          appendCell(result, key, field, this.languagesMapper);
          break;
        case 'metadataValues':
          appendCells(result, key, field, this.metadataValuesMapper);
          break;
        case 'sources':
          appendTables({
            result,
            key,
            field,
            mapper: this.sourcesMapper,
            modify: prefixTablesOld(prefixColumns),
          });
          break;
        case 'subcorpora':
          appendTables({
            result,
            key: this.resourceName,
            field,
            mapper: this.subcorporaMapper,
          });
          break;
        default:
          appendCell(result, key, field, this.primitiveMapper);
      }
    }
    return result;
  }
}
