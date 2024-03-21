import { BasicTable } from './Table';
import { RowWithHeader } from './RowWithHeader';

/**
 * Table row with headers, including tables of children
 */
export class RowWithChildTables extends RowWithHeader {
  /**
   * Child resources that resulted in their own tables
   */
  tables: BasicTable[];

  constructor(name: string) {
    super();
    this.name = name;
    this.tables = [];
  }
}

export function isRowWithChildTables(
  toTest: RowWithHeader,
): toTest is RowWithChildTables {
  return !!(toTest as RowWithChildTables)?.tables;
}
