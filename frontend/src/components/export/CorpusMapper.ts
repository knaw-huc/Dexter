import { TableMapper } from './TableMapper';
import { Corpus, isCorpus } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { RowWithChildTables } from './RowWithChildTables';
import { TagsMapper } from './TagsMapper';

export class CorpusMapper implements TableMapper<Corpus> {
  private tagsMapper = new TagsMapper();

  canMap(resource: Any): resource is Corpus {
    return isCorpus(resource);
  }

  map(corpus: Corpus): RowWithChildTables {
    const result = new RowWithChildTables('corpus');

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
            result.header.push('tags');
            result.row.push(this.tagsMapper.map(field));
          }
          break;
        default:
          mapAsString(result, key, field);
      }
    }
    return result;
  }
}

export function mapAsString(
  result: RowWithChildTables,
  key: string,
  field: Any,
) {
  result.header.push(key);
  result.row.push(`${field}`);
}
