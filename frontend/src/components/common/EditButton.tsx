import React from 'react';
import { ButtonWithIcon } from './ButtonWithIcon';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

import { EditIconStyled } from './EditIconStyled';

export function EditButton(props: { onEdit: () => void; sx?: SxProps<Theme> }) {
  return (
    <ButtonWithIcon
      variant="contained"
      onClick={props.onEdit}
      style={{ float: 'right' }}
      sx={props.sx}
    >
      <EditIconStyled color="white" hoverColor="white" />
      Edit
    </ButtonWithIcon>
  );
}
