import { Header, Table } from './Table';
import { Csvable } from './Csvable';
import { CsvTable } from './CsvTable';

export class ResourceResult implements Csvable {
  /**
   * Name of resource
   */
  name: string;

  /**
   * Child resources that resulted in their own tables
   */
  tables: Table[];

  private _row: RowWithHeader;

  constructor(name: string) {
    this.name = name;
    this._row = new RowWithHeader(name);
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

export class RowWithHeader implements Csvable {
  private name: string;

  /**
   * Result of resource mapped to a table containing headers and a single row:
   */
  private rowTable: Table;

  constructor(name: string, prepend?: RowWithHeader) {
    this.name = name;
    this.rowTable = new Table(name, prepend);
    this.rowTable.push([]);
  }

  get row() {
    return this.rowTable.rows[0];
  }

  get header(): Header {
    return this.rowTable.header;
  }

  public toCsvTable(): string[][] {
    return this.rowTable.toCsvTable();
  }
}
