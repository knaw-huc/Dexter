import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"
import {red} from "@mui/material/colors"

export const DeleteIconStyled = styled(DeleteIcon)`
  margin-left: 5px;

  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`
