import { ResourceMapper } from './ResourceMapper';
import { WithId } from '../../model/DexterModel';
import { ResourceResult } from './ResourceResult';
import _ from 'lodash';
import { Table } from './Table';

export class ArrayMapper<T extends WithId> implements ResourceMapper<T[]> {
  name: string;

  public mapper: ResourceMapper<T>;

  constructor(name: string, mappers: ResourceMapper<T>) {
    this.name = name;
    this.mapper = mappers;
  }

  canMap(resource: T[]): boolean {
    if (resource.length < 0) {
      return true;
    }
    return this.mapper.canMap(resource[0]);
  }

  map(resources: T[]): ResourceResult {
    const resourcesTable = new Table(this.name);
    const result = new ResourceResult(this.name);
    result.tables.push(resourcesTable);

    if (!resources.length) {
      return result;
    }

    if (!this.mapper.canMap(resources[0])) {
      throw new Error('Cannot map ' + resources[0]);
    }

    const firstRowHeaders = this.mapper.map(resources[0]).header;
    resourcesTable.header.push(...firstRowHeaders);

    for (const resource of resources) {
      const mappedResource = this.mapper.map(resource);
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
