import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { styleButtonIcon } from '../../utils/styleButtonIcon';
import { ButtonWithIcon } from './icon/ButtonWithIcon';

export const DeleteIconStyled = styleButtonIcon(DeleteIcon);

export function DeleteButton(props: { onDelete: () => void }) {
  return (
    <ButtonWithIcon
      color="error"
      variant="outlined"
      onClick={props.onDelete}
      style={{ float: 'right' }}
    >
      <DeleteIconStyled />
      Delete
    </ButtonWithIcon>
  );
}
