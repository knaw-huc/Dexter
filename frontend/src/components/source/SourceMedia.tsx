import { H2Styled } from '../common/H2Styled';
import { MediaIcon } from '../media/MediaIcon';
import { Grid } from '@mui/material';
import { AddNewButton } from '../common/AddNewButton';
import { SelectExistingButton } from './SelectExistingButton';
import { MediaPreview } from '../media/MediaPreview';
import React from 'react';
import { MediaForm } from '../media/MediaForm';
import { SelectMediaForm } from './SelectMediaForm';
import { useImmer } from 'use-immer';
import _ from 'lodash';
import { cancel } from '../../utils/cancel';
import { useSources } from '../../resources/useSources';
import { ResultMedia } from '../../model/Media';
import { UUID } from '../../model/Id';

export function SourceMedia(props: { sourceId: UUID }) {
  const {
    deleteMediaFromSource,
    updateSourceMedia,
    addMediaToSource,
    getSource,
  } = useSources();

  const sourceId = props.sourceId;
  const source = getSource(sourceId);
  const media = source.media;

  const [showMediaForm, setShowMediaForm] = useImmer(false);
  const [showSelectMediaForm, setShowSelectMediaForm] = useImmer(null);
  const [mediaToEdit, setMediaToEdit] = useImmer(null);

  async function handleUnlinkMedia(media: ResultMedia) {
    if (cancel('Remove this media from this source?')) {
      return;
    }

    await deleteMediaFromSource(sourceId, media.id);
  }

  function handleClickEditMedia(media: ResultMedia) {
    setMediaToEdit(media);
    setShowMediaForm(true);
  }

  async function handleSavedMedia(media: ResultMedia) {
    if (mediaToEdit) {
      handleEditedMedia();
    } else {
      await addCreatedMedia(media);
    }
  }

  function handleEditedMedia() {
    setMediaToEdit(null);
    setShowMediaForm(false);
  }

  async function addCreatedMedia(media: ResultMedia) {
    await addMediaToSource(sourceId, [media.id]);
    setShowMediaForm(false);
  }

  function handleCloseMedia() {
    setMediaToEdit(null);
    setShowMediaForm(false);
  }

  async function handleChangeSelectedMedia(media: ResultMedia[]) {
    await updateSourceMedia(sourceId, media);
  }

  const hasMedia = !_.isEmpty(media);

  return (
    <>
      <H2Styled>
        <MediaIcon />
        Media
      </H2Styled>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4}>
          <AddNewButton onClick={() => setShowMediaForm(true)} />
          <SelectExistingButton onClick={() => setShowSelectMediaForm(true)} />
        </Grid>
        <Grid item xs={6} md={8}></Grid>
      </Grid>
      {hasMedia && (
        <Grid container spacing={2} sx={{ pl: 0.1, mt: 2, mb: 2 }}>
          {media.map(media => (
            <Grid item xs={4} key={media.id}>
              <MediaPreview
                media={media}
                onUnlink={() => handleUnlinkMedia(media)}
                onEdit={() => handleClickEditMedia(media)}
              />
            </Grid>
          ))}
        </Grid>
      )}
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
