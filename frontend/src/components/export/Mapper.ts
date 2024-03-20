import { RowWithChildTables } from './RowWithChildTables';

/**
 * Map to table
 */
export interface TablesMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): RowWithChildTables;
}

import { Cell } from './Table';
import { RowWithHeader } from './RowWithHeader';

/**
 * Map to cell
 */
export interface CellMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): Cell;
}

/**
 * Map to cell
 */
export interface RowMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): RowWithHeader;
}
