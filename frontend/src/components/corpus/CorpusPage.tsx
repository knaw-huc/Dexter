import React, {useContext, useEffect} from "react"
import {Link, useParams} from "react-router-dom"
import {ServerCorpus, ServerKeyword, ServerLanguage, ServerResultCorpus, ServerSource} from "../../model/DexterModel"
import {collectionsContext} from "../../state/collections/collectionContext"
import {Actions} from "../../state/actions"
import {CorpusForm} from "./CorpusForm"
import styled from "@emotion/styled"
import {errorContext} from "../../state/error/errorContext"
import {
    addSourcesToCorpus,
    deleteKeywordFromCorpus,
    deleteLanguageFromCorpus,
    deleteSourceFromCorpus,
    getCollectionById,
    getKeywordsCorpora,
    getLanguagesCorpora,
    getSourcesInCorpus,
} from "../../utils/API"
import {Keyword} from "../keyword/Keyword"
import {Languages} from "../language/Languages"
import {SourcePreview} from "../source/SourcePreview"
import {SourceForm} from "../source/SourceForm"
import {EditButton} from "../common/EditButton"
import {AddNewSourceButton} from "../source/AddNewSourceButton"
import {LinkSourceButton} from "../source/LinkSourceButton"
import {LinkSourceForm} from "./LinkSourceForm"
import {sourcesContext} from "../../state/sources/sourcesContext"
import _ from "lodash"
import {Grid} from "@mui/material"

const Wrapper = styled.div`
  overflow: auto;
`
export const CorpusPage = () => {
    const [corpus, setCorpus] = React.useState<ServerResultCorpus>(null)
    const [sources, setSources] = React.useState<ServerSource[]>(null)
    const [keywords, setKeywords] = React.useState<ServerKeyword[]>(null)
    const [languages, setLanguages] = React.useState<ServerLanguage[]>(null)
    const {dispatchError} = useContext(errorContext)
    const {collectionsState} = useContext(collectionsContext)
    const params = useParams()

    const corpusId = params.corpusId

    const {sourcesState} = useContext(sourcesContext)
    const [showCorpusForm, setShowCorpusForm] = React.useState(false)
    const [showSourceForm, setShowSourceForm] = React.useState(false)
    const [showLinkSourceForm, setShowLinkSourceForm] = React.useState(false)

    const handleShowForm = () => {
        setShowCorpusForm(true)
    }

    const handleCloseForm = () => {
        setShowCorpusForm(false)
    }

    const doGetCollectionById = async (id: string) => {
        const response = await getCollectionById(id)
            .catch(dispatchError)
        if (!response) {
            return
        }
        setCorpus(response)

        const kws = await getKeywordsCorpora(response.id)
        setKeywords(kws)

        const langs = await getLanguagesCorpora(response.id)
        setLanguages(langs)

        doGetSourcesInCorpus(corpusId)
    }

    useEffect(() => {
        doGetCollectionById(corpusId)
    }, [collectionsState, corpusId])

    const doGetSourcesInCorpus = async (corpusId: string) => {
        const srcs = await getSourcesInCorpus(corpusId)
        setSources(srcs)
    }

    const deleteLanguageHandler = async (language: ServerLanguage) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this language?"
        )

        if (warning === false) return

        await deleteLanguageFromCorpus(corpusId, language.id)
    }

    const deleteKeywordHandler = async (keyword: ServerKeyword) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this keyword?"
        )

        if (warning === false) return

        await deleteKeywordFromCorpus(corpusId, keyword.id)
    }

    const unlinkSource = async (corpusId: string, sourceId: string) => {
        if (!window.confirm(
            "Are you sure you wish to remove this source from this corpus?\n" +
            "The source will still be available under sources."
        )) {
            return
        }
        await deleteSourceFromCorpus(corpusId, sourceId)
        setSources(sources => sources.filter(s => s.id !== sourceId))
    }

    const linkSource = async (corpusId: string, sourceId: string) => {
        await addSourcesToCorpus(corpusId, [sourceId])
        setSources(prev =>
            _.uniqBy([...prev, sourcesState.sources.find(s => s.id === sourceId)], "id")
        )
    }


    return (
        <Wrapper>
            {corpus && sources && keywords && languages && (
                <>
                    <EditButton onEdit={handleShowForm}/>

                    {corpus.parentId && <p>
                        <strong>Parent ID:</strong>{" "}
                        <Link to={`/corpora/${corpus.parentId}`}>
                            {corpus.parentId}
                        </Link>
                    </p>}
                    <h1>{corpus.title || "Untitled"}</h1>
                    {corpus.description && <p>{corpus.description}</p>}
                    <p  style={{textTransform: "capitalize"}}>
                        {["rights", "access", "location", "earliest", "latest", "contributor", "notes"].map((field: keyof ServerResultCorpus, i) => [
                            i > 0 && <Spacer key={i}/>,
                            <SourceField
                                key={field}
                                fieldName={field}
                                resource={corpus}
                            />
                        ])}
                    </p>
                    {!_.isEmpty(keywords) && <div>
                        <h4>Keywords:</h4>
                        <Keyword
                            keywords={keywords}
                            onDelete={deleteKeywordHandler}
                        />
                    </div>}
                    {!_.isEmpty(languages) && <div>
                        <h4>Languages:</h4>
                        <Languages
                            languages={languages}
                            onDelete={deleteLanguageHandler}
                        />
                    </div>}
                    <h2>Sources</h2>
                    <AddNewSourceButton onClick={() => setShowSourceForm(true)}/>
                    <LinkSourceButton onClick={() => setShowLinkSourceForm(true)}/>

                    {sources && <Grid
                        container
                        spacing={2}
                        sx={{pl: 0.1, pr: 1, mt: 2, mb: 2}}
                    >
                        {sources.map(source => (
                            <Grid
                                item
                                xs={4}
                                height="150px"
                                key={source.id}
                            >
                                <SourcePreview
                                    source={source}
                                    corpusId={corpus.id}
                                    onUnlinkSource={() => unlinkSource(corpus.id, source.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>}

                    {showLinkSourceForm && <LinkSourceForm
                        all={sourcesState.sources}
                        selected={sources}
                        onLinkSource={sourceId => linkSource(corpusId, sourceId)}
                        onUnlinkSource={sourceId => unlinkSource(corpusId, sourceId)}
                        onClose={() => setShowLinkSourceForm(false)}
                    />}
                </>
            )}
            {showCorpusForm && (
                <CorpusForm
                    isEditing={true}
                    show={showCorpusForm}
                    corpusToEdit={corpus}
                    onClose={handleCloseForm}
                />
            )}
            <SourceForm
                show={showSourceForm}
                onClose={() => setShowSourceForm(false)}
                corpusId={corpusId}
            />

        </Wrapper>
    )
}

export function SourceField(
    props: {
        fieldName: keyof ServerResultCorpus,
        resource: ServerResultCorpus
    }
) {
    const value = String(props.resource[props.fieldName])
    if (!value) {
        return null
    }
    const label = String(props.fieldName)
    return <span>
        <span style={{textTransform: "lowercase", color: "grey"}}>{label}:</span>
        {" "}
        <strong>{value}</strong>
    </span>
}

function Spacer() {
    return <span style={{display: "inline-block", color: "grey", margin: "0.75em"}}> | </span>
}