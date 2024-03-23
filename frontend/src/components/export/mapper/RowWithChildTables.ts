import { BasicTable, Table } from './Table';
import { RowWithHeader } from './RowWithHeader';

/**
 * Row, and possible tables of child resources
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
