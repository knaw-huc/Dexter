import { BasicTable, Cell, Table } from './Table';
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
  headerRow: RowWithHeader;

  /**
   * Child resources that resulted in their own tables
   */
  tables: BasicTable[];

  constructor(name: string) {
    this.name = name;
    this.headerRow = new RowWithHeader();
    this.tables = [];
  }

  get header() {
    return this.headerRow.header;
  }

  get rows() {
    return this.headerRow.rows;
  }

  public toCsvTable(): ArrayTable {
    return this.headerRow.toCsvTable();
  }

  pushColumn(header: Cell, row: Cell) {
    this.headerRow.pushColumn(header, row);
  }
  pushColumns(header: Cell[], row: Cell[]) {
    this.headerRow.pushColumns(header, row);
  }
}
