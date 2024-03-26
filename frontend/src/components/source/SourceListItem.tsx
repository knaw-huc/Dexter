import { grey } from '@mui/material/colors';
import { isImage, Source } from '../../model/DexterModel';
import React from 'react';
import { Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EditIcon } from '../common/icon/EditIcon';
import { DeleteIcon } from '../common/icon/DeleteIcon';
import { SourceIcon } from './SourceIcon';
import { ListItemButtonStyled } from '../common/ListItemButtonStyled';
import { sources } from '../../model/Resources';

type SourceListItemProps = {
  source: Source;
  onDelete: () => void;
  onEdit: () => void;
};

export const SourceListItem = (props: SourceListItemProps) => {
  const navigate = useNavigate();

  function handleSelect() {
    navigate(`/${sources}/${props.source.id}`);
  }

  function handleDeleted(e: React.MouseEvent) {
    e.stopPropagation();
    props.onDelete();
  }

  function handleEdit(e: MouseEvent) {
    e.stopPropagation();
    props.onEdit();
  }

  const img = props.source.media.find(m => isImage(m.mediaType));

  return (
    <ListItemButtonStyled
      onClick={handleSelect}
      secondaryAction={
        <span style={{ color: grey[500] }}>
          <EditIcon hoverColor="black" onClick={handleEdit} />
          <DeleteIcon onClick={handleDeleted} />
        </span>
      }
      sx={{ ml: 0, pl: 0 }}
    >
      <ListItemAvatar sx={{ ml: '1em' }}>
        {img ? (
          <Avatar src={img.url} />
        ) : (
          <Avatar>
            <SourceIcon iconColor="white" isInline={false} filled={true} />
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText>{props.source.title}</ListItemText>
    </ListItemButtonStyled>
  );
};
