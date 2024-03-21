import { Csvable } from './Csvable';
import { BasicTable, Header, Row, Table } from './Table';
import { ArrayTable } from './ArrayTable';

export class RowWithHeader implements Csvable, Table {
  name: string;

  /**
   * Result of resource mapped to a table containing headers and a single row:
   */
  private rowTable: Table;

  constructor(from?: ArrayTable) {
    this.rowTable = new BasicTable('row');
    if (from) {
      this.rowTable.header = from[0];
      this.rowTable.rows.push(from[1]);
    } else {
      this.rowTable.rows.push([]);
    }
  }

  get row() {
    return this.rowTable.rows[0];
  }

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
}
