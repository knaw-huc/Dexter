import React, { useEffect } from 'react';
import { image, ResultMedia } from '../../model/DexterModel';
import { MediaPreview } from './MediaPreview';
import { MediaForm } from './MediaForm';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { Grid } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { deleteMedia, getMedia } from '../../utils/API';
import { MediaIcon } from './MediaIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';
import { remove } from '../../utils/immer/remove';
import { update } from '../../utils/immer/update';

export function MediaIndex() {
  const [media, setMedia] = useImmer<ResultMedia[]>([]);
  const [showForm, setShowForm] = useImmer(false);
  const [mediaToEdit, setMediaToEdit] = useImmer<ResultMedia>(null);

  const throwSync = useThrowSync();

  useEffect(() => {
    // TODO: support multiple media types
    getMedia(image).then(setMedia).catch(throwSync);
  }, []);

  async function handleDelete(media: ResultMedia) {
    const warning = window.confirm(
      'Are you sure you wish to delete this media entry?',
    );

    if (warning === false) return;

    await deleteMedia(media.id);
    setMedia(prev => remove(media.id, prev));
  }

  const handleEdit = (media: ResultMedia) => {
    setMediaToEdit(media);
    setShowForm(true);
  };

  function handleSaveMedia(media: ResultMedia) {
    if (mediaToEdit) {
      setMedia(prev => update(media, prev));
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

  if (!media) {
    return null;
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
