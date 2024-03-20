import { isWithId, WithId } from '../../model/DexterModel';
import { ResourceMapper } from './ResourceMapper';
import { CorpusMapper } from './CorpusMapper';

export class MainMapper implements ResourceMapper<WithId> {
  name: string;

  public mappers: ResourceMapper<WithId>[] = [new CorpusMapper()];

  canMap(resource: WithId) {
    return isWithId(resource);
  }

  map(resource: WithId) {
    const mapped = this.mappers.find(m => m.canMap(resource)).map(resource);

    return mapped;
  }
}
