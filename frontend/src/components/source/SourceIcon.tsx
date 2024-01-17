import React from "react"
import {ResourceIconProps, styleResourceIcon} from "../../utils/styleResourceIcon"
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined"
import TurnedInOutlinedIcon from "@mui/icons-material/TurnedInOutlined"

const BookmarkBorderOutlinedIconStyled = styleResourceIcon(BookmarkBorderOutlinedIcon)
const TurnedInOutlinedIconStyled = styleResourceIcon(TurnedInOutlinedIcon)

type SourceIconprops = ResourceIconProps & {
    filled?: boolean
}

export function SourceIcon(props: SourceIconprops) {
    const iconProps = {
        ...props,
        fontSize: props.fontSize ? props.fontSize : "inherit"
    };
    return props.filled ? <TurnedInOutlinedIconStyled
        {...iconProps}
    /> : <BookmarkBorderOutlinedIconStyled
        {...iconProps}
    />
}