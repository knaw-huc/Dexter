import { BasicTable, Header, Row, Table } from './Table';
import { ArrayTable } from './ArrayTable';
import { RowWithHeader } from './RowWithHeader';

/**
 * Table row, including tables of children
 */
export class RowWithChildTables implements Table {
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
  tables: BasicTable[];

  constructor(name: string) {
    this.name = name;
    this._row = new RowWithHeader();
    this.tables = [];
  }

  get row() {
    return this._row.row;
  }

  get rows() {
    return this._row.rows;
  }

  get header() {
    return this._row.header;
  }

  public toCsvTable(): ArrayTable {
    return this._row.toCsvTable();
  }

  push(header: Header, row: Row) {
    this.header.push(...header);
    this.row.push(...row);
  }
}
