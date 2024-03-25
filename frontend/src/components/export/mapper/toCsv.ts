import { stringify } from 'csv-stringify/browser/esm/sync';
import { ArrayTable } from './Table';

/**
 * Can it be converted into a csv?
 */
export type Csvable = {
  toCsvTable(): ArrayTable;
};

export function toCsv(table: Csvable, delimiter = ','): string {
  return stringify(table.toCsvTable(), { delimiter }).toString();
}
