import { CsvTable } from './CsvTable';

export interface Csvable {
  toCsvTable(): CsvTable;
}
