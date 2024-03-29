import { styleButtonIcon } from '../../../utils/styleButtonIcon';
import { default as MuiCloseIcon } from '@mui/icons-material/Close';
import { styleHoverIcon } from '../../../utils/styleHoverIcon';
import styled from '@emotion/styled';
import { styleInlineIcon } from '../../../utils/styleInlineIcon';
import ClearIcon from '@mui/icons-material/Clear';
import { grey } from '@mui/material/colors';

export const CloseIcon = styleHoverIcon(styleButtonIcon(MuiCloseIcon));
export const TopRightCloseIcon = styled(styleInlineIcon(ClearIcon))`
  float: right;
  top: 0;
  margin-left: 5px;
  color: gray;

  &:hover {
    cursor: pointer;
    color: ${grey[700]};
  }
`;
