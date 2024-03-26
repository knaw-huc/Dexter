import styled from '@emotion/styled';
import { default as MuiDeleteIcon } from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';

export const DeleteIcon = styled(MuiDeleteIcon)`
  margin-left: 5px;

  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`;
