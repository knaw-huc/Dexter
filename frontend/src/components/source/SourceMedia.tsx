import { H2Styled } from '../common/H2Styled';
import { MediaIcon } from '../media/MediaIcon';
import { Grid } from '@mui/material';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from './SelectExistingResourceButton';
import { MediaPreview } from '../media/MediaPreview';
import React from 'react';
import { ResultMedia } from '../../model/DexterModel';
import { MediaForm } from '../media/MediaForm';
import { SelectMediaForm } from './SelectMediaForm';
import { useImmer } from 'use-immer';
import { addMediaToSource, deleteMediaFromSource } from '../../utils/API';
import { remove } from '../../utils/immer/remove';
import { update } from '../../utils/immer/update';
import { add } from '../../utils/immer/add';
import { useSourcePageStore } from './SourcePageStore';
import { updateSourceMedia } from '../../utils/updateRemoteIds';

export function SourceMedia() {
  const { source, setSource } = useSourcePageStore();
  const sourceId = source.id;
  const media = source.media;

  const [showMediaForm, setShowMediaForm] = useImmer(false);
  const [showSelectMediaForm, setShowSelectMediaForm] = useImmer(null);
  const [mediaToEdit, setMediaToEdit] = useImmer(null);

  async function handleUnlinkMedia(media: ResultMedia) {
    await deleteMediaFromSource(sourceId, media.id);
    setSource(s => remove(s.media, media.id));
  }

  function handleClickEditMedia(media: ResultMedia) {
    setMediaToEdit(media);
    setShowMediaForm(true);
  }

  async function handleSavedMedia(media: ResultMedia) {
    if (mediaToEdit) {
      handleEditedMedia(media);
    } else {
      await addCreatedMedia(media);
    }
  }

  function handleEditedMedia(media: ResultMedia) {
    setSource(s => update(s.media, media));
    setMediaToEdit(null);
    setShowMediaForm(false);
  }

  async function addCreatedMedia(media: ResultMedia) {
    await addMediaToSource(sourceId, [media.id]);
    setSource(s => add(s.media, media));
    setShowMediaForm(false);
  }

  function handleCloseMedia() {
    setMediaToEdit(null);
    setShowMediaForm(false);
  }

  async function handleChangeSelectedMedia(media: ResultMedia[]) {
    await updateSourceMedia(sourceId, media);
    setSource(s => ({ ...s, media }));
  }

  return (
    <>
      <H2Styled>
        <MediaIcon />
        Media
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewResourceButton
            title="New media"
            onClick={() => setShowMediaForm(true)}
          />
          <SelectExistingResourceButton
            title="Existing media"
            onClick={() => setShowSelectMediaForm(true)}
          />
        </Grid>
        <Grid item xs={6} md={8}></Grid>
      </Grid>
      <Grid container spacing={2} sx={{ pl: 0.1, mt: 2, mb: 2 }}>
        {media.map(media => (
          <Grid item xs={4} key={media.id}>
            <MediaPreview
              media={media}
              onDelete={() => handleUnlinkMedia(media)}
              onEdit={() => handleClickEditMedia(media)}
            />
          </Grid>
        ))}
      </Grid>
      {showMediaForm && (
        <MediaForm
          onClose={handleCloseMedia}
          onSaved={handleSavedMedia}
          inEdit={mediaToEdit}
        />
      )}
      {showSelectMediaForm && (
        <SelectMediaForm
          selected={source.media}
          onChangeSelected={handleChangeSelectedMedia}
          onClose={() => setShowSelectMediaForm(false)}
        />
      )}
    </>
  );
}
