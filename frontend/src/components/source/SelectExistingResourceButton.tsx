import { ButtonWithIcon } from '../common/ButtonWithIcon';
import React from 'react';
import { AddIconStyled } from '../common/AddIconStyled';

export function SelectExistingResourceButton(props: {
  title: string;
  onClick: () => void;
}) {
  return (
    <ButtonWithIcon variant="contained" onClick={props.onClick}>
      <AddIconStyled />
      {props.title}
    </ButtonWithIcon>
  );
}
