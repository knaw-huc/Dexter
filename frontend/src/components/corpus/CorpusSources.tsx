import { H2Styled } from '../common/H2Styled';
import { SourceIcon } from '../source/SourceIcon';
import { Grid } from '@mui/material';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from '../source/SelectExistingResourceButton';
import { TagsFilter } from '../tag/TagsFilter';
import _ from 'lodash';
import { SourcePreview } from '../source/SourcePreview';
import { NoResults } from '../common/NoResults';
import React, { useEffect } from 'react';
import { ResultTag, Source, UUID } from '../../model/DexterModel';
import { useImmer } from 'use-immer';
import { SourceForm } from '../source/SourceForm';
import { addSourcesToCorpus, deleteSourceFromCorpus } from '../../utils/API';
import { add } from '../../utils/immer/add';
import { SelectSourcesForm } from './SelectSourcesForm';
import { remove } from '../../utils/immer/remove';
import { getAllRelevantTags } from './getAllRelevantTags';

type CorpusSourcesProps = {
  corpusId: UUID;
  sources: Source[];
  options: Source[];
  onChanged: (sources: Source[]) => void;
};

export function CorpusSources(props: CorpusSourcesProps) {
  const { corpusId } = props;
  const [sources, setSources] = useImmer(props.sources);
  const [filterTags, setFilterTags] = useImmer<ResultTag[]>([]);
  const [showSourceForm, setShowSourceForm] = useImmer(false);
  const [showSelectSourceForm, setShowSelectSourceForm] = useImmer(false);

  useEffect(() => {
    props.onChanged(sources);
  }, [sources]);

  async function handleSavedSource(update: Source) {
    await addSourcesToCorpus(corpusId, [update.id]);
    setShowSourceForm(false);
    setSources(s => add(update, s));
  }

  const handleSelectSource = async (corpusId: string, sourceId: string) => {
    await addSourcesToCorpus(corpusId, [sourceId]);
    const toLink = props.options.find(s => s.id === sourceId);
    setSources(s => add(toLink, s));
    props.onChanged(sources);
  };

  const handleDeselectSource = async (corpusId: string, sourceId: string) => {
    const warning = window.confirm(
      'Are you sure you wish to remove this source from this corpus?',
    );

    if (warning === false) return;

    await deleteSourceFromCorpus(corpusId, sourceId);
    setSources(s => remove(sourceId, s));
    props.onChanged(sources);
  };

  return (
    <>
      <H2Styled>
        <SourceIcon />
        Sources
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton
            title="New source"
            onClick={() => setShowSourceForm(true)}
          />
          <SelectExistingResourceButton
            title="Existing source"
            onClick={() => setShowSelectSourceForm(true)}
          />
        </Grid>
        <Grid item xs={6} md={8}>
          <TagsFilter
            placeholder="Filter sources by their tags"
            options={getAllRelevantTags(props.sources, filterTags)}
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
                onUnlink={() => handleDeselectSource(corpusId, source.id)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoResults message="No sources" />
      )}
      {showSourceForm && (
        <SourceForm
          corpusId={corpusId}
          onClose={() => setShowSourceForm(false)}
          onSaved={handleSavedSource}
        />
      )}
      {showSelectSourceForm && (
        <SelectSourcesForm
          options={props.options}
          selected={sources}
          onSelectSource={sourceId => handleSelectSource(corpusId, sourceId)}
          onDeselectSource={sourceId =>
            handleDeselectSource(corpusId, sourceId)
          }
          onClose={() => setShowSelectSourceForm(false)}
        />
      )}
    </>
  );
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
