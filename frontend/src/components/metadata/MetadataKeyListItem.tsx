import { grey } from '@mui/material/colors';
import { ResultMetadataKey } from '../../model/DexterModel';
import React, { ChangeEvent } from 'react';
import { Avatar, ListItemAvatar, ListItemText } from '@mui/material';
import { EditIcon } from '../common/icon/EditIcon';
import { DeleteIcon } from '../common/icon/DeleteIcon';
import { MetadataKeyIcon } from './MetadataKeyIcon';
import { ListItemButtonStyled } from '../common/ListItemButtonStyled';
import { reject } from '../../utils/reject';
import { useImmer } from 'use-immer';
import { ErrorAlert } from '../common/error/ErrorAlert';
import { toMessage } from '../common/error/toMessage';
import { useMetadata } from '../../resources/useMetadata';

type MetadataKeyItemProps = {
  metadataKey: ResultMetadataKey;
  onDeleted: () => void;
  onEditClick: () => void;
};

export const MetadataKeyListItem = (props: MetadataKeyItemProps) => {
  const [error, setError] = useImmer<Error>(null);
  const { deleteMetadataKey } = useMetadata();

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (reject('Delete this metadata field?')) {
      return;
    }

    await deleteMetadataKey(props.metadataKey.id)
      .then(props.onDeleted)
      .catch(setError);
  }

  function handleEditClick(e: ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();
    props.onEditClick();
  }

  return (
    <>
      {error && (
        <ErrorAlert
          message={toMessage(error)}
          sx={{ mb: 0 }}
          onClose={() => setError(null)}
        />
      )}
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
        <ListItemText>
          <p>{props.metadataKey.key}</p>
        </ListItemText>
      </ListItemButtonStyled>
    </>
  );
};
