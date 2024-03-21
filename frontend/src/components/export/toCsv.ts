import { BasicTable } from './Table';
import { stringify } from 'csv-stringify/browser/esm/sync';

export function toCsv(table: BasicTable, delimiter = ','): string {
  return stringify(table.toCsvTable(), { delimiter }).toString();
}
