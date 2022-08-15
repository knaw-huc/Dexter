import React from "react"
import { useParams } from "react-router-dom"
import { Sources } from "../../Model/DexterModel"
import { appContext } from "../../State/context"
import { getSourceById } from "../API"
import { ACTIONS } from "../../State/actions"
import { NewSource } from "./NewSource"

export const SourceItemContent = () => {
    const [source, setSource] = React.useState<Sources>(null)
    const params = useParams()

    const { state, dispatch } = React.useContext(appContext)
    const [showForm, setShowForm] = React.useState(false)

    const formShowHandler = () => {
        dispatch({
            type: ACTIONS.SET_TOEDITSOURCE,
            toEditSource: source
        })
        editHandler(true)
        setShowForm(true)
    }

    const formCloseHandler = () => {
        setShowForm(false)
    }

    const editHandler = (boolean: boolean) => {
        dispatch({
            type: ACTIONS.SET_EDITSOURCEMODE,
            editSourceMode: boolean
        })
    }

    const doGetSourceById = async (id: number) => {
        const response = await getSourceById(id)
        setSource(response as Sources)
    }

    doGetSourceById(parseInt(params.sourceId))

    const refetchSource = async () => {
        await doGetSourceById(parseInt(params.sourceId))
    }

    return (
        <div>
            {source &&
                <>
                    <button onClick={formShowHandler}>Edit</button>
                    <p>Title: {source.title}</p>
                    <p>Description: {source.description}</p>
                    <p>Creator: {source.creator}</p>
                    <p>Subject: {source.subject}</p>
                    <p>Rights: {source.rights}</p>
                    <p>Access: {source.access}</p>
                    <p>Created: {source.created.toDateString()}</p>
                    <p>Spatial: {source.spatial}</p>
                    <p>Temporal: {source.temporal}</p>
                    <p>Language: {source.language}</p>
                </>
            }
            {state.editSourceMode && <NewSource show={showForm} onEdit={editHandler} edit={state.editSourceMode} sourceToEdit={state.toEditSource} onClose={formCloseHandler} refetchSource={refetchSource} />}
        </div>
    )
}