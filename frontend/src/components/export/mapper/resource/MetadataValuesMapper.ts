import { isMetadataValue, MetadataValue } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowMapper } from './Mapper';

export class MetadataValuesMapper implements RowMapper<MetadataValue[]> {
  private readonly allKeys: string[];
  constructor(allKeys: string[]) {
    this.allKeys = allKeys;
  }
  canMap(resource: Any): resource is MetadataValue[] {
    return resource.length && isMetadataValue(resource[0]);
  }

  map(metadataValues: MetadataValue[]): RowWithHeader {
    const result = new RowWithHeader();
    for (const key of this.allKeys) {
      result.header.push(`metadata.${key}`);
      result.row.push(metadataValues.find(v => v.key.key === key)?.value ?? '');
    }
    return result;
  }
}
