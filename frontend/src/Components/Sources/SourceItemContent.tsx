import React, {useContext, useEffect, useState} from "react"
import { useParams } from "react-router-dom"
import { Source } from "../../Model/DexterModel"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { getSourceById } from "../API"
import { ACTIONS } from "../../State/actions"
import { SourceForm } from "./SourceForm"
import Button from "@mui/material/Button"

export const SourceItemContent = () => {
    const [source, setSource] = useState<Source>(null)
    const params = useParams()

    const { sources, setSources } = useContext(sourcesContext)
    const [showForm, setShowForm] = useState(false)

    const formShowHandler = () => {
        setSources({
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
        setSources({
            type: ACTIONS.SET_EDITSOURCEMODE,
            editSourceMode: boolean
        })
    }

    const doGetSourceById = async (id: string) => {
        const response = await getSourceById(id)
        setSource(response as Source)
    }

    React.useEffect(() => {
        doGetSourceById(params.sourceId)
    }, [])

    const refetchSource = async () => {
        await doGetSourceById(params.sourceId)
    }

    return (
        <div>
            {source &&
                <>
                    <Button variant="contained" onClick={formShowHandler}>Edit</Button>
                    <p>External reference: {source.externalRef}</p>
                    <p>Title: {source.title}</p>
                    <p>Description: {source.description}</p>
                    <p>Rights: {source.rights}</p>
                    <p>Access: {source.access}</p>
                    <p>Location: {source.location}</p>
                    <p>Earliest: {source.earliest}</p>
                    <p>Latest: {source.latest}</p>
                    <p>Notes: {source.notes}</p>
                </>
            }
            {sources.editSourceMode && <SourceForm
                show={showForm}
                onEdit={editHandler}
                edit={sources.editSourceMode}
                sourceToEdit={sources.toEditSource}
                onClose={formCloseHandler}
                refetchSource={refetchSource}
            />}
        </div>
    )
}