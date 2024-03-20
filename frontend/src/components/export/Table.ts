import { RowWithHeader } from './ResourceResult';
import { Csvable } from './Csvable';

export type Header = string[];
export type Row = string[];

export class Table implements Csvable {
  name: string;
  header: Header;
  private _rows: Row[];
  private prepend: RowWithHeader;

  constructor(name: string, prepend?: RowWithHeader) {
    this.name = name;
    this.prepend = prepend;
    this.header = [];
    if (prepend) {
      this.header.push(...prepend.header);
    }
    this._rows = [];
  }

  public toCsvTable(): string[][] {
    return [this.header, ...this.rows];
  }

  push(...rows: Row[]) {
    if (this.prepend) {
      rows.forEach(r => r.unshift(...this.prepend.row));
    }
    this._rows.push(...rows);
  }

  get rows(): readonly Row[] {
    return this._rows;
  }
}
