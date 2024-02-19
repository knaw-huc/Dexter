import { grey } from '@mui/material/colors';
import { ResultMedia } from '../../model/DexterModel';
import { deleteMedia } from '../../utils/API';
import React from 'react';
import { Card, CardActions, CardMedia, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EditIconStyled } from '../common/EditButton';
import { DeleteIconStyled } from '../common/DeleteIconStyled';

type MediaItemProps = {
  media: ResultMedia;
  onDelete: () => void;
  onEdit: () => void;
};

export const MediaCard = (props: MediaItemProps) => {
  const navigate = useNavigate();

  function handleSelect() {
    navigate(`/media/${props.media.id}`);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    const warning = window.confirm(
      'Are you sure you wish to delete this media entry?',
    );

    if (warning === false) return;

    deleteMedia(props.media.id).then(() => props.onDelete());
    props.onDelete();
  }

  function handleEdit(e: MouseEvent) {
    e.stopPropagation();
    props.onEdit();
  }

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{
            height: 140,
            cursor: 'pointer',
          }}
          image={props.media.url}
          title={props.media.title}
          onClick={handleSelect}
        />
        <CardActions>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <Typography gutterBottom variant="h5">
                {props.media.title}
              </Typography>
            </Grid>
            <Grid
              item
              xs={3}
              alignItems="stretch"
              style={{ display: 'flex', marginTop: '0.25em' }}
            >
              <span style={{ color: grey[500] }}>
                <EditIconStyled hoverColor="black" onClick={handleEdit} />
                <DeleteIconStyled onClick={handleDelete} />
              </span>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};