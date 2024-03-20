import { TablesMapper } from './Mapper';
import { Corpus, isCorpus } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { RowWithChildTables } from './RowWithChildTables';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { Header } from './Table';

function prepend(header: Header, prefix: string) {
  return header.map(h => `${prefix}.${h}`);
}

export class CorpusMapper implements TablesMapper<Corpus> {
  private tagsMapper = new TagsMapper();
  private languagesMapper = new LanguagesMapper();
  private metadataValueMapper: MetadataValuesMapper;

  constructor(metadataValueMapper: MetadataValuesMapper) {
    this.metadataValueMapper = metadataValueMapper;
  }

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
            result.header.push(key);
            result.row.push(this.tagsMapper.map(field));
          }
          break;
        case 'languages':
          if (this.languagesMapper.canMap(field)) {
            result.header.push(key);
            result.row.push(this.languagesMapper.map(field));
          }
          break;
        case 'metadataValues':
          if (this.metadataValueMapper.canMap(field)) {
            const mapped = this.metadataValueMapper.map(field);
            result.header.push(...prepend(mapped.header, 'metadata'));
            result.row.push(...mapped.row);
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
