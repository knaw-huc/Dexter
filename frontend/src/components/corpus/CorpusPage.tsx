import React, {useContext, useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import {ServerKeyword, ServerLanguage, ServerResultCorpus, ServerSource} from "../../model/DexterModel"
import {collectionsContext} from "../../state/collections/collectionContext"
import {CorpusForm} from "./CorpusForm"
import styled from "@emotion/styled"
import {errorContext} from "../../state/error/errorContext"
import {
    addSourcesToCorpus,
    deleteKeywordFromCorpus,
    deleteKeywordFromSource,
    deleteLanguageFromCorpus,
    deleteSourceFromCorpus,
    getCollectionById,
    getKeywordsCorpora,
    getLanguagesCorpora,
    getSourcesInCorpus,
} from "../../utils/API"
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
import {KeywordList} from "../keyword/KeywordList"
import {SourceField} from "./SourceField"
import {Spacer} from "./Spacer"
import {FilterSourceByKeywords} from "./FilterSourceByKeywords"

const Wrapper = styled.div`
  overflow: auto;
`
export const CorpusPage = () => {
    const [corpus, setCorpus] = useState<ServerResultCorpus>(null)
    const [corpusSources, setCorpusSources] = useState<ServerSource[]>(null)
    const [keywords, setKeywords] = useState<ServerKeyword[]>(null)
    const [languages, setLanguages] = useState<ServerLanguage[]>(null)
    const {dispatchError} = useContext(errorContext)
    const {collectionsState} = useContext(collectionsContext)
    const params = useParams()

    const corpusId = params.corpusId

    const {sourcesState} = useContext(sourcesContext)
    const [showCorpusForm, setShowCorpusForm] = useState(false)
    const [showSourceForm, setShowSourceForm] = useState(false)
    const [showLinkSourceForm, setShowLinkSourceForm] = useState(false)
    const [filterKeywords, setFilterKeywords] = useState<ServerKeyword[]>([])

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

        const keywords = await getKeywordsCorpora(response.id)
        setKeywords(keywords)

        const languages = await getLanguagesCorpora(response.id)
        setLanguages(languages)

        await doGetSourcesInCorpus(corpusId)
    }

    useEffect(() => {
        doGetCollectionById(corpusId)
    }, [collectionsState, corpusId])

    const doGetSourcesInCorpus = async (corpusId: string) => {
        const sources = await getSourcesInCorpus(corpusId)
        setCorpusSources(sources)
    }

    const handleDeleteLanguage = async (language: ServerLanguage) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this language?"
        )

        if (warning === false) return

        await deleteLanguageFromCorpus(corpusId, language.id)
    }

    const deleteCorpusKeyword = async (keyword: ServerKeyword) => {
        await deleteKeywordFromCorpus(corpusId, keyword.id)
        const update = keywords.filter(k => k.id !== keyword.id)
        setKeywords(update)
    }

    const deleteSourceKeyword = async (sourceId: string, keywordId: string) => {
        await deleteKeywordFromSource(sourceId, keywordId)
        setCorpusSources(corpusSources.filter(s => s.id !== keywordId))
    }

    const unlinkSource = async (corpusId: string, sourceId: string) => {
        await deleteSourceFromCorpus(corpusId, sourceId)
        setCorpusSources(sources => sources.filter(s => s.id !== sourceId))
    }

    const linkSource = async (corpusId: string, sourceId: string) => {
        await addSourcesToCorpus(corpusId, [sourceId])
        setCorpusSources(prev =>
            _.uniqBy([...prev, sourcesState.sources.find(s => s.id === sourceId)], "id")
        )
    }

    const simpleSourceField = ["rights", "access", "location", "earliest", "latest", "contributor", "notes"]

    const filteredCorpusSources = filterKeywords.length ? corpusSources?.filter(
        cs => cs.keywords.find(csk => filterKeywords.find(k => k.id === csk.id))
    ) : corpusSources

    return (
        <Wrapper>
            {corpus && corpusSources && keywords && languages && (
                <>
                    <EditButton onEdit={handleShowForm}/>
                    <h1>
                        {corpus.title || "Untitled"}
                    </h1>
                    {corpus.parentId && <p>
                        <strong>Parent ID:</strong>{" "}
                        <Link to={`/corpora/${corpus.parentId}`}>
                            {corpus.parentId}
                        </Link>
                    </p>}
                    {corpus.description && <p>{corpus.description}</p>}
                    {!_.isEmpty(keywords) && <KeywordList
                        keywords={keywords}
                        onDelete={deleteCorpusKeyword}
                    />}
                    <p style={{textTransform: "capitalize"}}>
                        {simpleSourceField.map((field: keyof ServerResultCorpus, i) => [
                            i > 0 && <Spacer key={i}/>,
                            <SourceField
                                key={field}
                                fieldName={field}
                                resource={corpus}
                            />
                        ])}
                    </p>

                    {!_.isEmpty(languages) && <div>
                        <h4>Languages:</h4>
                        <Languages
                            languages={languages}
                            onDelete={handleDeleteLanguage}
                        />
                    </div>}
                    <h2>Sources</h2>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                            <AddNewSourceButton onClick={() => setShowSourceForm(true)}/>
                            <LinkSourceButton onClick={() => setShowLinkSourceForm(true)}/>
                        </Grid>
                        <Grid item xs={6} md={8}>
                            <FilterSourceByKeywords
                                all={_.uniqBy(corpusSources.map(s => s.keywords).flat(), "val")}
                                selected={filterKeywords}
                                onChangeSelected={update => setFilterKeywords(update)}
                            />
                        </Grid>
                    </Grid>
                    {corpusSources && <Grid
                        container
                        spacing={2}
                        sx={{pl: 0.1, pr: 1, mt: 2, mb: 2}}
                    >
                        {filteredCorpusSources.map(source => (
                            <Grid
                                item
                                xs={4}
                                height="180px"
                                key={source.id}
                            >
                                <SourcePreview
                                    source={source}
                                    corpusId={corpus.id}
                                    onUnlinkSource={() => unlinkSource(corpus.id, source.id)}
                                    onDeleteKeyword={k => deleteSourceKeyword(source.id, k.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>}

                    {showLinkSourceForm && <LinkSourceForm
                        all={sourcesState.sources}
                        selected={corpusSources}
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

