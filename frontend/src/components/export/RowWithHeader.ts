import { Csvable } from './Csvable';
import { Header, Table } from './Table';

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
