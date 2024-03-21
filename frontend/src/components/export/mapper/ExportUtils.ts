import { RowWithHeader } from './RowWithHeader';
import { Header, Table } from './Table';
import { WithId } from '../../../model/DexterModel';
import { ArrayTable } from './ArrayTable';
import { CellMapper, RowMapper, TablesMapper } from './resource/Mapper';
import { Any } from '../../common/Any';
import { RowWithChildTables } from './RowWithChildTables';

export function createTableFrom<T extends WithId>(
  resource: T,
  fields: (keyof T)[],
  columnPrefix?: string,
) {
  const init: ArrayTable = [[], []];
  for (const key of fields) {
    const columnHeader: string = columnPrefix
      ? `${columnPrefix}.${String(key)}`
      : String(key);
    init[0].push(columnHeader);
    init[1].push(String(resource[key]));
  }
  return new RowWithHeader(init);
}

export function prefixColumns(prefixTo: Table, toPrefix: RowWithHeader) {
  prefixTo.header.unshift(...toPrefix.header);
  for (const row of prefixTo.rows) {
    row.unshift(...toPrefix.row);
  }
}

export function prefixHeader(header: Header, prefix: string): Header {
  return header.map(h => `${prefix}.${h}`);
}

export function appendCell<T>(
  result: RowWithChildTables,
  key: keyof T,
  field: Any,
  mapper?: CellMapper<T>,
) {
  const fieldName = String(key);
  if (mapper && mapper.canMap(field)) {
    const mapped = mapper.map(field, fieldName);
    result.headerRow.pushColumn(fieldName, mapped);
  } else {
    result.headerRow.pushColumn(fieldName, String(field));
  }
}

export function appendCells<T>(
  result: RowWithChildTables,
  key: keyof T,
  field: Any,
  mapper: RowMapper<T>,
) {
  if (mapper.canMap(field)) {
    const fieldName = String(key);
    const mapped = mapper.map(field, fieldName);
    result.pushColumns(mapped.header, mapped.row);
  }
}

export function appendTables<T>(
  result: RowWithChildTables,
  key: keyof T,
  field: Any,
  mapper: TablesMapper<T>,
) {
  if (mapper.canMap(field)) {
    const fieldName = String(key);
    const mapped = mapper.map(field, fieldName);
    result.tables.push(...mapped);
  }
}
