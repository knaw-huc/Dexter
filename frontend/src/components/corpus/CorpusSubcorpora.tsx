import { H2Styled } from '../common/H2Styled';
import { CorpusIcon } from './CorpusIcon';
import { Grid } from '@mui/material';
import { AddNewButton } from '../common/AddNewButton';
import { SelectExistingButton } from '../source/SelectExistingButton';
import { TagsFilter } from '../tag/TagsFilter';
import { CorpusPreview } from './CorpusPreview';
import React from 'react';
import { useImmer } from 'use-immer';
import { CorpusForm } from './CorpusForm';
import { isRelevantResource } from './getAllRelevantTags';
import { getCorpusTags } from './getCorpusTags';
import _ from 'lodash';
import { cancel } from '../../utils/cancel';
import { SelectSubcorporaForm } from './SelectSubcorporaForm';
import { useCorpora } from '../../resources/useCorpora';
import { Corpus } from '../../model/Corpus';
import { ResultTag } from '../../model/Tag';
import { UUID } from '../../model/Id';

export function CorpusSubcorpora(props: { corpusId: UUID }) {
  const { getCorpus, updateCorpus, findCorpusOptions, findSourceOptions } =
    useCorpora();

  const corpus = getCorpus(props.corpusId);
  const [filterTags, setFilterTags] = useImmer<ResultTag[]>([]);
  const [showSubcorpusForm, setShowSubcorpusForm] = useImmer(false);
  const [showSelectSubcorpusForm, setShowSelectSubcorpusForm] = useImmer(false);

  const handleSavedSubcorpus = async () => {
    setShowSubcorpusForm(false);
  };

  const handleSelectSubcorpus = async (subcorpusId: string) => {
    const newSubcorpus = getCorpus(subcorpusId);
    await updateCorpus(subcorpusId, {
      ...newSubcorpus,
      parentId: corpus.id,
    });
  };

  function handleCloseCorpusForm() {
    setShowSubcorpusForm(false);
  }

  const handleDeselectSubcorpus = async (subcorpusId: string) => {
    if (cancel('Remove this subcorpus from this corpus?')) {
      return;
    }

    const subcorpus = corpus.subcorpora.find(c => c.id === subcorpusId);
    await updateCorpus(subcorpusId, { ...subcorpus, parentId: null });
  };

  /**
   * Find options that result in a non-empty list of corpora
   */
  function getRelevantTags(): ResultTag[] {
    const corpusNestedTags = corpus.subcorpora.map(sc => ({
      id: sc.id,
      tags: getCorpusTags(sc),
    }));
    const relevantCorpora = corpusNestedTags.filter(c =>
      isRelevantResource(c, filterTags),
    );
    return relevantCorpora.flatMap(c => c.tags);
  }

  const filteredSubcorpora = getFilteredSubcorpora(
    corpus.subcorpora,
    filterTags,
  );
  const hasCorpora = !_.isEmpty(corpus.subcorpora);

  return (
    <>
      <H2Styled>
        <CorpusIcon />
        Subcorpora
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewButton onClick={() => setShowSubcorpusForm(true)} />
          <SelectExistingButton
            onClick={() => setShowSelectSubcorpusForm(true)}
          />
        </Grid>
        {hasCorpora && (
          <Grid item xs={6} md={8}>
            <TagsFilter
              placeholder="Filter corpora by their tags, plus the tags of their subcorpora and sources "
              options={getRelevantTags()}
              selected={filterTags}
              onChangeSelected={update => setFilterTags(update)}
            />
          </Grid>
        )}
      </Grid>

      {hasCorpora && (
        <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
          {filteredSubcorpora.map(c => (
            <Grid item xs={4} key={c.id}>
              <CorpusPreview
                corpus={c}
                onUnlink={() => handleDeselectSubcorpus(c.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {showSubcorpusForm && (
        <CorpusForm
          fixedParentCorpus={corpus}
          sourceOptions={findSourceOptions(props.corpusId)}
          onClose={handleCloseCorpusForm}
          onSaved={handleSavedSubcorpus}
        />
      )}

      {showSelectSubcorpusForm && (
        <SelectSubcorporaForm
          options={findCorpusOptions(corpus.id)}
          selected={corpus.subcorpora}
          onSelectCorpus={handleSelectSubcorpus}
          onDeselectCorpus={handleDeselectSubcorpus}
          onClose={() => setShowSelectSubcorpusForm(false)}
        />
      )}
    </>
  );
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
