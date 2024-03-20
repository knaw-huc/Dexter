import { ResourceMapper } from './ResourceMapper';
import { Corpus, isCorpus } from '../../model/DexterModel';
import { Any } from '../common/Any';
import { ResourceResult } from './ResourceResult';
import { SourceMapper } from './SourceMapper';
import { ArrayMapper } from './ArrayMapper';

export class CorpusMapper implements ResourceMapper<Corpus> {
  name: string = 'corpus';

  public mappers: ResourceMapper<Any>[] = [
    new ArrayMapper('sources', new SourceMapper()),
  ];

  canMap(resource: Any): boolean {
    return isCorpus(resource);
  }

  map(corpus: Corpus): ResourceResult {
    const result = new ResourceResult(this.name);

    let key: keyof Corpus;
    for (key in corpus) {
      result.header.push(key);
      const field = corpus[key];
      result.row.push(`${field}`);
      const mapper = this.mappers.find(m => m.canMap(field));
      if (mapper) {
        const mapped = mapper.map(field);
        result.header.push(...mapped.header.map(prependName));
        result.row.push(...mapped.row);
        result.tables.push(...mapped.tables);
      }
    }
    return result;
  }
}

function prependName(columnHeader: string) {
  return `${this.name}.${columnHeader}`;
}
