import { isTag, ResultTag } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { CellMapper } from './Mapper';

export class TagsMapper implements CellMapper<ResultTag[]> {
  canMap(resources: Any): resources is ResultTag[] {
    return resources.length && isTag(resources[0]);
  }

  map(tags: ResultTag[]): string {
    return tags.map(t => t.val).join(',');
  }
}
