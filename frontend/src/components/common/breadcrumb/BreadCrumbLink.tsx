import styled from "@emotion/styled"
import {Link} from "react-router-dom"
import {grey} from "@mui/material/colors"

export const BreadCrumbLink = styled(Link)`
  color: ${grey[700]};
  text-decoration: none;

  &:hover {
    color: ${grey[900]};
    text-decoration: underline;
  }
`