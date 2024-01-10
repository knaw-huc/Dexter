import styled from "@emotion/styled"
import {red} from "@mui/material/colors"
import React from "react"
import {ServerKeyword, ServerSource} from "../../model/DexterModel"
import {HeaderLinkClamped} from "../common/HeaderLinkClamped"
import {styleInlineIcon} from "../../utils/styleInlineIcon"
import {useNavigate} from "react-router-dom"
import ClearIcon from "@mui/icons-material/Clear"
import {Card, CardContent, Grid} from "@mui/material"
import {PClamped} from "../common/PClamped"
import {KeywordList} from "../keyword/KeywordList"

interface SourceItemDropdownProps {
    onDeleteKeyword: (keyword: ServerKeyword) => void
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
            <Grid container>
                <Grid
                    item
                    sx={{height: "110px"}}
                >
                    <UnlinkInlineIcon
                        style={{float: "right", top: 0}}
                        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                            e.stopPropagation()
                            props.onUnlinkSource()
                        }}
                    />
                    <HeaderLinkClamped
                        onClick={() => navigate(`/sources/${props.source.id}`)}
                    >
                        {props.source.title}
                    </HeaderLinkClamped>
                    <PClamped>
                        {props.source.description}
                    </PClamped>
                </Grid>
                <Grid item>
                    <KeywordList
                        keywords={props.source.keywords}
                        onDelete={props.onDeleteKeyword}
                    />
                </Grid>
            </Grid>
        </CardContent>
    </Card>
}
