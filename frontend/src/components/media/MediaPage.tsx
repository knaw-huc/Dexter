import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EditButton } from '../common/EditButton';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { MediaBreadCrumbLink } from './MediaBreadCrumbLink';
import { MediaIcon } from './MediaIcon';
import { getMediaEntry } from '../../utils/API';
import { ResultMedia } from '../../model/DexterModel';
import { MediaForm } from './MediaForm';
import { Grid } from '@mui/material';
import { Title } from './Title';

import { ExternalLink } from '../common/ExternalLink';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';

export function MediaPage() {
  const mediaId = useParams().mediaId;

  const [media, setMedia] = useImmer<ResultMedia>(null);
  const [showForm, setShowForm] = useImmer<boolean>(false);

  const throwSync = useThrowSync();

  useEffect(() => {
    getMediaEntry(mediaId).then(setMedia).catch(throwSync);
  }, []);

  function handleSaveMedia(media: ResultMedia) {
    setMedia(media);
    setShowForm(false);
  }

  function handleCloseMedia() {
    setShowForm(false);
  }

  if (!media) {
    return null;
  }
  return (
    <>
      <HeaderBreadCrumb>
        <MediaBreadCrumbLink />
      </HeaderBreadCrumb>

      <Grid container>
        <Grid item xs={12}>
          <EditButton onEdit={() => setShowForm(true)} />
          <h1 style={{ marginTop: 0 }}>
            <MediaIcon />
            <Title title={media.title} />
          </h1>
          <ExternalLink url={media.url} fieldName="External url" />
          <img src={media.url} alt={media.title} width="100%" />
        </Grid>
      </Grid>
      {showForm && (
        <MediaForm
          onClose={handleCloseMedia}
          onSaved={handleSaveMedia}
          inEdit={media}
        />
      )}
    </>
  );
}
