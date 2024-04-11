import React from 'react';
import { ResultMedia } from '../../model/DexterModel';
import { MediaPreview } from './MediaPreview';
import { MediaForm } from './MediaForm';
import { AddNewButton } from '../common/AddNewButton';
import { Grid } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { MediaIcon } from './MediaIcon';
import { useImmer } from 'use-immer';
import { HintedTitle } from '../common/HintedTitle';
import { reject } from '../../utils/reject';
import { useMedia } from '../../resources/useMedia';

export function MediaIndex() {
  const [showForm, setShowForm] = useImmer(false);
  const [mediaToEdit, setMediaToEdit] = useImmer<ResultMedia>(null);
  const { getMedia, deleteMedia } = useMedia();
  const media = getMedia();
  async function handleDelete(media: ResultMedia) {
    if (reject('Delete this media entry?')) {
      return;
    }

    await deleteMedia(media.id);
  }

  const handleEdit = (media: ResultMedia) => {
    setMediaToEdit(media);
    setShowForm(true);
  };

  function handleSaveMedia() {
    if (mediaToEdit) {
      setMediaToEdit(null);
    }
    setShowForm(false);
  }

  function handleCloseMedia() {
    setMediaToEdit(null);
    setShowForm(false);
  }

  if (!media) {
    return null;
  }
  return (
    <>
      <div>
        <HeaderBreadCrumb />

        <div style={{ float: 'right' }}>
          <AddNewButton onClick={() => setShowForm(true)} />
        </div>

        <h1>
          <MediaIcon />
          <HintedTitle title="Media" hint="mediaIndex" />
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
                onUnlink={() => handleDelete(media)}
                onEdit={() => handleEdit(media)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
