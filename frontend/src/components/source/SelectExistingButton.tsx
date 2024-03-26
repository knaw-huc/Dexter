import { ButtonWithIcon } from '../common/icon/ButtonWithIcon';
import React from 'react';
import { LinkIcon } from '../common/icon/LinkIcon';

export function SelectExistingButton(props: {
  title?: string;
  onClick: () => void;
}) {
  return (
    <ButtonWithIcon variant="contained" onClick={props.onClick}>
      <LinkIcon />
      {props.title || 'Existing'}
    </ButtonWithIcon>
  );
}
