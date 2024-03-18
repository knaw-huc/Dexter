import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from '@emotion/styled';
import { styleButtonIcon } from '../../utils/styleButtonIcon';
import { ButtonWithIcon } from './ButtonWithIcon';

type DeleteIconStyledProps = {
  hoverColor?: string;
};
export const DeleteIconStyled = styled(styleButtonIcon(DeleteIcon))`
  font-size: 1.4em;

  &:hover {
    cursor: pointer;
    color: ${(props: DeleteIconStyledProps) =>
      props.hoverColor ? props.hoverColor : ''};
  }
`;

export function DeleteButton(props: { onDelete: () => void }) {
  return (
    <ButtonWithIcon
      color="error"
      variant="outlined"
      onClick={props.onDelete}
      style={{ float: 'right' }}
    >
      <DeleteIconStyled />
      Delete
    </ButtonWithIcon>
  );
}
