import { RowWithHeader } from './RowWithHeader';
import { BasicTable, Header, Table } from './Table';
import { WithId } from '../../../model/DexterModel';
import { ArrayTable } from './ArrayTable';
import { CellMapper, RowMapper, TablesMapper } from './resource/Mapper';
import { Any } from '../../common/Any';
import { RowWithChildTables } from './RowWithChildTables';
import _ from 'lodash';

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

export function prefixTable(prefixTo: Table, toPrefix: RowWithHeader) {
  prefixTo.header.unshift(...toPrefix.header);
  for (const row of prefixTo.rows) {
    row.unshift(...toPrefix.row);
  }
}

export function prefixHeader(header: Header, prefix: string): Header {
  return header.map(h => `${prefix}.${h}`);
}

export function appendCell<T>(
  result: RowWithHeader,
  key: keyof T,
  field: Any,
  mapper?: CellMapper<T>,
) {
  const fieldName = String(key);
  if (mapper && mapper.canMap(field)) {
    const mapped = mapper.map(field, fieldName);
    result.pushColumn(fieldName, mapped);
  } else {
    result.pushColumn(fieldName, String(field));
  }
}

export function appendCells<T>(
  result: RowWithHeader,
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

type AppendTableConfig<T> = {
  result: RowWithChildTables;
  key: keyof T;
  field: Any;
  mapper: TablesMapper<T>;
  modify?: (toModify: Table[]) => void;
};
export function appendTables<T>(config: AppendTableConfig<T>) {
  const { result, key, field, mapper, modify } = config;
  if (mapper.canMap(field)) {
    const fieldName = String(key);
    const newTables = mapper.map(field, fieldName);
    if (modify) {
      modify(newTables);
    }
    result.tables.push(...newTables);
  }
}

export function concatTables(tables: Table[]): Table {
  const result = new BasicTable();
  if (!tables.length) {
    return result;
  }
  result.name = tables[0].name;
  result.header = tables[0].header;
  for (const table of tables) {
    if (!_.isEqual(table.header, result.header)) {
      throw new Error(
        `Cannot merge tables when headers differ:\nresult: ${result.header}\ntable: ${table.header}`,
      );
    }
    result.header = table.header;
    result.rows.push(...table.rows);
  }
  return result;
}
