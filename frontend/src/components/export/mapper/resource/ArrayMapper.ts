import { RowMapper, RowWithTablesMapper, TablesMapper } from '../Mapper';
import { WithId } from '../../../../model/DexterModel';
import _ from 'lodash';
import { BasicTable } from '../Table';
import { Any } from '../../../common/Any';
import { isRowWithTables } from '../RowWithTables';

/**
 * Move all mapped resource rows into a single table
 **/
export class ArrayMapper<T extends WithId> implements TablesMapper<T[]> {
  constructor(public resourceMapper: RowMapper<T> | RowWithTablesMapper<T>) {}

  canMap(field: Any): field is T[] {
    if (!field?.length) {
      return false;
    }
    return this.resourceMapper.canMap(field[0]);
  }

  map(resources: T[], tableName: string): BasicTable[] {
    if (!resources.length) {
      return [];
    }

    if (!this.resourceMapper.canMap(resources[0])) {
      throw new Error('Cannot map ' + resources[0]);
    }

    const table = new BasicTable(tableName);

    const result: BasicTable[] = [];
    result.push(table);

    const firstRowHeaders = this.resourceMapper.map(
      resources[0],
      tableName,
    ).header;
    table.header.push(...firstRowHeaders);

    for (const resource of resources) {
      const row = this.resourceMapper.map(resource, tableName);
      if (!_.isEqual(table.header, row.header)) {
        throw Error(`Headers do not match:\n
          array headers: ${table.header.join(',')}\n
          row headers:   ${row.header.join(',')}`);
      }
      table.rows.push(row.row);
      if (isRowWithTables(row)) {
        result.push(...row.tables);
      }
    }

    return result;
  }
}
