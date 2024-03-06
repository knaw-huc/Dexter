import React, { useEffect, useState } from 'react';
import { image, ResultMedia } from '../../model/DexterModel';
import { MediaPreview } from './MediaPreview';
import { MediaForm } from './MediaForm';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { Grid } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { deleteMedia, getMedia } from '../../utils/API';
import { MediaIcon } from './MediaIcon';
import { useThrowSync } from '../common/error/useThrowSync';

export function MediaIndex() {
  const [showForm, setShowForm] = React.useState(false);
  const [media, setMedia] = useState<ResultMedia[]>();
  const [mediaToEdit, setMediaToEdit] = React.useState<ResultMedia>(null);

  const throwSync = useThrowSync();

  useEffect(() => {
    // TODO: support multiple media types
    getMedia(image)
      .then(media => setMedia(media))
      .catch(throwSync);
  }, []);

  async function handleDelete(media: ResultMedia) {
    const warning = window.confirm(
      'Are you sure you wish to delete this media entry?',
    );

    if (warning === false) return;

    await deleteMedia(media.id);
    setMedia(prev => prev.filter(m => m.id !== media.id));
  }

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

        <h1>
          <MediaIcon />
          Media
        </h1>
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
