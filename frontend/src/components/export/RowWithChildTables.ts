import { Table } from './Table';
import { Csvable } from './Csvable';
import { CsvTable } from './CsvTable';
import { RowWithHeader } from './RowWithHeader';

/**
 * Table row, including tables of children
 */
export class RowWithChildTables implements Csvable {
  /**
   * Name of resource
   */
  name: string;

  /**
   * Result of mapping resource to table row
   */
  private _row: RowWithHeader;

  /**
   * Child resources that resulted in their own tables
   */
  tables: Table[];

  constructor(name: string) {
    this.name = name;
    this._row = new RowWithHeader();
    this.tables = [];
  }

  get row() {
    return this._row.row;
  }

  get header() {
    return this._row.header;
  }

  public toCsvTable(): CsvTable {
    return this._row.toCsvTable();
  }
}
