import { Any } from '../../../common/Any';
import { RowWithHeader } from '../RowWithHeader';
import { RowMapper } from '../Mapper';
import { appendCell } from '../MapperUtils';
import { PrimitiveMapper } from './PrimitiveMapper';
import { isMedia, ResultMedia } from '../../../../model/Media';

export class MediaMapper implements RowMapper<ResultMedia> {
  constructor(
    private primitiveMapper: PrimitiveMapper,
    private keysToSkip: string[] = [],
  ) {}

  canMap(resource: Any): resource is ResultMedia {
    return isMedia(resource);
  }

  map(media: ResultMedia, rowName: string): RowWithHeader {
    const result = new RowWithHeader(rowName);
    let key: keyof ResultMedia;
    for (key in media) {
      if (this.keysToSkip.includes(key)) {
        continue;
      }
      const field = media[key];
      switch (key) {
        default:
          appendCell(result, key, field, this.primitiveMapper);
      }
    }
    return result;
  }
}
