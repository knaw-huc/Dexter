import { Csvable } from './toCsv';

export type Cell = string;
export type HeaderCell = Cell;
export type Header = HeaderCell[];
export type Row = Cell[];

export type ArrayTable = Cell[][];

export type Table = Csvable & {
  name: string;
  header: Header;
  rows: Row[];
};

export class BasicTable implements Table {
  name: string;
  header: Header;
  rows: Row[];

  constructor(name: string = '') {
    this.name = name;
    this.header = [];
    this.rows = [];
  }

  public toCsvTable(): ArrayTable {
    return [this.header, ...this.rows];
  }
}
