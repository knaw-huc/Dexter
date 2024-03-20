import { TablesMapper } from './Mapper';
import { WithId } from '../../model/DexterModel';
import { RowWithChildTables } from './RowWithChildTables';
import _ from 'lodash';
import { Table } from './Table';

export class ArrayMapper<T extends WithId> implements TablesMapper<T[]> {
  public resourceMapper: TablesMapper<T>;

  constructor(mappers: TablesMapper<T>) {
    this.resourceMapper = mappers;
  }

  canMap(resource: T[]): resource is T[] {
    if (resource.length < 0) {
      return true;
    }
    return this.resourceMapper.canMap(resource[0]);
  }

  map(resources: T[], fieldName: string): RowWithChildTables {
    const resourcesTable = new Table(fieldName);
    const result = new RowWithChildTables(fieldName);
    result.tables.push(resourcesTable);

    if (!resources.length) {
      return result;
    }

    if (!this.resourceMapper.canMap(resources[0])) {
      throw new Error('Cannot map ' + resources[0]);
    }

    const firstRowHeaders = this.resourceMapper.map(
      resources[0],
      fieldName,
    ).header;
    resourcesTable.header.push(...firstRowHeaders, fieldName);

    for (const resource of resources) {
      const mappedResource = this.resourceMapper.map(resource, fieldName);
      if (!_.isEqual(resourcesTable.header, mappedResource.header)) {
        throw Error(`Headers do not match:\n
          array headers: ${resourcesTable.header.join(',')}\n
          row headers: ${mappedResource.header.join(',')}`);
      }
      resourcesTable.push(mappedResource.row);
      result.tables.push(...mappedResource.tables);
    }

    return result;
  }
}
