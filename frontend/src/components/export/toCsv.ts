import { Table } from './Table';
import { stringify } from 'csv-stringify/browser/esm/sync';

export function toCsv(table: Table, delimiter = ','): string {
  return stringify(table.toCsvTable(), { delimiter }).toString();
}
