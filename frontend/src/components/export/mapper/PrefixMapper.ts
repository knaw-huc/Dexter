import { RowMapper } from './resource/Mapper';
import { WithId } from '../../../model/DexterModel';
import { Any } from '../../common/Any';
import { createTableFrom, prefixTable, prefixHeader } from './ExportUtils';
import { RowWithHeader } from './RowWithHeader';

/**
 * Prefix mapped resource table with columns
 */
export class ColumnPrefixer<T extends WithId> implements RowMapper<T> {
  constructor(
    public resourceMapper: RowMapper<T>,
    private headerPrefix: string,
    private fieldsToPrefix: (keyof T)[],
  ) {}

  canMap(field: Any): field is T {
    return this.resourceMapper.canMap(field);
  }

  map(resource: T, tableName: string): RowWithHeader {
    const mapped = this.resourceMapper.map(resource, tableName);
    const toPrefix = createTableFrom(resource, this.fieldsToPrefix);
    toPrefix.header = prefixHeader(toPrefix.header, this.headerPrefix);
    prefixTable(mapped, toPrefix);
    return mapped;
  }
}
