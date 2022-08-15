import React from "react"
import { getCollectionById } from "../API"
import { useParams } from "react-router-dom"
import { Collections } from "../../Model/DexterModel"
import { appContext } from "../../State/context"
import { ACTIONS } from "../../State/actions"
import { NewCollection } from "./NewCollection"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Wrapper = styled.div`
    overflow: auto
`

export function CollectionItemContent() {
    const [collection, setCollection] = React.useState<Collections>(null)
    const params = useParams()

    const { state, dispatch } = React.useContext(appContext)
    const [showForm, setShowForm] = React.useState(false)

    const formShowHandler = () => {
        dispatch({
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
        dispatch({
            type: ACTIONS.SET_EDITCOLMODE,
            editColMode: boolean
        })
    }

    const doGetCollectionById = async (id: number) => {
        const response = await getCollectionById(id)
        setCollection(response as Collections)
    }

    doGetCollectionById(parseInt(params.collectionId))

    const refetchCollection = async () => {
        await doGetCollectionById(parseInt(params.collectionId))
    }

    return (
        <Wrapper>
            {collection &&
                <>
                    <button onClick={formShowHandler}>Edit</button>
                    <p>Title: {collection.title}</p>
                    <p>Description: {collection.description}</p>
                    <p>Main or sub collection: {collection.mainorsub}</p>
                    <p>Creator: {collection.creator}</p>
                    <p>Subject: {collection.subject}</p>
                    <p>Rights: {collection.rights}</p>
                    <p>Access: {collection.access}</p>
                    <p>Created: {collection.created.toDateString()}</p>
                    <p>Spatial: {collection.spatial}</p>
                    <p>Temporal: {collection.temporal}</p>
                    <p>Language: {collection.language}</p>
                    Sources: {collection.sources.map((source, i) => {
                        return <Link to={`/sources/${source.id}`} key={i}>
                            {JSON.stringify(source)}
                        </Link>
                    })}
                </>
            }
            {state.editColMode && <NewCollection show={showForm} onEdit={editHandler} edit={state.editColMode} colToEdit={state.toEditCol} onClose={formCloseHandler} refetchCol={refetchCollection} />}
        </Wrapper>
    )
}