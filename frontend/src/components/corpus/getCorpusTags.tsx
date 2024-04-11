import _ from 'lodash';
import { Corpus } from '../../model/Corpus';
import { ResultTag } from '../../model/Tag';

export function getCorpusTags(subcorpus: Corpus): ResultTag[] {
  const all = [
    ...subcorpus.tags,
    ...subcorpus.sources.flatMap(s => s.tags),
    ...subcorpus.subcorpora.flatMap(getCorpusTags),
  ];
  return _.uniqBy(all, 'id');
}
