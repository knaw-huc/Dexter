import { isWithId, WithId } from '../../model/DexterModel';
import { TableMapper } from './TableMapper';
import { CorpusMapper } from './CorpusMapper';

export class MainMapper implements TableMapper<WithId> {
  name: string;

  public mappers: TableMapper<WithId>[] = [new CorpusMapper()];

  canMap(resource: WithId): resource is WithId {
    return isWithId(resource);
  }

  map(resource: WithId) {
    return this.mappers.find(m => m.canMap(resource)).map(resource, 'export');
  }
}
