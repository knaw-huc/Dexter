import React from "react"
import { useParams } from "react-router-dom"
import { ServerSource, ServerKeyword, ServerLanguage } from "../../Model/DexterModel"
import { sourcesContext } from "../../State/Sources/sourcesContext"
import { deleteKeywordFromSource, deleteLanguageFromSource, getKeywordsSources, getLanguagesSources, getSourceById } from "../API"
import { ACTIONS } from "../../State/actions"
import { NewSource } from "./NewSource"
import Button from "@mui/material/Button"
import { KeywordContent } from "../keywords/KeywordContent"
import { LanguagesContent } from "../languages/LanguagesContent"

export const SourceItemContent = () => {
    const [source, setSource] = React.useState<ServerSource>(null)
    const [keywords, setKeywords] = React.useState<ServerKeyword[]>(null)
    const [languages, setLanguages] = React.useState<ServerLanguage[]>(null)

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
        setSource(response as ServerSource)

        const kws = await getKeywordsSources(response.id)
        setKeywords(kws)
        console.log(kws)

        const langs = await getLanguagesSources(response.id)
        setLanguages(langs)
        console.log(langs)
    }

    React.useEffect(() => {
        doGetSourceById(params.sourceId)
    }, [params.sourceId])

    const refetchSource = async () => {
        await doGetSourceById(params.sourceId)
    }

    const deleteLanguageHandler = async (language: ServerLanguage) => {
        const warning = window.confirm("Are you sure you wish to delete this language?")

        if (warning === false) return

        const sourceId = params.sourceId

        await deleteLanguageFromSource(sourceId, language.id)
        await refetchSource()
    }

    const deleteKeywordHandler = async (keyword: ServerKeyword) => {
        const warning = window.confirm("Are you sure you wish to delete this keyword?")

        if (warning === false) return

        const sourceId = params.sourceId

        await deleteKeywordFromSource(sourceId, keyword.id)
        await refetchSource()
    }

    return (
        <div>
            {source && keywords && languages &&
                <>
                    <Button variant="contained" onClick={formShowHandler}>Edit</Button>
                    <p><strong>External reference:</strong> {source.externalRef}</p>
                    <p><strong>Title:</strong> {source.title}</p>
                    <p><strong>Description:</strong> {source.description}</p>
                    <p><strong>Rights:</strong> {source.rights}</p>
                    <p><strong>Access:</strong> {source.access}</p>
                    <p><strong>Location:</strong> {source.location}</p>
                    <p><strong>Earliest:</strong> {source.earliest}</p>
                    <p><strong>Latest:</strong> {source.latest}</p>
                    <p><strong>Notes:</strong> {source.notes}</p>
                    <div><strong>Keywords:</strong> <KeywordContent sourceId={params.sourceId} onDelete={deleteKeywordHandler} /></div>
                    <div><strong>Languages:</strong> <LanguagesContent sourceId={params.sourceId} onDelete={deleteLanguageHandler} /></div>
                </>
            }
            {sourcesState.editSourceMode && <NewSource show={showForm} onEdit={editHandler} edit={sourcesState.editSourceMode} sourceToEdit={sourcesState.toEditSource} onClose={formCloseHandler} refetchSource={refetchSource} />}
        </div>
    )
}