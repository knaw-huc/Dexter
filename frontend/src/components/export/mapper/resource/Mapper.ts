import { RowWithChildTables } from '../RowWithChildTables';
import { Cell, Table } from '../Table';
import { RowWithHeader } from '../RowWithHeader';

/**
 * Map to cell
 */
export interface CellMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): Cell;
}

/**
 * Map to row
 */
export interface RowMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): RowWithHeader;
}

/**
 * Map to row with children
 */
export interface RowWithChildTablesMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): RowWithChildTables;
}

/**
 * Map to table
 */
export interface TablesMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): Table[];
}
