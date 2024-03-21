import { RowWithChildTablesMapper } from './Mapper';
import { WithId } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { RowWithChildTables } from './RowWithChildTables';
import { createTableFrom, prefixColumns, prefixHeader } from './ExportUtils';

/**
 * Prefix mapped resource table with columns
 */
export class ColumnPrefixer<T extends WithId>
  implements RowWithChildTablesMapper<T>
{
  public resourceMapper: RowWithChildTablesMapper<T>;
  private fieldsToPrefix: (keyof T)[];
  private headerPrefix: string;

  constructor(
    mapper: RowWithChildTablesMapper<T>,
    headerPrefix: string,
    columnsToPrefix: (keyof T)[],
  ) {
    this.headerPrefix = headerPrefix;
    this.resourceMapper = mapper;
    this.fieldsToPrefix = columnsToPrefix;
  }

  canMap(field: Any): field is T {
    return this.resourceMapper.canMap(field);
  }

  map(resource: T, tableName: string): RowWithChildTables {
    const mapped = this.resourceMapper.map(resource, tableName);
    const toPrefix = createTableFrom(resource, this.fieldsToPrefix);
    toPrefix.header = prefixHeader(toPrefix.header, this.headerPrefix);
    prefixColumns(mapped, toPrefix);
    return mapped;
  }
}
