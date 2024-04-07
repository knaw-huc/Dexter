import React from 'react';
import { Corpus } from '../../model/DexterModel';
import { CorpusPreview } from './CorpusPreview';
import { CorpusForm } from './CorpusForm';
import { Grid } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { CorpusIcon } from './CorpusIcon';
import { useImmer } from 'use-immer';
import { HintedTitle } from '../common/HintedTitle';
import { AddNewButton } from '../common/AddNewButton';
import { useCorpora } from '../../state/resources/hooks/useCorpora';
import { useSources } from '../../state/resources/hooks/useSources';

export function CorpusIndex() {
  const [showForm, setShowForm] = useImmer(false);

  const corpora = useCorpora().getCorpora();
  const sources = useSources().getSources();

  function handleSave() {
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
          sourceOptions={sources}
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
