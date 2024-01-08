import React from "react"
import CreateIcon from "@mui/icons-material/Create"
import styled from "@emotion/styled"
import {styleButtonIcon} from "../../utils/styleButtonIcon"
import {ButtonWithIcon} from "./ButtonWithIcon"

export const EditIconStyled = styled(styleButtonIcon(CreateIcon))`
  font-size: 1.4em;
`

export function EditButton(props: { onEdit: () => void }) {
    return <ButtonWithIcon variant="contained" onClick={props.onEdit}>
        <EditIconStyled/>
        Edit
    </ButtonWithIcon>
}