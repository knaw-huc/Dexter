import styled from "@emotion/styled"
import {red} from "@mui/material/colors"
import React from "react"
import {ServerSource} from "../../model/DexterModel"
import {HeaderLink} from "../common/HeaderLink"
import {styleInlineIcon} from "../../utils/styleInlineIcon"
import {useNavigate} from "react-router-dom"
import ClearIcon from "@mui/icons-material/Clear"
import {Card, CardContent} from "@mui/material"

interface SourceItemDropdownProps {
    source: ServerSource;
    corpusId: string;
    onUnlinkSource: () => void
}

const UnlinkInlineIcon = styled(styleInlineIcon(ClearIcon))`
  margin-left: 5px;
  color: gray;

  &:hover {
    cursor: pointer;
    color: ${red[700]};
  }
`

export const SourcePreview = (props: SourceItemDropdownProps) => {
    const navigate = useNavigate()

    return <Card
        style={{height: "100%"}}
    >
        <CardContent
            style={{height: "100%"}}
        >
            <UnlinkInlineIcon
                style={{float: "right", top: 0}}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    e.stopPropagation()
                    props.onUnlinkSource()
                }}
            />
            <HeaderLink
                onClick={() => navigate(`/sources/${props.source.id}`)}
            >
                {props.source.title}
            </HeaderLink>
            <p>{props.source.description}</p>
        </CardContent>
    </Card>
}
