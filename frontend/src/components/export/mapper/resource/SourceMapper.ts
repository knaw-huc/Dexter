import {
  isSource,
  Reference,
  ResultMedia,
  Source,
} from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithChildTables } from '../RowWithChildTables';
import { RowWithChildTablesMapper } from './Mapper';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import {
  appendCell,
  appendCells,
  appendTables,
  createTableFrom,
  prefixAll,
} from '../ExportUtils';
import { ArrayMapper } from './ArrayMapper';

export class SourceMapper implements RowWithChildTablesMapper<Source> {
  constructor(
    private name: string,
    private tagsMapper: TagsMapper,
    private languagesMapper: LanguagesMapper,
    private metadataValuesMapper: MetadataValuesMapper,
    private mediaMapper: ArrayMapper<ResultMedia>,
    private referencesMapper: ArrayMapper<Reference>,
    private keysToSkip: (keyof Source)[],
  ) {}

  canMap(resource: Any): resource is Source {
    return isSource(resource);
  }

  map(source: Source): RowWithChildTables {
    const result = new RowWithChildTables(this.name);
    const toPrefix = createTableFrom(source, ['id', 'title'], this.name);

    let key: keyof Source;
    for (key in source) {
      if (this.keysToSkip.includes(key)) {
        continue;
      }
      const field = source[key];
      switch (key) {
        case 'tags':
          appendCell(result, key, field, this.tagsMapper);
          break;
        case 'languages':
          appendCell(result, key, field, this.languagesMapper);
          break;
        case 'metadataValues':
          appendCells(result, key, field, this.metadataValuesMapper);
          break;
        case 'media':
          appendTables({
            result,
            key,
            field,
            mapper: this.mediaMapper,
            modify: prefixAll(toPrefix),
          });
          break;
        case 'references':
          appendTables({
            result,
            key,
            field,
            mapper: this.referencesMapper,
            modify: prefixAll(toPrefix),
          });
          break;
        default:
          appendCell(result, key, field);
      }
    }
    return result;
  }
}
