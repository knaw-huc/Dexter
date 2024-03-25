import { BasicTable, Table } from './Table';
import { RowWithHeader } from './RowWithHeader';

/**
 * Row of a mapped child resource
 * including any additional child tables
 *
 * E.g. mapping a source results in a sources csv row
 * and a list of tables of mapped references and media
 */
export class RowWithTables extends RowWithHeader {
  /**
   * Child resource tables
   */
  tables: BasicTable[];

  constructor(name: string) {
    super(name);
    this.tables = [];
  }

  appendTables(toAppend: Table[]) {
    this.tables.push(...toAppend);
  }
}
