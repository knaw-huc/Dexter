import { H2Styled } from '../common/H2Styled';
import { SourceIcon } from '../source/SourceIcon';
import { Grid } from '@mui/material';
import { AddNewButton } from '../common/AddNewButton';
import { SelectExistingButton } from '../source/SelectExistingButton';
import { TagsFilter } from '../tag/TagsFilter';
import _ from 'lodash';
import { SourcePreview } from '../source/SourcePreview';
import React from 'react';
import { ResultTag, Source } from '../../model/DexterModel';
import { useImmer } from 'use-immer';
import { SourceForm } from '../source/SourceForm';
import { addSourcesToCorpus, deleteSourceFromCorpus } from '../../utils/API';
import { SelectSourcesForm } from './SelectSourcesForm';
import { getAllRelevantTags } from './getAllRelevantTags';
import { useCorpusPageStore } from './CorpusPageStore';
import { push } from '../../utils/draft/push';
import { remove } from '../../utils/draft/remove';
import { reject } from '../../utils/reject';

export function CorpusSources() {
  const { corpus, setSources, allSources } = useCorpusPageStore();
  const corpusId = corpus.id;
  const sources = corpus.sources;
  const [filterTags, setFilterTags] = useImmer<ResultTag[]>([]);
  const [showSourceForm, setShowSourceForm] = useImmer(false);
  const [showSelectSourceForm, setShowSelectSourceForm] = useImmer(false);

  async function handleSavedSource(update: Source) {
    await addSourcesToCorpus(corpusId, [update.id]);
    setShowSourceForm(false);
    setSources(s => push(s, update));
  }

  const handleSelectSource = async (corpusId: string, sourceId: string) => {
    await addSourcesToCorpus(corpusId, [sourceId]);
    const toLink = allSources.find(s => s.id === sourceId);
    setSources(s => push(s, toLink));
  };

  const handleDeselectSource = async (corpusId: string, sourceId: string) => {
    if (reject('Remove this source from this corpus?')) {
      return;
    }

    await deleteSourceFromCorpus(corpusId, sourceId);
    setSources(s => remove(s, sourceId));
  };

  const hasSources = !_.isEmpty(sources);

  return (
    <>
      <H2Styled>
        <SourceIcon />
        Sources
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewButton onClick={() => setShowSourceForm(true)} />
          <SelectExistingButton onClick={() => setShowSelectSourceForm(true)} />
        </Grid>
        {hasSources && (
          <Grid item xs={6} md={8}>
            <TagsFilter
              placeholder="Filter sources by their tags"
              options={getAllRelevantTags(sources, filterTags)}
              selected={filterTags}
              onChangeSelected={update => setFilterTags(update)}
            />
          </Grid>
        )}
      </Grid>
      {hasSources && (
        <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
          {getFilteredSources(sources, filterTags).map(source => (
            <Grid item xs={4} key={source.id}>
              <SourcePreview
                source={source}
                onUnlink={() => handleDeselectSource(corpusId, source.id)}
              />
            </Grid>
          ))}
        </Grid>
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
          options={allSources}
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
