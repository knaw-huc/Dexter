import { ResourceMapper } from './ResourceMapper';
import { isSource, Source } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { ResourceResult } from './ResourceResult';

export class SourceMapper implements ResourceMapper<Source> {
  name: string = 'source';

  public mappers: ResourceMapper<Any>[] = [
    // new SourceMapper()
  ];

  canMap(resource: Any): boolean {
    return isSource(resource);
  }

  map(Source: Source): ResourceResult {
    const result = new ResourceResult(this.name);

    let key: keyof Source;
    for (key in Source) {
      result.header.push(key);
      result.row.push(`${Source[key]}`);
    }
    return result;
  }
}
