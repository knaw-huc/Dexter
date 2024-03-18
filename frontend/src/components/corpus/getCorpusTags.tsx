import { Corpus, ResultTag } from '../../model/DexterModel';
import _ from 'lodash';

export function getCorpusTags(subcorpus: Corpus): ResultTag[] {
  const all = [
    ...subcorpus.tags,
    ...subcorpus.sources.flatMap(s => s.tags),
    ...subcorpus.subcorpora.flatMap(getCorpusTags),
  ];
  return _.uniqBy(all, 'id');
}
