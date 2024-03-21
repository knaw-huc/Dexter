import { isWithId, WithId } from '../../model/DexterModel';
import { RowWithChildTablesMapper } from './Mapper';
import { CorpusMapper } from './CorpusMapper';
import { MetadataValuesMapper } from './MetadataValuesMapper';
import { getMetadataKeys } from '../../utils/API';
import { TagsMapper } from './TagsMapper';
import { LanguagesMapper } from './LanguagesMapper';
import { ArrayMapper } from './ArrayMapper';
import { ColumnPrefixer } from './PrefixMapper';
import { SourceMapper } from './SourceMapper';

export class MainMapper implements RowWithChildTablesMapper<WithId> {
  name: string;

  private mappers: RowWithChildTablesMapper<WithId>[];

  constructor(keys: string[]) {
    const metadataValuesMapper = new MetadataValuesMapper(keys);
    const tagsMappers = new TagsMapper();
    const languagesMapper = new LanguagesMapper();
    const corpusSourcesMapper = new ArrayMapper(
      new ColumnPrefixer(new SourceMapper(), 'corpus', ['id', 'title']),
      'sources',
    );
    const corpusMapper = new CorpusMapper(
      metadataValuesMapper,
      tagsMappers,
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

  map(resource: WithId) {
    return this.mappers.find(m => m.canMap(resource)).map(resource, 'export');
  }
}
