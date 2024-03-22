import { isWithId, WithId } from '../../../model/DexterModel';
import { RowWithChildTablesMapper, TablesMapper } from './resource/Mapper';
import { CorpusMapper } from './resource/CorpusMapper';
import { MetadataValuesMapper } from './resource/MetadataValuesMapper';
import { getMetadataKeys } from '../../../utils/API';
import { TagsMapper } from './resource/TagsMapper';
import { LanguagesMapper } from './resource/LanguagesMapper';
import { ArrayMapper } from './resource/ArrayMapper';
import { SourceMapper } from './resource/SourceMapper';
import { MediaMapper } from './resource/MediaMapper';
import _ from 'lodash';
import { Table } from './Table';
import { concatTables } from './ExportUtils';
import { ReferenceMapper } from './resource/ReferenceMapper';
import { ReferenceFormatter } from './resource/ReferenceFormatter';

export class MainMapper implements TablesMapper<WithId> {
  name: string;

  private mappers: RowWithChildTablesMapper<WithId>[];

  constructor(keys: string[]) {
    const mediaItemMapper = new MediaMapper();
    const mediaListMapper = new ArrayMapper(mediaItemMapper, 'media');
    const metadataValuesMapper = new MetadataValuesMapper(keys);
    const tagsMapper = new TagsMapper();
    const languagesMapper = new LanguagesMapper();
    const referenceMapper = new ReferenceMapper(new ReferenceFormatter());
    const referencesMapper = new ArrayMapper(referenceMapper, 'references');
    const sourceMapper = new SourceMapper(
      'source',
      tagsMapper,
      languagesMapper,
      metadataValuesMapper,
      mediaListMapper,
      referencesMapper,
      ['corpora'],
    );
    const corpusSourcesMapper = new ArrayMapper(sourceMapper, 'sources');
    const corpusMapper = new CorpusMapper(
      metadataValuesMapper,
      tagsMapper,
      languagesMapper,
      corpusSourcesMapper,
    );
    this.mappers = [corpusMapper];
  }

  public static async init() {
    const keys = await getMetadataKeys();
    return new MainMapper(keys.map(k => k.key));
  }

  canMap(resource: WithId): resource is WithId {
    return isWithId(resource);
  }

  map(resource: WithId): Table[] {
    const mapped = this.mappers
      .find(m => m.canMap(resource))
      .map(resource, 'export');
    const groupedTables: Record<string, Table[]> = _.groupBy(
      mapped.tables,
      t => t.name,
    );
    mapped.tables = [];
    for (const toConcat of Object.values(groupedTables)) {
      const concat = concatTables(toConcat);
      mapped.tables.push(concat);
    }

    return [mapped, ...mapped.tables];
  }
}
