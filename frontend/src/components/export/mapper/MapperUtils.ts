import { RowWithHeader } from './RowWithHeader';
import { ArrayTable, BasicTable, Table } from './Table';
import { WithId } from '../../../model/DexterModel';
import { CellMapper } from './Mapper';
import { Any } from '../../common/Any';
import _ from 'lodash';

export function createRowFrom<T extends WithId>(
  name: string,
  resource: T,
  fields: (keyof T)[],
): RowWithHeader {
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

export function prefixTable(prefixTo: Table, prefix: RowWithHeader): void {
  prefixTo.header.unshift(...prefix.header);
  for (const row of prefixTo.rows) {
    row.unshift(...prefix.row);
  }
}

export function createPrefixRow<RESOURCE extends WithId>(
  /**
   *
   */
  resource: RESOURCE,

  /**
   * Columns to select from resource
   */
  prefixColumns: (keyof RESOURCE)[],

  /**
   * String to append to each column header
   */
  tableName: string,
): RowWithHeader {
  const result = createRowFrom('prefix', resource, prefixColumns);
  prefixHeader(result, tableName);
  return result;
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
