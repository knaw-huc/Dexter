import { RowWithTables } from './RowWithTables';
import { Cell, Table } from './Table';
import { RowWithHeader } from './RowWithHeader';
import _ from 'lodash';

/**
 * Map a resource to a csv intermediary
 * Below the different options
 */
export interface Mapper<RESOURCE, RESULT> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE, name: string): RESULT;
}

/**
 * Map to cell
 */
export interface CellMapper<RESOURCE> extends Mapper<RESOURCE, Cell> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE): Cell;
}

/**
 * Map to a row
 */
export interface RowMapper<RESOURCE> extends Mapper<RESOURCE, RowWithHeader> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE, columnName: string): RowWithHeader;
}

/**
 * Map to a row and a list of child tables
 *
 * For example: a source can be mapped to a csv row,
 * but it also contains media and references that result in their own tables.
 */
export interface RowWithTablesMapper<RESOURCE>
  extends Mapper<RESOURCE, RowWithTables> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE, columnName: string): RowWithTables;
}

/**
 * Map resource(s) to a table, including any additional child tables
 * See the array mapper
 */
export interface TablesMapper<RESOURCE> extends Mapper<RESOURCE, Table[]> {
  canMap(toMap: RESOURCE): toMap is RESOURCE;
  map(toMap: RESOURCE, tableName: string): Table[];
}

export type AnyMapperResult = Cell | RowWithHeader | RowWithTables | Table[];

export function isCell(toTest: AnyMapperResult): toTest is Cell {
  return _.isString(toTest);
}

export function isRow(toTest: AnyMapperResult): toTest is RowWithHeader {
  const isRow = !!(
    (toTest as RowWithHeader)?.header && (toTest as RowWithHeader)?.row
  );
  const hasTables = (toTest as RowWithTables)?.tables;
  return isRow && !hasTables;
}

export function isRowWithTables(
  toTest: AnyMapperResult,
): toTest is RowWithTables {
  return !!(
    (toTest as RowWithTables)?.header &&
    (toTest as RowWithTables)?.row &&
    (toTest as RowWithTables)?.tables
  );
}

export function isTables(toTest: AnyMapperResult): toTest is Table[] {
  return _.isArray(toTest);
}
