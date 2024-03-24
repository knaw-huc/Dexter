import { BasicTable, Table } from './Table';
import { RowWithHeader } from './RowWithHeader';

/**
 * Row, and possible tables of child resources
 */
export class RowWithTables extends RowWithHeader {
  /**
   * Child resources that resulted in their own tables
   */
  tables: BasicTable[];

  constructor(name: string) {
    super(name);
    this.tables = [];
  }

  appendTables(toAppend: Table[]) {
    this.tables.push(...toAppend);
  }
}

export function isRowWithTables(
  toTest: RowWithHeader,
): toTest is RowWithTables {
  return !!(toTest as RowWithTables)?.tables;
}
