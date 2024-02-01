import { grey } from '@mui/material/colors';
import { ResultMetadataKey } from '../../model/DexterModel';
import { deleteMetadataKey, toReadable } from '../../utils/API';
import React, { ChangeEvent } from 'react';
import { Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EditIconStyled } from '../common/EditButton';
import { DeleteIconStyled } from '../common/DeleteIconStyled';
import { MetadataKeyIcon } from './MetadataKeyIcon';
import { ListItemButtonStyled } from '../common/ListItemButtonStyled';
import { useAsyncError } from '../../utils/useAsyncError';

type MetadataKeyItemProps = {
  metadataKey: ResultMetadataKey;
  onDeleted: () => void;
  onEditClick: () => void;
};

export const MetadataKeyListItem = (props: MetadataKeyItemProps) => {
  const throwError = useAsyncError();

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    const warning = window.confirm(
      'Are you sure you wish to delete this metadata field?',
    );

    if (warning === false) return;

    await deleteMetadataKey(props.metadataKey.id)
      .then(props.onDeleted)
      .catch(async e => {
        throwError(await toReadable('Could not delete field', e));
      });
  }

  function handleEditClick(e: ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();
    props.onEditClick();
  }

  return (
    <ListItemButtonStyled
      onClick={props.onEditClick}
      secondaryAction={
        <span style={{ color: grey[500] }}>
          <EditIconStyled hoverColor="black" onClick={handleEditClick} />
          <DeleteIconStyled onClick={handleDelete} />
        </span>
      }
      sx={{ ml: 0, pl: 0 }}
    >
      <ListItemAvatar sx={{ ml: '1em' }}>
        <Avatar>
          <MetadataKeyIcon iconColor="white" isInline={false} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText>{props.metadataKey.key}</ListItemText>
    </ListItemButtonStyled>
  );
};
