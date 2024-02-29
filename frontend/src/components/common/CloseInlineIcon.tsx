import { styleInlineIcon } from '../../utils/styleInlineIcon';
import ClearIcon from '@mui/icons-material/Clear';
import { grey } from '@mui/material/colors';
import styled from '@emotion/styled';

export const CloseInlineIcon = styled(styleInlineIcon(ClearIcon))`
  float: right;
  top: 0;
  margin-left: 5px;
  color: gray;

  &:hover {
    cursor: pointer;
    color: ${grey[700]};
  }
`;
