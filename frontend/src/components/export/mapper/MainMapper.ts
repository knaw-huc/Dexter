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
import { mergeTables } from './ExportUtils';
import { ReferenceMapper } from './resource/ReferenceMapper';
import { ReferenceFormatter } from './resource/ReferenceFormatter';
import { PrimitiveMapper } from './resource/PrimitiveMapper';

export class MainMapper implements TablesMapper<WithId> {
  name: string;

  private mappers: Record<string, RowWithChildTablesMapper<WithId>> = {};

  constructor(keys: string[]) {
    const primitiveMapper = new PrimitiveMapper();
    const mediaItemMapper = new MediaMapper(primitiveMapper, [
      'createdBy',
      'mediaType',
    ]);
    const mediaListMapper = new ArrayMapper(mediaItemMapper);
    const metadataValuesMapper = new MetadataValuesMapper(keys);
    const tagsMapper = new TagsMapper();
    const languagesMapper = new LanguagesMapper();
    const referenceMapper = new ReferenceMapper(
      new ReferenceFormatter(),
      primitiveMapper,
    );
    const referencesMapper = new ArrayMapper(referenceMapper);
    const sourceMapper = new SourceMapper(
      tagsMapper,
      languagesMapper,
      metadataValuesMapper,
      mediaListMapper,
      referencesMapper,
      primitiveMapper,
      ['corpora', 'createdBy'],
    );
    const sourcesMapper = new ArrayMapper(sourceMapper);

    const corpusMapper = new CorpusMapper(
      metadataValuesMapper,
      tagsMapper,
      languagesMapper,
      sourcesMapper,
      primitiveMapper,
      ['createdBy'],
    );

    this.mappers.corpus = corpusMapper;
  }

  public static async init() {
    const keys = await getMetadataKeys();
    return new MainMapper(keys.map(k => k.key));
  }

  canMap(resource: WithId): resource is WithId {
    return isWithId(resource);
  }

  map(resource: WithId): Table[] {
    const [name, mapper] = _.entries(this.mappers).find(([, mapper]) =>
      mapper.canMap(resource),
    );
    const mapped = mapper.map(resource, name);
    const allTables = [mapped, ...mapped.childTables];
    const groupedTables: Record<string, Table[]> = _.groupBy(
      allTables,
      t => t.name,
    );
    const merged = [];
    for (const toConcat of Object.values(groupedTables)) {
      const concat = mergeTables(toConcat);
      merged.push(concat);
    }

    return merged;
  }
}
