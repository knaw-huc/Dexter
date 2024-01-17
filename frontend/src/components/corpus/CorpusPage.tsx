import React, {useContext, useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import {Corpus, ServerKeyword, ServerLanguage, Source} from "../../model/DexterModel"
import {CorpusForm} from "./CorpusForm"
import styled from "@emotion/styled"
import {errorContext} from "../../state/error/errorContext"
import {
    addSourcesToCorpus,
    deleteKeywordFromCorpus,
    deleteKeywordFromSource,
    deleteLanguageFromCorpus,
    deleteSourceFromCorpus,
    getCorporaWithResources,
    getCorpusWithResourcesById,
    getSourcesWithResources,
} from "../../utils/API"
import {Languages} from "../language/Languages"
import {SourcePreview} from "../source/SourcePreview"
import {SourceForm} from "../source/SourceForm"
import {EditButton} from "../common/EditButton"
import {AddNewSourceButton} from "../source/AddNewSourceButton"
import {LinkSourceButton} from "../source/LinkSourceButton"
import {LinkSourceForm} from "./LinkSourceForm"
import _ from "lodash"
import {Grid} from "@mui/material"
import {KeywordList} from "../keyword/KeywordList"
import {FilterSourceByKeywords} from "./FilterSourceByKeywords"
import {ShortFieldsSummary} from "../common/ShortFieldsSummary"

const Wrapper = styled.div`
  overflow: auto;
`
export const CorpusPage = () => {
    const [corpus, setCorpus] = useState<Corpus>(null)
    const [sourceOptions, setSourceOptions] = useState<Source[]>(null)
    const [parentOptions, setParentOptions] = useState<Corpus[]>(null)
    const {dispatchError} = useContext(errorContext)
    const params = useParams()

    const corpusId = params.corpusId

    const [showCorpusForm, setShowCorpusForm] = useState(false)
    const [showSourceForm, setShowSourceForm] = useState(false)
    const [showLinkSourceForm, setShowLinkSourceForm] = useState(false)
    const [filterKeywords, setFilterKeywords] = useState<ServerKeyword[]>([])

    const initResources = async (id: string) => {
        const corpusWithResources = await getCorpusWithResourcesById(id)
            .catch(dispatchError)
        if (!corpusWithResources) {
            dispatchError(new Error(`No corpus found with ID ${id}`))
            return
        }
        setCorpus({
            ...corpusWithResources
        })
        setSourceOptions(await getSourcesWithResources())
        setParentOptions(await getCorporaWithResources().then(all => all.filter(c => c.id !== id)))
    }

    useEffect(() => {
        initResources(corpusId)
    }, [corpusId])

    const handleSaveCorpus = (corpus: Corpus) => {
        setCorpus(corpus)
        setShowCorpusForm(false)
    }

    const handleSaveSource = (update: Source) => {
        setCorpus(corpus => ({
            ...corpus,
            sources: [...corpus.sources, update]
        }))
        setShowSourceForm(false)
    }

    const handleDeleteLanguage = async (language: ServerLanguage) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this language?"
        )

        if (warning === false) return

        await deleteLanguageFromCorpus(corpusId, language.id)
    }

    const handleDeleteCorpusKeyword = async (keyword: ServerKeyword) => {
        await deleteKeywordFromCorpus(corpusId, keyword.id)
        setCorpus(corpus => ({
            ...corpus,
            keywords: corpus.keywords.filter(k => k.id !== keyword.id)
        }))
    }

    const handleDeleteSourceKeyword = async (sourceId: string, keywordId: string) => {
        await deleteKeywordFromSource(sourceId, keywordId)
        _.remove(
            corpus.sources
                .find(s => s.id === sourceId)
                .keywords,
            k => k.id === keywordId
        )
        setCorpus({...corpus})
    }

    const handleUnlinkSource = async (corpusId: string, sourceId: string) => {
        const warning = window.confirm(
            "Are you sure you wish to remove this source from this corpus?"
        )

        if (warning === false) return

        await deleteSourceFromCorpus(corpusId, sourceId)
        setCorpus(corpus => ({
            ...corpus,
            sources: corpus.sources.filter(s => s.id !== sourceId)
        }))
    }

    const handleLinkSource = async (corpusId: string, sourceId: string) => {
        await addSourcesToCorpus(corpusId, [sourceId])
        const toLink = sourceOptions.find(s => s.id === sourceId)
        setCorpus(corpus => ({
            ...corpus,
            sources: [...corpus.sources, toLink]
        }))
    }

    const shortCorpusFields: (keyof Corpus)[]= ["location", "earliest", "latest", "rights", "access", "contributor"]

    const filteredCorpusSources = filterKeywords.length && corpus ? corpus.sources?.filter(
        cs => cs.keywords.find(csk => filterKeywords.find(k => k.id === csk.id))
    ) : corpus?.sources

    return (
        <Wrapper>
            {corpus && (
                <>
                    <EditButton
                        onEdit={() => setShowCorpusForm(true)}
                    />
                    {corpus.parent && <p
                        style={{marginBottom: 0}}
                    >
                        <Link
                            to={`/corpora/${corpus.parent.id}`}
                            style={{color: "black"}}
                        >
                            {corpus.parent.title}
                        </Link>
                        {" "}&gt;
                    </p>}
                    <h1 style={{marginTop: 0}}>
                        {corpus.title || "Untitled"}
                    </h1>
                    {corpus.description && <p>{corpus.description}</p>}
                    {!_.isEmpty(corpus.keywords) && <KeywordList
                        keywords={corpus.keywords}
                        onDelete={handleDeleteCorpusKeyword}
                    />}
                    <ShortFieldsSummary<Corpus>
                        resource={corpus}
                        fieldNames={shortCorpusFields}
                    />

                    {!_.isEmpty(corpus.languages) && <div>
                        <h4>Languages:</h4>
                        <Languages
                            languages={corpus.languages}
                            onDelete={handleDeleteLanguage}
                        />
                    </div>}
                    {corpus.notes && <>
                        <h2>Notes</h2>
                        <p>{corpus.notes}</p>
                    </>}
                    <h2>Sources</h2>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={4}>
                            <AddNewSourceButton onClick={() => setShowSourceForm(true)}/>
                            <LinkSourceButton onClick={() => setShowLinkSourceForm(true)}/>
                        </Grid>
                        <Grid item xs={6} md={8}>
                            <FilterSourceByKeywords
                                all={_.uniqBy(corpus.sources.map(s => s.keywords).flat(), "val")}
                                selected={filterKeywords}
                                onChangeSelected={update => setFilterKeywords(update)}
                            />
                        </Grid>
                    </Grid>
                    {corpus.sources && <Grid
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
                                    onUnlinkSource={() => handleUnlinkSource(corpus.id, source.id)}
                                    onDeleteKeyword={k => handleDeleteSourceKeyword(source.id, k.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>}

                    {showLinkSourceForm && <LinkSourceForm
                        options={sourceOptions}
                        selected={corpus.sources}
                        onLinkSource={sourceId => handleLinkSource(corpusId, sourceId)}
                        onUnlinkSource={sourceId => handleUnlinkSource(corpusId, sourceId)}
                        onClose={() => setShowLinkSourceForm(false)}
                    />}
                </>
            )}
            {showCorpusForm && (
                <CorpusForm
                    corpusToEdit={corpus}
                    parentOptions={parentOptions}
                    sourceOptions={sourceOptions}
                    onClose={() => setShowCorpusForm(false)}
                    onSave={handleSaveCorpus}
                />
            )}
            {showSourceForm && <SourceForm
                corpusId={corpusId}
                onClose={() => setShowSourceForm(false)}
                onSave={handleSaveSource}
            />}

        </Wrapper>
    )
}


