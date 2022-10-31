import React from "react"
import { ServerLanguage } from "../../Model/DexterModel"
import DeleteIcon from "@mui/icons-material/Delete"
import styled from "@emotion/styled"
import { red } from "@mui/material/colors"

type LanguagesContentProps = {
    languages: ServerLanguage[],
    onDelete: (language: ServerLanguage) => Promise<void>
}

const DeleteIconStyled = styled(DeleteIcon)`
    margin-left: 5px;
    color: gray;
    &:hover {
        cursor: pointer;
        color: ${red[700]};
    }
`

export const LanguagesContent = (props: LanguagesContentProps) => {
    return (
        <>
            {props.languages.map((language, index) => {
                return <p key={index}>{language.refName} {<DeleteIconStyled onClick={() => props.onDelete(language)} />}</p>
            })}
        </>
    )
}