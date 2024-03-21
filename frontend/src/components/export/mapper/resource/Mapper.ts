import { RowWithChildTables } from '../RowWithChildTables';
import { Cell, Table } from '../Table';
import { RowWithHeader } from '../RowWithHeader';

/**
 * Map to table
 */
export interface TablesMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): Table[];
}

/**
 * Map to table
 */
export interface RowWithChildTablesMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): RowWithChildTables;
}

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
