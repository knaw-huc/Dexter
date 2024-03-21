import { Csvable } from './Csvable';

export type Cell = string;
export type Header = Cell[];
export type Row = Cell[];

export type Table = Csvable & {
  name: string;
  header: Header;
  rows: Row[];
};

export class BasicTable implements Table {
  name: string;
  header: Header;
  rows: Row[];

  constructor(name: string) {
    this.name = name;
    this.header = [];
    this.rows = [];
  }

  public toCsvTable(): string[][] {
    return [this.header, ...this.rows];
  }
}
