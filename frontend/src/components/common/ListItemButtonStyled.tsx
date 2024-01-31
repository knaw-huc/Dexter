import {ListItem} from "@mui/material"
import {grey} from "@mui/material/colors"
import styled from "@emotion/styled"

export const ListItemButtonStyled = styled(ListItem)`
  &:nth-of-type(odd) {
    background-color: ${grey[50]};
  }

  &:nth-of-type(even) {
    background-color: white;
  }

  &:hover {
    cursor: pointer;
    background: ${grey[200]};
  }

`