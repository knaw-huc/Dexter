import {ButtonWithIcon} from "../common/ButtonWithIcon"
import React from "react"
import {AddIconStyled} from "../common/AddIconStyled"

export function AddNewSourceButton(props: {onClick: () => void}) {
    return <ButtonWithIcon
        variant="contained"
        style={{marginRight: "10px"}}
        onClick={props.onClick}
    >
        <AddIconStyled/>
        New source
    </ButtonWithIcon>
}
