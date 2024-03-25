import {
  ArrayTable,
  BasicTable,
  Cell,
  Header,
  HeaderCell,
  Row,
  Table,
} from './Table';

/**
 * A csv row with its header
 */
export class RowWithHeader implements Table {
  name: string;

  /**
   * Result of resource mapped to a table containing headers and a single row:
   */
  private rowTable: Table;

  constructor(name: string, from?: ArrayTable) {
    this.name = name;
    this.rowTable = new BasicTable(name);
    if (from) {
      this.rowTable.header = from[0];
      this.rowTable.rows.push(from[1]);
    } else {
      this.rowTable.rows.push([]);
    }
  }

  get row(): Row {
    return this.rowTable.rows[0];
  }

  /**
   * Freeze to enforce single row
   */
  get rows(): Row[] {
    return Object.freeze(this.rowTable.rows) as Row[];
  }

  get header(): Header {
    return this.rowTable.header;
  }

  set header(header: Header) {
    this.rowTable.header = header;
  }

  public toCsvTable(): string[][] {
    return this.rowTable.toCsvTable();
  }

  appendCell(headerToAppend: HeaderCell, cellToAppend: Cell) {
    this.header.push(headerToAppend);
    this.row.push(cellToAppend);
  }

  appendRow(toAppend: RowWithHeader) {
    this.header.push(...toAppend.header);
    this.row.push(...toAppend.row);
  }
}
