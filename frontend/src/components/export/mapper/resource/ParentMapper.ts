import { Corpus, isCorpus } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowMapper } from './Mapper';
import { RowWithHeader } from '../RowWithHeader';

export class ParentMapper implements RowMapper<Corpus> {
  canMap(resource: Any): resource is Corpus {
    if (!resource) {
      return true;
    }
    return isCorpus(resource);
  }

  map(parent: Corpus) {
    return new RowWithHeader('prefix', [
      ['parent_id', 'parent_title'],
      [parent?.id, parent?.title],
    ]);
  }
}
