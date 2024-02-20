import React, { useEffect, useState } from 'react';
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

export function MediaPage() {
  const [media, setMedia] = useState<ResultMedia>();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isInit, setInit] = useState(false);
  const params = useParams();

  const mediaId = params.mediaId;

  async function init(id: string) {
    setMedia(await getMediaEntry(id));
    setInit(true);
  }

  useEffect(() => {
    if (!isInit) {
      init(mediaId);
    }
  }, [mediaId]);

  function handleSaveMedia(media: ResultMedia) {
    setMedia(media);
    setShowForm(false);
  }

  function handleCloseMedia() {
    setShowForm(false);
  }

  if (!isInit) {
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
