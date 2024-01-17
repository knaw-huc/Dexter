import TurnedInOutlinedIcon from "@mui/icons-material/TurnedInOutlined"
import React from "react"
import styled from "@emotion/styled"
import {grey} from "@mui/material/colors"

type SourceIconProps = {
    iconColor?: string,
    fontSize?: "small" | "large" | "inherit"
    verticalAlign?: "middle" | "center"
}

const TurnedInOutlinedIconStyled = styled(TurnedInOutlinedIcon)`
  margin-right: 0.4em;
  color: ${(props: SourceIconProps) => props.iconColor};
  vertical-align: ${(props: SourceIconProps) => props.verticalAlign ? props.verticalAlign : 'center'}
`

export function SourceIcon(props: SourceIconProps) {
    return <TurnedInOutlinedIconStyled
        iconColor={props.iconColor ?? grey[500]}
        fontSize={props.fontSize ?? "inherit"}
        verticalAlign={props.verticalAlign ?? "center"}
    />
}