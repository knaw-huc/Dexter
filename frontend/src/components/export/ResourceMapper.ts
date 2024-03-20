import { ResourceResult } from './ResourceResult';

/**
 * Map resource something that can be mapped to csv
 */
export interface ResourceMapper<T> {
  name: string;

  canMap(toMap: T): boolean;
  map(toMap: T): ResourceResult;
}
