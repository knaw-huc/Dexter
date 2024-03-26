import React from 'react';
import { ButtonWithIcon } from './icon/ButtonWithIcon';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

import { EditIcon } from './icon/EditIcon';

export function EditButton(props: { onEdit: () => void; sx?: SxProps<Theme> }) {
  return (
    <ButtonWithIcon
      variant="contained"
      onClick={props.onEdit}
      style={{ float: 'right' }}
      sx={props.sx}
    >
      <EditIcon color="white" hoverColor="white" />
      Edit
    </ButtonWithIcon>
  );
}
