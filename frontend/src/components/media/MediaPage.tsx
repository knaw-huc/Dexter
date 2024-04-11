import React from 'react';
import { useParams } from 'react-router-dom';
import { EditButton } from '../common/EditButton';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { MediaBreadCrumbLink } from './MediaBreadCrumbLink';
import { MediaIcon } from './MediaIcon';
import { MediaForm } from './MediaForm';
import { Grid } from '@mui/material';

import { ExternalLink } from '../common/ExternalLink';
import { useImmer } from 'use-immer';
import { HintedTitle } from '../common/HintedTitle';
import { useMedia } from '../../resources/useMedia';

export function MediaPage() {
  const mediaId = useParams().mediaId;
  const { getMediaItem } = useMedia();
  const media = getMediaItem(mediaId);
  const [showForm, setShowForm] = useImmer<boolean>(false);

  function handleSaveMedia() {
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
            <HintedTitle title={media.title} hint="mediaPage" />
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
