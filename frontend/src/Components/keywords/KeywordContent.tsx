import React from "react"
import { ServerKeyword } from "../../Model/DexterModel"
import DeleteIcon from "@mui/icons-material/Delete"
import styled from "@emotion/styled"
import { red } from "@mui/material/colors"

type KeywordContentProps = {
    keywords: ServerKeyword[],
    onDelete: (keyword: ServerKeyword) => Promise<void>
}

const DeleteIconStyled = styled(DeleteIcon)`
    margin-left: 5px;
    color: gray;
    &:hover {
        cursor: pointer;
        color: ${red[700]};
    }
`

export const KeywordContent = (props: KeywordContentProps) => {

    return (
        <>
            {props.keywords.map((keyword, index) => {
                return <p key={index}>{keyword.val} {<DeleteIconStyled onClick={() => props.onDelete(keyword)} />}</p>
            })}
        </>
    )
}