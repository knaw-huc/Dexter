import React from "react"
import { getCollectionById } from "../API"
import { useParams } from "react-router-dom"
import { Collections } from "../../Model/DexterModel"
import { appContext } from "../../State/context"
import { ACTIONS } from "../../State/actions"
import { NewCollection } from "./NewCollection"

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
        const response: any = await getCollectionById(id)
        setCollection(response)
    }

    doGetCollectionById(parseInt(params.collectionId))

    const refetchCollection = async () => {
        await doGetCollectionById(parseInt(params.collectionId))
    }

    return (
        <div>
            {collection &&
                <>
                    <button onClick={formShowHandler}>Edit</button>
                    <p>Title: {collection.metadata.title}</p>
                    <p>Description: {collection.metadata.description}</p>
                    <p>Main or sub collection: {collection.metadata.mainorsub}</p>
                    <p>Creator: {collection.metadata.creator}</p>
                    <p>Subject: {collection.metadata.subject}</p>
                    <p>Rights: {collection.metadata.rights}</p>
                    <p>Access: {collection.metadata.access}</p>
                    <p>Created: {collection.metadata.created}</p>
                    <p>Spatial: {collection.metadata.spatial}</p>
                    <p>Temporal: {collection.metadata.temporal}</p>
                    <p>Language: {collection.metadata.language}</p>
                    Sources: {collection.sources.map((source) => {
                        return JSON.stringify(source)
                    })}
                </>
            }
            {state.editColMode && <NewCollection show={showForm} onEdit={editHandler} edit={state.editColMode} colToEdit={state.toEditCol} onClose={formCloseHandler} refetchCol={refetchCollection} />}
        </div>
    )
}