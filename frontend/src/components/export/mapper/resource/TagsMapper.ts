import { isTag, ResultTag } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { CellMapper } from '../Mapper';
import _ from 'lodash';

export class TagsMapper implements CellMapper<ResultTag[]> {
  canMap(resources: Any): resources is ResultTag[] {
    if (!_.isArray(resources)) {
      return false;
    }
    if (!resources.length) {
      return true;
    }
    return isTag(resources[0]);
  }

  map(tags: ResultTag[]): string {
    return tags.map(t => t.val).join(',');
  }
}
