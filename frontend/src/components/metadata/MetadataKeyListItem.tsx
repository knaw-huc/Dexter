import { grey } from '@mui/material/colors';
import { ResultMetadataKey } from '../../model/DexterModel';
import { deleteMetadataKey } from '../../utils/API';
import React, { ChangeEvent } from 'react';
import { Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import { EditIcon } from '../common/icon/EditIcon';
import { DeleteIcon } from '../common/icon/DeleteIcon';
import { MetadataKeyIcon } from './MetadataKeyIcon';
import { ListItemButtonStyled } from '../common/ListItemButtonStyled';
import { useThrowSync } from '../common/error/useThrowSync';
import { isResponseError } from '../common/isResponseError';
import { reject } from '../../utils/reject';

type MetadataKeyItemProps = {
  metadataKey: ResultMetadataKey;
  onDeleted: () => void;
  onEditClick: () => void;
};

export const MetadataKeyListItem = (props: MetadataKeyItemProps) => {
  const throwSync = useThrowSync();

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (reject('Delete this metadata field?')) {
      return;
    }

    await deleteMetadataKey(props.metadataKey.id)
      .then(props.onDeleted)
      .catch(e => {
        const msg =
          'Could not delete metadata field: ' +
          (isResponseError(e) ? e.body.message : e.message);
        throwSync(Error(msg));
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
          <EditIcon hoverColor="black" onClick={handleEditClick} />
          <DeleteIcon onClick={handleDelete} />
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
