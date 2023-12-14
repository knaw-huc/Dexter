import React, {useContext} from "react"
import { getCollectionById } from "../../utils/API"
import { useParams } from "react-router-dom"
import { Collections } from "../../Model/DexterModel"
import { collectionsContext } from "../../State/Collections/collectionContext"
import { Actions } from "../../State/actions"
import { NewCollection } from "./NewCollection"
import styled from "@emotion/styled"
import Button from "@mui/material/Button"
import {errorContext} from "../../State/Error/errorContext"

const Wrapper = styled.div`
    overflow: auto;
`

export const CollectionItemContent = () => {
    const [collection, setCollection] = React.useState<Collections>(null)
    const params = useParams()
    const {setError} = useContext(errorContext)


    const { collectionsState, collectionsDispatch } = React.useContext(collectionsContext)
    const [showForm, setShowForm] = React.useState(false)

    const formShowHandler = () => {
        collectionsDispatch({
            type: Actions.SET_TOEDITCOL,
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
            type: Actions.SET_EDITCOLMODE,
            editColMode: boolean
        })
    }

    const doGetCollectionById = async (id: string) => {
        //console.log(id)
        const response = await getCollectionById(id)
            .catch(setError)
        setCollection(response as Collections)
    }

    React.useEffect(() => {
        doGetCollectionById(params.corpusId)
    }, [params])

    const refetchCollection = async () => {
        await doGetCollectionById(params.corpusId)
    }

    return (
        <Wrapper>
            {collection &&
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
                </>
            }
            {collectionsState.editColMode && <NewCollection show={showForm} onEdit={editHandler} edit={collectionsState.editColMode} colToEdit={collectionsState.toEditCol} onClose={formCloseHandler} refetchCol={refetchCollection} />}
        </Wrapper>

    )
}