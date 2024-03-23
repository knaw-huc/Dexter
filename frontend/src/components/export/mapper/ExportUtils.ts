import { RowWithHeader } from './RowWithHeader';
import { BasicTable, Table } from './Table';
import { WithId } from '../../../model/DexterModel';
import { ArrayTable } from './ArrayTable';
import { CellMapper, Mapper, RowMapper, TablesMapper } from './resource/Mapper';
import { Any } from '../../common/Any';
import _ from 'lodash';
import { RowWithChildTables } from './RowWithChildTables';
import { Mapped, notMapped } from './Mapped';

export function map<RESOURCE, RESULT>(
  mapper: Mapper<RESOURCE, RESULT>,
  field: Any,
  key: keyof RESOURCE,
): Mapped<RESULT> {
  if (mapper.canMap(field)) {
    const fieldName = String(key);
    return new Mapped(mapper.map(field, fieldName));
  }
  return notMapped;
}

export function createTableFrom<T extends WithId>(
  name: string,
  resource: T,
  fields: (keyof T)[],
) {
  const init: ArrayTable = [[], []];
  for (const key of fields) {
    const columnHeader: string = String(key);
    init[0].push(columnHeader);
    init[1].push(String(resource[key]));
  }
  return new RowWithHeader(name, init);
}

export function prefixHeader(prefixTo: Table, prefix: string): void {
  prefixTo.header = prefixTo.header.map(h => `${prefix}.${h}`);
}

export function prefixColumns(prefixTo: Table, prefix: RowWithHeader): void {
  prefixTo.header.unshift(...prefix.header);
  for (const row of prefixTo.rows) {
    row.unshift(...prefix.row);
  }
}
export function prefixTables(tables: Table[], toPrefix: RowWithHeader): void {
  tables.forEach(t => prefixColumns(t, toPrefix));
}

// TODO: remove:
export function prefixTablesOld(toPrefix: RowWithHeader) {
  return (tables: Table[]) => tables.map(t => prefixColumns(t, toPrefix));
}
export function appendCell<T>(
  result: RowWithHeader,
  key: keyof T,
  field: Any,
  mapper: CellMapper<T>,
) {
  const fieldName = String(key);
  if (mapper.canMap(field)) {
    const mapped = mapper.map(field);
    result.appendCell(fieldName, mapped);
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
    result.appendRow(mapped);
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
    result.childTables.push(...newTables);
  }
}
// TODO: remove ^

export function mergeTables(tables: Table[]): Table {
  const concatenated = new BasicTable();
  if (!tables.length) {
    return concatenated;
  }
  concatenated.name = tables[0].name;
  concatenated.header = tables[0].header;
  for (const toConcat of tables) {
    if (!_.isEqual(toConcat.header, concatenated.header)) {
      throw new Error(
        `Cannot merge tables when headers differ:\nresult: ${concatenated.header}\ntable:  ${toConcat.header}`,
      );
    }
    concatenated.header = toConcat.header;
    concatenated.rows.push(...toConcat.rows);
  }
  return concatenated;
}
