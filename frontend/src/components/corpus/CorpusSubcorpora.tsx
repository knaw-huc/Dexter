import { H2Styled } from '../common/H2Styled';
import { CorpusIcon } from './CorpusIcon';
import { Grid } from '@mui/material';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from '../source/SelectExistingResourceButton';
import { TagsFilter } from '../tag/TagsFilter';
import { CorpusPreview } from './CorpusPreview';
import React, { useEffect } from 'react';
import { Corpus, ResultTag, Source } from '../../model/DexterModel';
import { useImmer } from 'use-immer';
import { CorpusForm } from './CorpusForm';
import { SelectCorpusForm } from './SelectCorpusForm';
import { updateCorpus } from '../../utils/API';
import { remove } from '../../utils/immer/remove';
import { add } from '../../utils/immer/add';
import { isRelevantResource } from './getAllRelevantTags';
import { getCorpusTags } from './getCorpusTags';

type CorpusSubcorporaProps = {
  parent: Corpus;
  subcorpora: Corpus[];
  options: Corpus[];
  sourceOptions: Source[];
  onChanged: (subcorpora: Corpus[]) => void;
};

export function CorpusSubcorpora(props: CorpusSubcorporaProps) {
  const [filterTags, setFilterTags] = useImmer<ResultTag[]>([]);
  const [showSubcorpusForm, setShowSubcorpusForm] = useImmer(false);
  const [showSelectSubcorpusForm, setShowSelectSubcorpusForm] = useImmer(false);
  const [subcorpora, setSubcorpora] = useImmer(props.subcorpora);

  useEffect(() => {
    props.onChanged(subcorpora);
  }, [subcorpora]);

  const handleSavedSubcorpus = async (subcorpus: Corpus) => {
    subcorpus.parent = props.parent;
    await updateCorpus(subcorpus.id, {
      ...subcorpus,
      parentId: props.parent.id,
    });
    setSubcorpora(sc => add(subcorpus, sc));
    setShowSubcorpusForm(false);
  };

  const handleSelectSubcorpus = async (subcorpusId: string) => {
    const subcorpus = props.options.find(c => c.id === subcorpusId);
    subcorpus.parent = props.parent;
    await updateCorpus(subcorpusId, {
      ...subcorpus,
      parentId: subcorpus.parent.id,
    });
    setSubcorpora(sc => add(subcorpus, sc));
  };

  function handleCloseCorpusForm() {
    setShowSubcorpusForm(false);
  }

  const handleDeselectSubcorpus = async (subcorpusId: string) => {
    const warning = window.confirm(
      'Are you sure you wish to remove this subcorpus from this corpus?',
    );
    if (warning === false) return;

    const subcorpus = props.options.find(c => c.id === subcorpusId);
    delete subcorpus.parent;
    await updateCorpus(subcorpusId, subcorpus);
    setSubcorpora(c => remove(subcorpus.id, c));
  };

  function handleDeletedSubcorpus(subcorpus: Corpus) {
    setSubcorpora(c => remove(subcorpus.id, c));
  }

  /**
   * Find options that result in a non-empty list of corpora
   */
  function getRelevantTags(): ResultTag[] {
    const corpusNestedTags = props.subcorpora.map(sc => ({
      id: sc.id,
      tags: getCorpusTags(sc),
    }));
    const relevantCorpora = corpusNestedTags.filter(c =>
      isRelevantResource(c, filterTags),
    );
    return relevantCorpora.flatMap(c => c.tags);
  }

  return (
    <>
      <H2Styled>
        <CorpusIcon />
        Subcorpora
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton
            title="New corpus"
            onClick={() => setShowSubcorpusForm(true)}
          />
          <SelectExistingResourceButton
            title="Existing corpus"
            onClick={() => setShowSelectSubcorpusForm(true)}
          />
        </Grid>
        <Grid item xs={6} md={8}>
          <TagsFilter
            placeholder="Filter corpora by their tags, plus the tags of their subcorpora and sources "
            options={getRelevantTags()}
            selected={filterTags}
            onChangeSelected={update => setFilterTags(update)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
        {getFilteredSubcorpora(props.subcorpora, filterTags).map(c => (
          <Grid item xs={4} key={c.id}>
            <CorpusPreview
              corpus={c}
              onUnlink={() => handleDeletedSubcorpus(c)}
            />
          </Grid>
        ))}
      </Grid>

      {showSubcorpusForm && (
        <CorpusForm
          sourceOptions={props.sourceOptions}
          onClose={handleCloseCorpusForm}
          onSaved={handleSavedSubcorpus}
        />
      )}

      {showSelectSubcorpusForm && (
        <SelectCorpusForm
          label="Add subcorpora"
          options={props.options.filter(c => !c.parent)}
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
