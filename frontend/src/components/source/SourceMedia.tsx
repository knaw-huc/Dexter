import { H2Styled } from '../common/H2Styled';
import { MediaIcon } from '../media/MediaIcon';
import { Grid } from '@mui/material';
import { AddNewResourceButton } from '../common/AddNewResourceButton';
import { SelectExistingResourceButton } from './SelectExistingResourceButton';
import { MediaPreview } from '../media/MediaPreview';
import React from 'react';
import { ResultMedia } from '../../model/DexterModel';

type SourceMediaProps = {
  media: ResultMedia[];
  onClickAddNew: () => void;
  onClickAddExisting: () => void;
  onUnlink: (media: ResultMedia) => void;
  onClickEdit: (media: ResultMedia) => void;
};

export function SourceMedia(props: SourceMediaProps) {
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
            onClick={props.onClickAddNew}
          />
          <SelectExistingResourceButton
            title="Existing media"
            onClick={props.onClickAddExisting}
          />
        </Grid>
        <Grid item xs={6} md={8}></Grid>
      </Grid>
      <Grid container spacing={2} sx={{ pl: 0.1, mt: 2, mb: 2 }}>
        {props.media.map(media => (
          <Grid item xs={2} key={media.id}>
            <MediaPreview
              media={media}
              onDelete={() => props.onUnlink(media)}
              onEdit={() => props.onClickEdit(media)}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
