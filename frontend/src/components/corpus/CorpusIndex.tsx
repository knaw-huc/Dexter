import React, { useEffect } from 'react';
import { Corpus, Source } from '../../model/DexterModel';
import { CorpusPreview } from './CorpusPreview';
import { CorpusForm } from './CorpusForm';
import {
  getCorporaWithResources,
  getSourcesWithResources,
} from '../../utils/API';
import { Grid } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CorpusIcon } from './CorpusIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';
import { push } from '../../utils/immer/push';
import { HintedTitle } from '../common/HintedTitle';
import { AddNewButton } from '../common/AddNewButton';

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
    setCorpora(corpora => push(corpora, update));
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
          <AddNewButton onClick={() => setShowForm(true)} />
        </div>
        <h1>
          <CorpusIcon />
          <HintedTitle title="Corpora" hint="corpusIndex" />
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
