import { RowWithChildTables } from './RowWithChildTables';

/**
 * Map resource something that can be mapped to csv
 */
export interface TableMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): RowWithChildTables;
}
