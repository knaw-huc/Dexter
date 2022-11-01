import React from "react"
import { ServerLanguage } from "../../Model/DexterModel"
import DeleteIcon from "@mui/icons-material/Delete"
import styled from "@emotion/styled"
import { red } from "@mui/material/colors"
import { getLanguagesCorpora, getLanguagesSources } from "../API"

type LanguagesContentProps = {
    sourceId?: string,
    corpusId?: string,
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
    const [languages, setLanguages] = React.useState<ServerLanguage[]>(null)

    const doGetSourceLanguages = async (sourceId: string) => {
        const langs = await getLanguagesSources(sourceId)
        setLanguages(langs)
        console.log(langs)
    }

    const doGetCorpusLanguages = async (corpusId: string) => {
        const langs = await getLanguagesCorpora(corpusId)
        setLanguages(langs)
        console.log(langs)
    }

    React.useEffect(() => {
        if (props.sourceId) {
            doGetSourceLanguages(props.sourceId)
        }

        if (props.corpusId) {
            doGetCorpusLanguages(props.corpusId)
        }
    }, [props.corpusId, props.sourceId])

    return (
        <>
            {/* {props.languages.map((language, index) => {
                return <p key={index}>{language.refName} {<DeleteIconStyled onClick={() => props.onDelete(language)} />}</p>
            })} */}

            {languages && languages.map((language, index) => {
                return <p key={index}>{language.refName} {<DeleteIconStyled onClick={() => props.onDelete(language)} />}</p>
            })}
        </>
    )
}