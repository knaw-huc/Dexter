import { RowWithChildTablesMapper } from './Mapper';
import { Corpus, isCorpus, Source } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { RowWithChildTables } from './RowWithChildTables';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { ArrayMapper } from './ArrayMapper';

const resourceName = 'corpus';

export class CorpusMapper implements RowWithChildTablesMapper<Corpus> {
  constructor(
    private metadataValueMapper: MetadataValuesMapper,
    private tagsMapper: TagsMapper,
    private languagesMapper: LanguagesMapper,
    private sourcesMapper: ArrayMapper<Source>,
  ) {}

  canMap(resource: Any): resource is Corpus {
    return isCorpus(resource);
  }

  map(corpus: Corpus): RowWithChildTables {
    const result = new RowWithChildTables(resourceName);

    let key: keyof Corpus;
    for (key in corpus) {
      const field = corpus[key];
      switch (key) {
        case 'parent':
          if (this.canMap(field)) {
            result.tables.push(...this.map(field).tables);
            result.header.push('parent_id', 'parent_title');
            result.row.push(field.id, field.title);
          }
          break;
        case 'tags':
          if (this.tagsMapper.canMap(field)) {
            result.push([key], [this.tagsMapper.map(field)]);
          }
          break;
        case 'languages':
          if (this.languagesMapper.canMap(field)) {
            result.push([key], [this.languagesMapper.map(field)]);
          }
          break;
        case 'metadataValues':
          if (this.metadataValueMapper.canMap(field)) {
            const mapped = this.metadataValueMapper.map(field);
            result.push(mapped.header, mapped.row);
          }
          break;
        case 'sources':
          if (this.sourcesMapper.canMap(field)) {
            const mapped = this.sourcesMapper.map(field);
            result.tables.push(...mapped);
          }
          break;
        default:
          result.push([key], [String(field)]);
      }
    }
    return result;
  }
}
