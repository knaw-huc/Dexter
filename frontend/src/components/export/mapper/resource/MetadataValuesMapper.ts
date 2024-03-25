import { isMetadataValue, MetadataValue } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowMapper } from '../Mapper';
import _ from 'lodash';

export class MetadataValuesMapper implements RowMapper<MetadataValue[]> {
  private readonly allKeys: string[];
  constructor(allKeys: string[]) {
    this.allKeys = allKeys;
  }
  canMap(resources: Any): resources is MetadataValue[] {
    if (!_.isArray(resources)) {
      return false;
    }
    if (!resources.length) {
      return true;
    }
    return isMetadataValue(resources[0]);
  }

  map(metadataValues: MetadataValue[], rowName: string): RowWithHeader {
    const result = new RowWithHeader(rowName);
    for (const key of this.allKeys) {
      result.header.push(`metadata.${key}`);
      result.row.push(metadataValues.find(v => v.key.key === key)?.value ?? '');
    }
    return result;
  }
}
