import React from "react"
import {ResourceIconProps, styleResourceIcon} from "../../utils/styleResourceIcon"
import TurnedInOutlinedIcon from "@mui/icons-material/TurnedInOutlined"

const TurnedInOutlinedIconStyled = styleResourceIcon(TurnedInOutlinedIcon)
export function SourceIcon(props: ResourceIconProps) {
    return <TurnedInOutlinedIconStyled
        {...props}
        fontSize={props.fontSize ? props.fontSize : "inherit"}
    />
}