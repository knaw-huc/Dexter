import React from 'react';
import CreateIcon from '@mui/icons-material/Create';
import styled from '@emotion/styled';
import { styleButtonIcon } from '../../utils/styleButtonIcon';
import { ButtonWithIcon } from './ButtonWithIcon';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

type EditIconStyledProps = {
  hoverColor?: string;
};
export const EditIconStyled = styled(styleButtonIcon(CreateIcon))`
  font-size: 1.4em;

  &:hover {
    cursor: pointer;
    color: ${(props: EditIconStyledProps) =>
      props.hoverColor ? props.hoverColor : ''};
  }
`;

export function EditButton(props: { onEdit: () => void; sx?: SxProps<Theme> }) {
  return (
    <ButtonWithIcon
      variant="contained"
      onClick={props.onEdit}
      style={{ float: 'right' }}
      sx={props.sx}
    >
      <EditIconStyled />
      Edit
    </ButtonWithIcon>
  );
}
