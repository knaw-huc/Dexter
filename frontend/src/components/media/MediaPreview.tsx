import { ResultMedia } from '../../model/DexterModel';
import React from 'react';
import { Card, CardActions, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EditIcon } from '../common/icon/EditIcon';
import { Title } from './Title';
import { CloseIcon } from '../common/icon/CloseIcon';

type MediaItemProps = {
  media: ResultMedia;
  onUnlink: () => void;
  onEdit: () => void;
};

export const MediaPreview = (props: MediaItemProps) => {
  const navigate = useNavigate();

  function handleSelect() {
    navigate(`/media/${props.media.id}`);
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
        <CardActions sx={{ alignItems: 'initial' }}>
          <Typography
            className="clickable"
            onClick={handleSelect}
            gutterBottom
            variant="h5"
            sx={{ ml: '0.25em' }}
          >
            <Title title={props.media.title} />
          </Typography>
          <span
            style={{
              fontSize: '1em',
              minWidth: '4em',
              marginLeft: 'auto',
              marginTop: '0.5em',
              marginRight: '0.25em',
            }}
          >
            <CloseIcon
              onClick={props.onUnlink}
              style={{ margin: '0', float: 'right' }}
            />
            <EditIcon
              onClick={handleEdit}
              style={{ margin: '0 0.1em 0', float: 'right' }}
            />
          </span>
        </CardActions>
      </Card>
    </>
  );
};
