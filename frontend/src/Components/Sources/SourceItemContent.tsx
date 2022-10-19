import React from "react"
import { useParams } from "react-router-dom"
import { Sources, Keywords } from "../../Model/DexterModel"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { getKeywordsSources, getSourceById } from "../API"
import { ACTIONS } from "../../State/actions"
import { NewSource } from "./NewSource"
import Button from "@mui/material/Button"
import { KeywordContent } from "../keywords/KeywordContent"

export const SourceItemContent = () => {
    const [source, setSource] = React.useState<Sources>(null)
    const [keywords, setKeywords] = React.useState<Keywords[]>(null)

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

    const doGetSourceById = async (id: string) => {
        const response = await getSourceById(id)
        setSource(response as Sources)
        const kws = await getKeywordsSources(response.id)
        setKeywords(kws)
        console.log(kws)
    }

    React.useEffect(() => {
        doGetSourceById(params.sourceId)
    }, [params.sourceId])

    const refetchSource = async () => {
        await doGetSourceById(params.sourceId)
    }

    return (
        <div>
            {source && keywords &&
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
                    <div>Keywords: <KeywordContent keywords={keywords} /></div>
                </>
            }
            {sourcesState.editSourceMode && <NewSource show={showForm} onEdit={editHandler} edit={sourcesState.editSourceMode} sourceToEdit={sourcesState.toEditSource} onClose={formCloseHandler} refetchSource={refetchSource} />}
        </div>
    )
}