import { isSource, Source } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { RowWithChildTables } from './RowWithChildTables';
import { RowWithChildTablesMapper } from './Mapper';

export class SourceMapper implements RowWithChildTablesMapper<Source> {
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
      result.header.push(key);
      result.row.push(`${source[key]}`);
    }
    return result;
  }
}
