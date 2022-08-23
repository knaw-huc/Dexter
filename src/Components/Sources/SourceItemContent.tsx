import React from "react"
import { Link, useParams } from "react-router-dom"
import { Sources } from "../../Model/DexterModel"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { getSourceById } from "../API"
import { ACTIONS } from "../../State/actions"
import { NewSource } from "./NewSource"

export const SourceItemContent = () => {
    const [source, setSource] = React.useState<Sources>(null)
    const params = useParams()

    const { sourcesState, sourcesDispatch } = React.useContext(sourcesContext)
    const [showForm, setShowForm] = React.useState(false)

    const formShowHandler = () => {
        sourcesDispatch({
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
        sourcesDispatch({
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
                    <p>Created: {source.created}</p>
                    <p>Spatial: {source.spatial}</p>
                    <p>Temporal: {source.temporal}</p>
                    <p>Language: {source.language}</p>
                    <p>Part of collection: {source.partCol.map((col, i) => {
                        return <Link to={`/collections/${col}`} key={i}>
                            {JSON.stringify(col)}
                        </Link>
                    })}</p>
                </>
            }
            {sourcesState.editSourceMode && <NewSource show={showForm} onEdit={editHandler} edit={sourcesState.editSourceMode} sourceToEdit={sourcesState.toEditSource} onClose={formCloseHandler} refetchSource={refetchSource} />}
        </div>
    )
}