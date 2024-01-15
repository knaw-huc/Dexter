import React, {useContext, useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import {
    Corpus,
    ServerKeyword,
    ServerLanguage,
    ServerResultCorpus,
    ServerResultSource,
    Source
} from "../../model/DexterModel"
import {CorpusForm} from "./CorpusForm"
import styled from "@emotion/styled"
import {errorContext} from "../../state/error/errorContext"
import {
    addSourceResources,
    addSourcesToCorpus,
    deleteKeywordFromCorpus,
    deleteKeywordFromSource,
    deleteLanguageFromCorpus,
    deleteSourceFromCorpus,
    getCorpora,
    getCorpusWithResourcesById,
    getSources,
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
import {SourceField} from "./SourceField"
import {Spacer} from "./Spacer"
import {FilterSourceByKeywords} from "./FilterSourceByKeywords"

const Wrapper = styled.div`
  overflow: auto;
`
export const CorpusPage = () => {
    const [corpus, setCorpus] = useState<Corpus>(null)
    const [sourceOptions, setSourceOptions] = useState<ServerResultSource[]>(null)
    const [parentOptions, setParentOptions] = useState<ServerResultCorpus[]>(null)
    const {dispatchError} = useContext(errorContext)
    const params = useParams()

    const corpusId = params.corpusId

    const [showCorpusForm, setShowCorpusForm] = useState(false)
    const [showSourceForm, setShowSourceForm] = useState(false)
    const [showLinkSourceForm, setShowLinkSourceForm] = useState(false)
    const [filterKeywords, setFilterKeywords] = useState<ServerKeyword[]>([])

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
        setSourceOptions(await getSources())
        setParentOptions(await getCorpora().then(all => all.filter(c => c.id !== id)))
    }

    useEffect(() => {
        initResources(corpusId)
    }, [corpusId])

    const deleteLanguage = async (language: ServerLanguage) => {
        const warning = window.confirm(
            "Are you sure you wish to delete this language?"
        )

        if (warning === false) return

        await deleteLanguageFromCorpus(corpusId, language.id)
    }

    const deleteCorpusKeyword = async (keyword: ServerKeyword) => {
        await deleteKeywordFromCorpus(corpusId, keyword.id)
        setCorpus(corpus => ({
            ...corpus,
            keywords: corpus.keywords.filter(k => k.id !== keyword.id)
        }))
    }

    const deleteSourceKeyword = async (sourceId: string, keywordId: string) => {
        await deleteKeywordFromSource(sourceId, keywordId)
        _.remove(
            corpus.sources
                .find(s => s.id === sourceId)
                .keywords,
            k => k.id === keywordId
        )
        setCorpus({...corpus})
    }

    const unlinkSource = async (corpusId: string, sourceId: string) => {
        await deleteSourceFromCorpus(corpusId, sourceId)
        setCorpus(corpus => ({
            ...corpus,
            sources: corpus.sources.filter(s => s.id !== sourceId)
        }))
    }

    const linkSource = async (corpusId: string, sourceId: string) => {
        await addSourcesToCorpus(corpusId, [sourceId])
        const toLink = await addSourceResources(sourceOptions.find(s => s.id === sourceId));
        setCorpus(corpus => ({
            ...corpus,
            sources: [...corpus.sources, toLink]
        }))
    }

    const simpleSourceField = ["rights", "access", "location", "earliest", "latest", "contributor", "notes"]

    const filteredCorpusSources = filterKeywords.length && corpus ? corpus.sources?.filter(
        cs => cs.keywords.find(csk => filterKeywords.find(k => k.id === csk.id))
    ) : corpus?.sources

    return (
        <Wrapper>
            {corpus && (
                <>
                    <EditButton onEdit={() => setShowCorpusForm(true)}/>
                    {corpus.parent && <p
                        style={{marginBottom: 0}}
                    >
                        <Link
                            to={`/corpora/${corpus.parent.id}`}
                            style={{color: "black"}}
                        >
                            {corpus.parent.title} &gt;
                        </Link>
                    </p>}
                    <h1 style={{marginTop: 0}}>
                        {corpus.title || "Untitled"}
                    </h1>
                    {corpus.description && <p>{corpus.description}</p>}
                    {!_.isEmpty(corpus.keywords) && <KeywordList
                        keywords={corpus.keywords}
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

                    {!_.isEmpty(corpus.languages) && <div>
                        <h4>Languages:</h4>
                        <Languages
                            languages={corpus.languages}
                            onDelete={deleteLanguage}
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
                                    onUnlinkSource={() => unlinkSource(corpus.id, source.id)}
                                    onDeleteKeyword={k => deleteSourceKeyword(source.id, k.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>}

                    {showLinkSourceForm && <LinkSourceForm
                        options={sourceOptions}
                        selected={corpus.sources}
                        onLinkSource={sourceId => linkSource(corpusId, sourceId)}
                        onUnlinkSource={sourceId => unlinkSource(corpusId, sourceId)}
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

