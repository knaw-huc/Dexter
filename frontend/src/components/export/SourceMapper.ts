import { TableMapper } from './TableMapper';
import { isSource, Source } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { RowWithChildTables } from './RowWithChildTables';

export class SourceMapper implements TableMapper<Source> {
  name: string;

  public mappers: TableMapper<Any>[] = [
    // new SourceMapper()
  ];

  canMap(resource: Any): resource is Source {
    return isSource(resource);
  }

  map(Source: Source): RowWithChildTables {
    const result = new RowWithChildTables(this.name);

    let key: keyof Source;
    for (key in Source) {
      result.header.push(key);
      result.row.push(`${Source[key]}`);
    }
    return result;
  }
}
