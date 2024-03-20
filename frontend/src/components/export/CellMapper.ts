import { Cell } from './Table';

/**
 * Map something that can be mapped to single
 */
export interface CellMapper<T> {
  canMap(toMap: T): toMap is T;
  map(toMap: T, fieldName: string): Cell;
}
