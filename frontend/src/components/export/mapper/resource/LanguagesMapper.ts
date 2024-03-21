import { isLanguage, ResultLanguage } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { CellMapper } from './Mapper';

export class LanguagesMapper implements CellMapper<ResultLanguage[]> {
  canMap(resources: Any): resources is ResultLanguage[] {
    return resources.length && isLanguage(resources[0]);
  }

  map(Languages: ResultLanguage[]): string {
    return Languages.map(t => t.refName).join(',');
  }
}
