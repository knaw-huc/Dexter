import { RowWithChildTablesMapper, TablesMapper } from './Mapper';
import { WithId } from '../../model/DexterModel';
import _ from 'lodash';
import { BasicTable } from './Table';
import { Any } from '../common/Any';

/**
 * Move all rows of mapped resources into single table
 */
export class ArrayMapper<T extends WithId> implements TablesMapper<T[]> {
  public resourceMapper: RowWithChildTablesMapper<T>;
  private resourceName: string;

  constructor(mappers: RowWithChildTablesMapper<T>, resourceName: string) {
    this.resourceMapper = mappers;
    this.resourceName = resourceName;
  }

  canMap(field: Any): field is T[] {
    if (field?.length < 0) {
      return false;
    }
    return this.resourceMapper.canMap(field[0]);
  }

  map(resources: T[]): BasicTable[] {
    const resourcesTable = new BasicTable(this.resourceName);
    const result: BasicTable[] = [];
    result.push(resourcesTable);

    if (!resources.length) {
      return result;
    }

    if (!this.resourceMapper.canMap(resources[0])) {
      throw new Error('Cannot map ' + resources[0]);
    }

    const firstRowHeaders = this.resourceMapper.map(
      resources[0],
      this.resourceName,
    ).header;
    resourcesTable.header.push(...firstRowHeaders);

    for (const resource of resources) {
      const mappedResource = this.resourceMapper.map(
        resource,
        this.resourceName,
      );
      if (!_.isEqual(resourcesTable.header, mappedResource.header)) {
        throw Error(`Headers do not match:\n
          array headers: ${resourcesTable.header.join(',')}\n
          row headers: ${mappedResource.header.join(',')}`);
      }
      resourcesTable.rows.push(mappedResource.row);
      result.push(...mappedResource.tables);
    }

    return result;
  }
}
