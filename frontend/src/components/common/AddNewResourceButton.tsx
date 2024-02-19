import { ButtonWithIcon } from './ButtonWithIcon';
import React from 'react';
import { AddIconStyled } from './AddIconStyled';

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
      <AddIconStyled />
      {props.title}
    </ButtonWithIcon>
  );
}
