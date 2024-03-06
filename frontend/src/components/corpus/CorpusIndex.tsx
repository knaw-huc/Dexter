import React, { useEffect, useState } from 'react';
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

export function CorpusIndex() {
  const [corpora, setCorpora] = useState<Corpus[]>();
  const [showForm, setShowForm] = React.useState(false);
  const [sourceOptions, setSourceOptions] = useState<Source[]>();
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

  function handleDelete(corpus: Corpus) {
    setCorpora(corpora => corpora.filter(c => c.id !== corpus.id));
  }

  function handleSave(update: Corpus) {
    setCorpora(corpora => [...corpora, update]);
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
              <CorpusPreview
                corpus={corpus}
                onDeleted={() => handleDelete(corpus)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
