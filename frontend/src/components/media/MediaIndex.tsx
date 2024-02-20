import React, { useContext, useEffect, useState } from 'react';
import { image, ResultMedia } from '../../model/DexterModel';
import { MediaPreview } from './MediaPreview';
import { MediaForm } from './MediaForm';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { Grid } from '@mui/material';
import { errorContext } from '../../state/error/errorContext';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { getMedia } from '../../utils/API';

export function MediaIndex() {
  const [showForm, setShowForm] = React.useState(false);
  const [media, setMedia] = useState<ResultMedia[]>();
  const [isInit, setInit] = useState(false);
  const { dispatchError } = useContext(errorContext);
  const [mediaToEdit, setMediaToEdit] = React.useState<ResultMedia>(null);

  useEffect(() => {
    async function init() {
      try {
        // TODO: support multiple media types
        setMedia(await getMedia(image));
      } catch (e) {
        dispatchError(e);
      }
    }

    if (!isInit) {
      setInit(true);
      init();
    }
  }, [isInit]);

  const handleDelete = (media: ResultMedia) => {
    setMedia(prev => prev.filter(m => m.id !== media.id));
  };

  const handleEdit = (media: ResultMedia) => {
    setMediaToEdit(media);
    setShowForm(true);
  };

  function handleSaveMedia(media: ResultMedia) {
    if (mediaToEdit) {
      setMedia(prev => prev.map(m => (m.id === media.id ? media : m)));
      setMediaToEdit(null);
    } else {
      setMedia(prev => [...prev, media]);
    }
    setShowForm(false);
  }

  function handleCloseMedia() {
    setMediaToEdit(null);
    setShowForm(false);
  }

  return (
    <>
      <div>
        <HeaderBreadCrumb />

        <div style={{ float: 'right' }}>
          <AddNewResourceButton
            title="New media"
            onClick={() => setShowForm(true)}
          />
        </div>

        <h1>Media</h1>
      </div>
      {showForm && (
        <MediaForm
          onClose={handleCloseMedia}
          onSaved={handleSaveMedia}
          inEdit={mediaToEdit}
        />
      )}
      {media && (
        <Grid container spacing={2}>
          {media.map(media => (
            <Grid item key={media.id} xs={4}>
              <MediaPreview
                media={media}
                onDelete={() => handleDelete(media)}
                onEdit={() => handleEdit(media)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
