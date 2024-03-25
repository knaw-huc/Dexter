import { isWithId, WithId } from '../../../model/DexterModel';
import { RowWithTablesMapper, TablesMapper } from './Mapper';
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
import { mergeTables } from './MapperUtils';
import { ReferenceMapper } from './resource/ReferenceMapper';
import { FormattedReferencemapper } from './resource/FormattedReferencemapper';
import { PrimitiveMapper } from './resource/PrimitiveMapper';
import { ParentMapper } from './resource/ParentMapper';

export class MainMapper implements TablesMapper<WithId> {
  name: string;

  private mappers: Record<string, RowWithTablesMapper<WithId>> = {};

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
      new FormattedReferencemapper(),
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
      ['id', 'title'],
    );
    const sourcesMapper = new ArrayMapper(sourceMapper);
    const parentMapper = new ParentMapper();
    const corpusMapper = new CorpusMapper(
      metadataValuesMapper,
      tagsMapper,
      languagesMapper,
      sourcesMapper,
      parentMapper,
      primitiveMapper,
      ['createdBy'],
      ['id', 'title'],
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
    const allTables = [mapped, ...mapped.tables];
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
