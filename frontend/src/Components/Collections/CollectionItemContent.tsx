import React from "react"
import { getCollectionById, getKeywordsCorpora } from "../API"
import { useParams } from "react-router-dom"
import { Collections, Keywords } from "../../Model/DexterModel"
import { collectionsContext } from "../../State/Collections/collectionContext"
import { ACTIONS } from "../../State/actions"
import { NewCollection } from "./NewCollection"
import styled from "@emotion/styled"
import Button from "@mui/material/Button"
import { KeywordContent } from "../keywords/KeywordContent"

const Wrapper = styled.div`
    overflow: auto;
`

export const CollectionItemContent = () => {
    const [collection, setCollection] = React.useState<Collections>(null)
    const [keywords, setKeywords] = React.useState<Keywords[]>(null)

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
    }

    React.useEffect(() => {
        doGetCollectionById(params.corpusId)
    }, [params])

    const refetchCollection = async () => {
        await doGetCollectionById(params.corpusId)
    }

    return (
        <Wrapper>
            {collection && keywords &&
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
                    <div>Keywords: <KeywordContent keywords={keywords} /></div>
                </>
            }
            {collectionsState.editColMode && <NewCollection show={showForm} onEdit={editHandler} edit={collectionsState.editColMode} colToEdit={collectionsState.toEditCol} onClose={formCloseHandler} refetchCol={refetchCollection} />}
        </Wrapper>

    )
}