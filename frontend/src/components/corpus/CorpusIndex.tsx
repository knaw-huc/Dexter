import React, { useEffect } from 'react';
import { Corpus, Source } from '../../model/DexterModel';
import { CorpusPreview } from './CorpusPreview';
import { CorpusForm } from './CorpusForm';
import {
  getCorporaWithResources,
  getSourcesWithResources,
} from '../../utils/API';
import { AddIconStyled } from '../common/AddIconStyled';
import { ButtonWithIcon } from '../common/ButtonWithIcon';
import { Grid } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CorpusIcon } from './CorpusIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';
import { add } from '../../utils/immer/add';

export function CorpusIndex() {
  const [corpora, setCorpora] = useImmer<Corpus[]>([]);
  const [showForm, setShowForm] = useImmer(false);
  const [sourceOptions, setSourceOptions] = useImmer<Source[]>([]);
  const throwSync = useThrowSync();

  useEffect(() => {
    init();

    async function init() {
      try {
        setCorpora(await getCorporaWithResources());
        setSourceOptions(await getSourcesWithResources());
      } catch (e) {
        throwSync(e);
      }
    }
  }, []);

  function handleSave(update: Corpus) {
    setCorpora(corpora => add(update, corpora));
    setShowForm(false);
  }

  if (!corpora) {
    return null;
  }
  return (
    <>
      <div>
        <HeaderBreadCrumb></HeaderBreadCrumb>

        <div style={{ float: 'right' }}>
          <ButtonWithIcon variant="contained" onClick={() => setShowForm(true)}>
            <AddIconStyled />
            Corpus
          </ButtonWithIcon>
        </div>
        <h1>
          <CorpusIcon />
          Corpora
        </h1>
      </div>
      {showForm && (
        <CorpusForm
          parentOptions={corpora}
          sourceOptions={sourceOptions}
          onSaved={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
      {corpora && (
        <Grid container spacing={2} sx={{ pl: 0.1, pr: 1, mt: 2, mb: 2 }}>
          {corpora.map((corpus: Corpus, index: number) => (
            <Grid item xs={4} key={index}>
              <CorpusPreview corpus={corpus} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
