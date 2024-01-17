import React from "react"
import {ResourceIconProps, styleResourceIcon} from "../../utils/styleResourceIcon"
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined"

const CollectionsBookmarkOutlinedIconStyled = styleResourceIcon(CollectionsBookmarkOutlinedIcon)
export function CorpusIcon(props: ResourceIconProps) {
    return <CollectionsBookmarkOutlinedIconStyled
        {...props}
        fontSize={props.fontSize ? props.fontSize : "inherit"}
    />
}