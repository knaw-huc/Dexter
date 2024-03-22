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
  prefixAll,
} from '../ExportUtils';

export class CorpusMapper implements RowWithChildTablesMapper<Corpus> {
  private subcorporaMapper = new ArrayMapper(this, 'subcorpus');
  constructor(
    private metadataValuesMapper: MetadataValuesMapper,
    private tagsMapper: TagsMapper,
    private languagesMapper: LanguagesMapper,
    private sourcesMapper: ArrayMapper<Source>,
    private name = 'corpus',
  ) {}

  canMap(resource: Any): resource is Corpus {
    return isCorpus(resource);
  }

  map(corpus: Corpus): RowWithChildTables {
    const result = new RowWithChildTables(this.name);
    const sourcePrefix = createTableFrom(corpus, ['id', 'title'], this.name);

    let key: keyof Corpus;
    for (key in corpus) {
      const field = corpus[key];
      switch (key) {
        case 'parent':
          if (this.canMap(field)) {
            result.pushColumns(
              ['parent_id', 'parent_title'],
              [field.id, field.title],
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
            modify: prefixAll(sourcePrefix),
          });
          break;
        case 'subcorpora':
          appendTables({
            result,
            key,
            field,
            mapper: this.subcorporaMapper,
          });
          break;
        default:
          appendCell(result, key, field);
      }
    }
    return result;
  }
}
