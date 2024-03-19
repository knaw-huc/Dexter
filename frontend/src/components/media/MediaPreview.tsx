import { grey } from '@mui/material/colors';
import { ResultMedia } from '../../model/DexterModel';
import React from 'react';
import { Card, CardActions, CardMedia, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EditIconStyled } from '../common/EditIconStyled';
import { DeleteIconStyled } from '../common/DeleteIconStyled';
import { Title } from './Title';
import { media } from '../../model/Resources';

type MediaItemProps = {
  media: ResultMedia;
  onDelete: () => void;
  onEdit: () => void;
};

export const MediaPreview = (props: MediaItemProps) => {
  const navigate = useNavigate();

  function handleSelect() {
    navigate(`/${media}/${props.media.id}`);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    props.onDelete();
  }

  function handleEdit(e: MouseEvent) {
    e.stopPropagation();
    props.onEdit();
  }

  return (
    <>
      <Card>
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
              <Typography gutterBottom variant="h5" sx={{ ml: '0.25em' }}>
                <Title title={props.media.title} />
              </Typography>
            </Grid>
            <Grid
              item
              xs={3}
              alignItems="stretch"
              style={{
                display: 'flex',
                marginTop: '0.25em',
                minWidth: '80px',
              }}
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
