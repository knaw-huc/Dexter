import styled from "@emotion/styled"
import {blue} from "@mui/material/colors"
import {clampedStyle} from "./PClamped"

export const HeaderLinkClamped = styled.h4`
  margin-top: 0;
  margin-bottom: 0;
  
  ${clampedStyle}
  
  &:hover {
    cursor: pointer;
    color: ${blue[700]};
  }
`;