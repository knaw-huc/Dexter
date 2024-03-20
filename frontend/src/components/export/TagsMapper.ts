import { isTag, ResultTag } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { CellMapper } from './CellMapper';

export class TagsMapper implements CellMapper<ResultTag[]> {
  name: string;

  canMap(resources: Any): resources is ResultTag[] {
    return resources.length && isTag(resources[0]);
  }

  map(tags: ResultTag[]): string {
    return tags.map(t => t.val).join(',');
  }
}
