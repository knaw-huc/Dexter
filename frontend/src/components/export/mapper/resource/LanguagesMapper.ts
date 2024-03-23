import { isLanguage, ResultLanguage } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { CellMapper } from './Mapper';
import _ from 'lodash';

export class LanguagesMapper implements CellMapper<ResultLanguage[]> {
  canMap(resources: Any): resources is ResultLanguage[] {
    if (!_.isArray(resources)) {
      return false;
    }
    if (!resources.length) {
      return true;
    }
    return isLanguage(resources[0]);
  }

  map(languages: ResultLanguage[]): string {
    return languages.map(t => t.refName).join(',');
  }
}
