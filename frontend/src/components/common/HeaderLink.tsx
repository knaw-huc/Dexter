import styled from "@emotion/styled"
import {blue} from "@mui/material/colors"

export const HeaderLink = styled.h4`
  margin-top: 0;
  margin-bottom: 0;

  &:hover {
    cursor: pointer;
    color: ${blue[700]};
  }
`;