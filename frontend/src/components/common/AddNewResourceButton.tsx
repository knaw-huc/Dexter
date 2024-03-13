import { ButtonWithIcon } from './ButtonWithIcon';
import React from 'react';
import { CreateIconStyled } from './CreateIconStyled';

export function AddNewResourceButton(props: {
  title: string;
  onClick: () => void;
}) {
  return (
    <ButtonWithIcon
      variant="contained"
      style={{ marginRight: '10px' }}
      onClick={props.onClick}
    >
      <CreateIconStyled />
      {props.title}
    </ButtonWithIcon>
  );
}
