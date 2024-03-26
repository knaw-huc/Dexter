import { ButtonWithIcon } from './ButtonWithIcon';
import React from 'react';
import { CreateIconStyled } from './CreateIconStyled';
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
      <CreateIconStyled />
      {props.title || 'New'}
    </ButtonWithIcon>
  );
}
