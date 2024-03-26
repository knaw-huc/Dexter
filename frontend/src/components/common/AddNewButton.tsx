import { ButtonWithIcon } from './icon/ButtonWithIcon';
import React from 'react';
import { CreateIcon } from './icon/CreateIcon';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export function AddNewButton(props: {
  title?: string;
  onClick: () => void;
  sx?: SxProps<Theme>;
}) {
  return (
    <ButtonWithIcon
      variant="contained"
      style={{ marginRight: '10px' }}
      onClick={props.onClick}
      sx={props.sx}
    >
      <CreateIcon />
      {props.title || 'New'}
    </ButtonWithIcon>
  );
}
