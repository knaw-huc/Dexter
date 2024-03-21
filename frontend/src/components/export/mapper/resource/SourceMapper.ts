import { isSource, Source } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithChildTables } from '../RowWithChildTables';
import { RowWithChildTablesMapper } from './Mapper';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { appendCell, appendCells } from '../ExportUtils';

export class SourceMapper implements RowWithChildTablesMapper<Source> {
  constructor(
    private tagsMapper: TagsMapper,
    private languagesMapper: LanguagesMapper,
    private metadataValuesMapper: MetadataValuesMapper,
  ) {}

  name: string;
  private keysToSkip = ['corpora'];

  canMap(resource: Any): resource is Source {
    return isSource(resource);
  }

  map(source: Source): RowWithChildTables {
    const result = new RowWithChildTables(this.name);

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
        default:
          appendCell(result, key, field);
      }
    }
    return result;
  }
}
