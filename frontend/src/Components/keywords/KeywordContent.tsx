import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"
import { red } from "@mui/material/colors"
import React from "react"
import { ServerKeyword } from "../../Model/DexterModel"
import { getKeywordsCorpora, getKeywordsSources } from "../API"

type KeywordContentProps = {
    sourceId?: string,
    corpusId?: string,
    onDelete?: (keyword: ServerKeyword) => Promise<void>
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
    const [keywords, setKeywords] = React.useState<ServerKeyword[]>(null)

    const doGetSourceKeywords = async (sourceId: string) => {
        const kws = await getKeywordsSources(sourceId)
        setKeywords(kws)
        console.log(kws)
    }

    const doGetCorpusKeywords = async (corpusId: string) => {
        const kws = await getKeywordsCorpora(corpusId)
        setKeywords(kws)
        console.log(kws)
    }

    React.useEffect(() => {
        if (props.sourceId) {
            doGetSourceKeywords(props.sourceId)
        }

        if (props.corpusId) {
            doGetCorpusKeywords(props.corpusId)
        }
    }, [props.corpusId, props.sourceId])

    return (
        <>
            {keywords && keywords.map((keyword, index) => {
                return <p key={index}>{keyword.val} {<DeleteIconStyled onClick={() => props.onDelete(keyword)} />}</p>
            })}
        </>
    )
}