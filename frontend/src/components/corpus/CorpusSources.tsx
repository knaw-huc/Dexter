import { H2Styled } from '../common/H2Styled';
import { SourceIcon } from '../source/SourceIcon';
import { Grid } from '@mui/material';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from '../source/SelectExistingResourceButton';
import { TagsFilter } from '../tag/TagsFilter';
import _ from 'lodash';
import { SourcePreview } from '../source/SourcePreview';
import { NoResults } from '../common/NoResults';
import React from 'react';
import { ResultTag, Source } from '../../model/DexterModel';
import { useImmer } from 'use-immer';

type CorpusSourcesProps = {
  onUnlink: (source: Source) => void;
  sources: Source[];
  onAddExisting: () => void;
  onAddNew: () => void;
};
export function CorpusSources(props: CorpusSourcesProps) {
  const [filterTags, setFilterTags] = useImmer<ResultTag[]>([]);

  return (
    <>
      <H2Styled>
        <SourceIcon />
        Sources
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton title="New source" onClick={props.onAddNew} />
          <SelectExistingResourceButton
            title="Existing source"
            onClick={props.onAddExisting}
          />
        </Grid>
        <Grid item xs={6} md={8}>
          <TagsFilter
            placeholder="Filter sources by their tags"
            options={getAllSourceTags(props.sources)}
            selected={filterTags}
            onChangeSelected={update => setFilterTags(update)}
          />
        </Grid>
      </Grid>
      {!_.isEmpty(props.sources) ? (
        <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
          {getFilteredSources(props.sources, filterTags).map(source => (
            <Grid item xs={4} key={source.id}>
              <SourcePreview
                source={source}
                onUnlinkSource={() => props.onUnlink(source)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoResults message="No sources" />
      )}
    </>
  );
}

function getAllSourceTags(sources: Source[]) {
  return _.uniqBy(sources.map(s => s.tags).flat(), 'id');
}

function getFilteredSources(sources: Source[], tags: ResultTag[]): Source[] {
  if (!sources) {
    return [];
  }
  if (!tags.length) {
    return sources;
  }
  return sources.filter(cs =>
    tags.every(ft => cs.tags.find(cst => cst.id === ft.id)),
  );
}
