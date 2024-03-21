import { RowWithHeader } from './RowWithHeader';
import { Header, Table } from './Table';
import { WithId } from '../../model/DexterModel';
import { ArrayTable } from './ArrayTable';

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
