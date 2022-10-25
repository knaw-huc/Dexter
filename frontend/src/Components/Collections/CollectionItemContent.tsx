import React from "react"
import { deleteKeywordFromCorpus, deleteLanguageFromCorpus, getCollectionById, getKeywordsCorpora, getLanguagesCorpora } from "../API"
import { useParams } from "react-router-dom"
import { Collections, Keywords, Languages } from "../../Model/DexterModel"
import { collectionsContext } from "../../State/Collections/collectionContext"
import { ACTIONS } from "../../State/actions"
import { NewCollection } from "./NewCollection"
import styled from "@emotion/styled"
import Button from "@mui/material/Button"
import { KeywordContent } from "../keywords/KeywordContent"
import { LanguagesContent } from "../languages/LanguagesContent"

const Wrapper = styled.div`
    overflow: auto;
`

export const CollectionItemContent = () => {
    const [collection, setCollection] = React.useState<Collections>(null)
    const [keywords, setKeywords] = React.useState<Keywords[]>(null)
    const [languages, setLanguages] = React.useState<Languages[]>(null)

    const params = useParams()

    const { collectionsState, collectionsDispatch } = React.useContext(collectionsContext)
    const [showForm, setShowForm] = React.useState(false)

    const formShowHandler = () => {
        collectionsDispatch({
            type: ACTIONS.SET_TOEDITCOL,
            toEditCol: collection
        })
        editHandler(true)
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    const editHandler = (boolean: boolean) => {
        collectionsDispatch({
            type: ACTIONS.SET_EDITCOLMODE,
            editColMode: boolean
        })
    }

    const doGetCollectionById = async (id: string) => {
        const response = await getCollectionById(id)
        setCollection(response as Collections)

        const kws = await getKeywordsCorpora(response.id)
        setKeywords(kws)
        console.log(kws)

        const langs = await getLanguagesCorpora(response.id)
        setLanguages(langs)
        console.log(langs)
    }

    React.useEffect(() => {
        doGetCollectionById(params.corpusId)
    }, [params.corpusId])

    const refetchCollection = async () => {
        await doGetCollectionById(params.corpusId)
    }

    const deleteLanguageHandler = async (languageId: string) => {
        const warning = window.confirm("Are you sure you wish to delete this language?")

        if (warning === false) return

        const corpusId = params.corpusId

        await deleteLanguageFromCorpus(corpusId, languageId)
        await refetchCollection()
    }

    const deleteKeywordHandler = async (keywordId: string) => {
        const warning = window.confirm("Are you sure you wish to delete this keyword?")

        if (warning === false) return

        const corpusId = params.corpusId

        await deleteKeywordFromCorpus(corpusId, keywordId)
        await refetchCollection()
    }

    return (
        <Wrapper>
            {collection && keywords && languages &&
                <>
                    <Button variant="contained" onClick={formShowHandler}>Edit</Button>
                    <p>Parent ID: {collection.parentId}</p>
                    <p>Title: {collection.title}</p>
                    <p>Description: {collection.description}</p>
                    <p>Rights: {collection.rights}</p>
                    <p>Access: {collection.access}</p>
                    <p>Location: {collection.location}</p>
                    <p>Earliest: {collection.earliest}</p>
                    <p>Latest: {collection.latest}</p>
                    <p>Contributor: {collection.contributor}</p>
                    <p>Notes: {collection.notes}</p>
                    <div>Keywords: <KeywordContent keywords={keywords} onDelete={deleteKeywordHandler} /></div>
                    <div>Languages: <LanguagesContent languages={languages} onDelete={deleteLanguageHandler} /></div>
                </>
            }
            {collectionsState.editColMode && <NewCollection show={showForm} onEdit={editHandler} edit={collectionsState.editColMode} colToEdit={collectionsState.toEditCol} onClose={formCloseHandler} refetchCol={refetchCollection} />}
        </Wrapper>

    )
}