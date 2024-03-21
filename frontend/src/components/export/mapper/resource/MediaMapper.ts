import { isMedia, ResultMedia } from '../../../../model/DexterModel';
import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowMapper } from './Mapper';
import { appendCell } from '../ExportUtils';

export class MediaMapper implements RowMapper<ResultMedia> {
  constructor(private keysToSkip: string[] = [], private name = 'media') {}

  canMap(resource: Any): resource is ResultMedia {
    return isMedia(resource);
  }

  map(media: ResultMedia): RowWithHeader {
    const result = new RowWithHeader();
    let key: keyof ResultMedia;
    for (key in media) {
      if (this.keysToSkip.includes(key)) {
        continue;
      }
      const field = media[key];
      switch (key) {
        default:
          appendCell(result, key, field);
      }
    }
    return result;
  }
}
