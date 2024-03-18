import { H2Styled } from '../common/H2Styled';
import { CorpusIcon } from './CorpusIcon';
import { Grid } from '@mui/material';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from '../source/SelectExistingResourceButton';
import { TagsFilter } from '../tag/TagsFilter';
import { CorpusPreview } from './CorpusPreview';
import React from 'react';
import { Corpus, ResultTag } from '../../model/DexterModel';
import _ from 'lodash';
import { useImmer } from 'use-immer';

type CorpusSubcorporaProps = {
  subcorpora: Corpus[];
  onAddNew: () => void;
  onAddExisting: () => void;
  onDeleted: (corpus: Corpus) => void;
};
export function CorpusSubcorpora(props: CorpusSubcorporaProps) {
  const [filterTags, setFilterTags] = useImmer<ResultTag[]>([]);

  return (
    <>
      <H2Styled>
        <CorpusIcon />
        Subcorpora
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton title="New corpus" onClick={props.onAddNew} />
          <SelectExistingResourceButton
            title="Existing corpus"
            onClick={props.onAddExisting}
          />
        </Grid>
        <Grid item xs={6} md={8}>
          <TagsFilter
            placeholder="Filter corpora by their tags, plus the tags of their subcorpora and sources "
            options={props.subcorpora.flatMap(getCorpusTags)}
            selected={filterTags}
            onChangeSelected={update => setFilterTags(update)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
        {getFilteredSubcorpora(props.subcorpora, filterTags).map(c => (
          <Grid item xs={4} key={c.id}>
            <CorpusPreview corpus={c} onDeleted={() => props.onDeleted(c)} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function getCorpusTags(subcorpus: Corpus): ResultTag[] {
  const all = [
    ...subcorpus.tags,
    ...subcorpus.sources.flatMap(s => s.tags),
    ...subcorpus.subcorpora.flatMap(getCorpusTags),
  ];
  return _.uniqBy(all, 'id');
}
function getFilteredSubcorpora(
  subcorpora: Corpus[],
  tags: ResultTag[],
): Corpus[] {
  if (!subcorpora) {
    return [];
  }
  if (!tags.length) {
    return subcorpora;
  }
  return subcorpora.filter(subcorpus => {
    const subcorpusTags = getCorpusTags(subcorpus);
    return tags.every(ft => subcorpusTags.find(cst => cst.id === ft.id));
  });
}
