import { BasicTable, Table } from './Table';
import { RowWithHeader } from './RowWithHeader';

/**
 * Table row with headers, including tables of children
 */
export class RowWithChildTables extends RowWithHeader {
  /**
   * Child resources that resulted in their own tables
   */
  childTables: BasicTable[];

  constructor(name: string) {
    super(name);
    this.childTables = [];
  }

  appendTables(toAppend: Table[]) {
    this.childTables.push(...toAppend);
  }
}

export function isRowWithChildTables(
  toTest: RowWithHeader,
): toTest is RowWithChildTables {
  return !!(toTest as RowWithChildTables)?.childTables;
}
