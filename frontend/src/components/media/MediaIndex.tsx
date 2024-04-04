import React, { useEffect } from 'react';
import { image, ResultMedia } from '../../model/DexterModel';
import { MediaPreview } from './MediaPreview';
import { MediaForm } from './MediaForm';
import { AddNewButton } from '../common/AddNewButton';
import { Grid } from '@mui/material';
import { HeaderBreadCrumb } from '../common/breadcrumb/HeaderBreadCrumb';
import { deleteMedia, getMedia } from '../../utils/API';
import { MediaIcon } from './MediaIcon';
import { useThrowSync } from '../common/error/useThrowSync';
import { useImmer } from 'use-immer';
import { remove } from '../../utils/recipe/remove';
import { replace } from '../../utils/recipe/replace';
import { push } from '../../utils/recipe/push';
import { HintedTitle } from '../common/HintedTitle';
import { reject } from '../../utils/reject';

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
    if (reject('Delete this media entry?')) {
      return;
    }

    await deleteMedia(media.id);
    setMedia(prev => remove(prev, media.id));
  }

  const handleEdit = (media: ResultMedia) => {
    setMediaToEdit(media);
    setShowForm(true);
  };

  function handleSaveMedia(media: ResultMedia) {
    if (mediaToEdit) {
      setMedia(prev => replace(prev, media));
      setMediaToEdit(null);
    } else {
      setMedia(prev => push(prev, media));
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
