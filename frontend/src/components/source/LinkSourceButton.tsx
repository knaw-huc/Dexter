import {ButtonWithIcon} from "../common/ButtonWithIcon"
import React from "react"
import {AddIconStyled} from "../common/AddIconStyled"

export function LinkSourceButton(props: {onClick: () => void}) {
    return <ButtonWithIcon
        variant="contained"
        onClick={props.onClick}
    >
        <AddIconStyled />
        Existing source
    </ButtonWithIcon>
}
