import { ButtonWithIcon } from '../common/ButtonWithIcon';
import React from 'react';
import { LinkIconStyled } from '../common/LinkIconStyled';

export function SelectExistingResourceButton(props: {
  title: string;
  onClick: () => void;
}) {
  return (
    <ButtonWithIcon variant="contained" onClick={props.onClick}>
      <LinkIconStyled />
      {props.title}
    </ButtonWithIcon>
  );
}
