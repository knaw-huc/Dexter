import styled from "@emotion/styled"
import {yupResolver} from "@hookform/resolvers/yup"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import React, {useContext, useState} from "react"
import {SubmitHandler, useForm} from "react-hook-form"
import * as yup from "yup"
import {
    ServerCorpus,
    ServerFormCorpus,
    ServerKeyword,
    ServerLanguage,
    ServerResultCorpus,
    ServerSource,
} from "../../model/DexterModel"
import {collectionsContext} from "../../state/collections/collectionContext"
import {sourcesContext} from "../../state/sources/sourcesContext"
import {
    addKeywordsToCorpus,
    addLanguagesToCorpus,
    addSourcesToCorpus,
    createCollection,
    deleteSourceFromCorpus,
    getCollectionById,
    getKeywordsCorpora,
    getLanguagesCorpora,
    getSourcesInCorpus, updateCorpus,
} from "../../utils/API"
import {KeywordsField} from "../keyword/KeywordsField"
import {LanguagesField} from "../language/LanguagesField"
import {SubCorpusField} from "./SubCorpusField"
import {errorContext} from "../../state/error/errorContext"
import ScrollableModal from "../common/ScrollableModal"
import {ValidatedSelectField} from "../common/ValidatedSelectField"
import {accessOptions} from "../../model/AccessOptions"
import {LinkSourceField} from "./LinkSourceField"
import {Actions} from "../../state/actions"

type NewCollectionProps = {
    show?: boolean;
    onClose?: () => void;
    isEditing?: boolean;
    corpusToEdit?: ServerResultCorpus | undefined;
};

const TextFieldStyled = styled(TextField)`
  display: block;
`

const Label = styled.label`
  font-weight: bold;
`

const schema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    rights: yup.string().required("Rights is required"),
    access: yup.string().required("Access is required"),
})

const formToServer = (data: ServerCorpus) => {
    const newData: any = data
    if (newData.keywords) {
        newData.keywords = newData.keywords.map((kw: ServerKeyword) => {
            return kw.id
        })
    }
    if (newData.languages) {
        newData.languages = newData.languages.map((language: ServerLanguage) => {
            return language.id
        })
    }
    if (newData.sourceIds) {
        newData.sourceIds = newData.sourceIds.map((source: ServerSource) => {
            return source.id
        })
    }
    if (newData.parentId) {
        newData.parentId = newData.parentId
            .map((corpus: ServerCorpus) => {
                return corpus.id
            })
            .toString()
    }

    return newData
}

export function CorpusForm(props: NewCollectionProps) {
    const {sourcesState} = React.useContext(sourcesContext)
    const {collectionsState} = React.useContext(collectionsContext)
    const {dispatchError} = useContext(errorContext)
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: {errors},
        watch
    } = useForm<ServerCorpus>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            keywords: [],
            languages: [],
            sources: [],
            parent: null,
            access: null,
        },
    })
    const [isInit, setInit] = useState(false)
    const [isLoaded, setLoaded] = useState(false)
    const {dispatchCollections} = React.useContext(collectionsContext)
    const onSubmit: SubmitHandler<ServerCorpus> = async (data: ServerCorpus) => {

        if (!props.isEditing) {
            const serverCreateForm = formToServer(data)
            try {
                const newCollection = await createCollection(serverCreateForm)
                const corpusId = newCollection.id
                serverCreateForm.keywords &&
                (await addKeywordsToCorpus(corpusId, serverCreateForm.keywords))
                serverCreateForm.languages &&
                (await addLanguagesToCorpus(corpusId, serverCreateForm.languages))
                serverCreateForm.sourceIds &&
                (await addSourcesToCorpus(corpusId, serverCreateForm.sourceIds))

                updateCollectionStore()

            } catch (error) {
                dispatchError(error)
            }
        } else {
            const submitCorpusToBackend = async (
                id: string,
                updatedData: ServerCorpus
            ) => {
                try {
                    const serverUpdateForm: ServerFormCorpus = {
                        ...data,
                    }
                    const keywordsUpdate = data.keywords.map(
                        (kw: ServerKeyword) => {
                            return kw.id
                        }
                    )
                    await addKeywordsToCorpus(id, keywordsUpdate)

                    const languagesUpdate = data.languages.map(
                        (language: ServerLanguage) => {
                            return language.id
                        }
                    )
                    await addLanguagesToCorpus(id, languagesUpdate)

                    if (serverUpdateForm.parentId) {
                        serverUpdateForm.parentId = data.parent.id
                    }

                    await updateCorpus(id, updatedData)
                    const sourceIdsUpdate = data.sources.map(s => s.id)
                    const responseSources = await addSourcesToCorpus(id, sourceIdsUpdate)
                    const idsToDelete = responseSources
                        .map(s => s.id)
                        .filter(ls => !sourceIdsUpdate.includes(ls))
                    for (const idToDelete of idsToDelete) {
                        await deleteSourceFromCorpus(id, idToDelete)
                    }

                    updateCollectionStore()

                } catch (error) {
                    dispatchError(error)
                }
            }
            submitCorpusToBackend(props.corpusToEdit.id, data)

        }

        props.onClose()

        function updateCollectionStore() {
            const collectionsUpdate = [...collectionsState.collections]
            const toReplace = collectionsUpdate.findIndex(c => c.id === data.id)
            collectionsUpdate[toReplace] = data
            dispatchCollections({
                type: Actions.SET_COLLECTIONS,
                collections: collectionsUpdate,
            })
        }

    }

    React.useEffect(() => {
        const doGetCollectionById = async (id: string) => {
            setInit(true)
            const serverCorpus = await getCollectionById(id)
            const data: ServerCorpus = {
                ...serverCorpus,
                keywords: await getKeywordsCorpora(id),
                languages: await getLanguagesCorpora(id),
                sources: await getSourcesInCorpus(id),
                parent: serverCorpus.parentId && await getCollectionById(serverCorpus.parentId)
            }

            if (serverCorpus.parentId) {
                const parentId = serverCorpus.parentId
                data.parent = await getCollectionById(parentId)
            }

            const fields = [
                "parentId",
                "title",
                "description",
                "rights",
                "access",
                "location",
                "earliest",
                "latest",
                "contributor",
                "notes",
                "keywords",
                "languages",
                "sources",
            ]
            fields.map((field: keyof ServerCorpus) => {
                setValue(field, data[field])
            })
            register("access")
            setLoaded(true)
        }
        if(isInit) {
            return;
        }
        if (props.isEditing && props.corpusToEdit) {
            doGetCollectionById(props.corpusToEdit.id)
        } else {
            setInit(true)
            setLoaded(true)
        }
    }, [isInit, isLoaded])

    const allSources = sourcesState.sources
    const selectedSources = watch("sources")

    function unlinkSource(sourceId: string) {
        return setValue("sources", selectedSources.filter(s => s.id !== sourceId))
    }

    function linkSource(sourceId: string) {
        return setValue("sources", [...selectedSources, allSources.find(s => s.id === sourceId)])
    }

    if(!isLoaded) {
        return null;
    }
    return (
        <>
            <ScrollableModal
                show={props.show}
                handleClose={props.onClose}
            >
                <h1>{props.isEditing ? "Edit corpus" : "Create new corpus"}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Label>Title</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        error={!!errors.title}
                        {...register("title")}
                    />
                    <p style={{color: "red"}}>{errors.title?.message}</p>
                    <Label>Description</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        multiline
                        rows={6}
                        error={!!errors.description}
                        {...register("description", {required: true})}
                    />
                    <p style={{color: "red"}}>{errors.description?.message}</p>
                    <Label>Rights</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        error={!!errors.rights}
                        {...register("rights", {required: true})}
                    />
                    <p style={{color: "red"}}>{errors.rights?.message}</p>
                    <ValidatedSelectField
                        label="Access"
                        errorMessage={errors.access?.message}
                        selectedOption={watch("access")}
                        onSelectOption={v => setValue("access", v)}
                        options={accessOptions}
                    />

                    <Label>Location</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        {...register("location")}
                    />
                    <Label>Earliest</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        {...register("earliest")}
                    />
                    <Label>Latest</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("latest")} />
                    <Label>Contributor</Label>
                    <TextFieldStyled
                        fullWidth
                        margin="dense"
                        {...register("contributor")}
                    />
                    <Label>Notes</Label>
                    <TextFieldStyled fullWidth margin="dense" {...register("notes")} />
                    <Label>Keywords</Label>
                    <KeywordsField
                        control={control}
                        corpusId={props.corpusToEdit && props.corpusToEdit.id}
                        setValueCorpus={setValue}
                        edit={props.isEditing}
                    />
                    <Label>Languages</Label>
                    <LanguagesField
                        control={control}
                        corpusId={props.corpusToEdit && props.corpusToEdit.id}
                        setValueCorpus={setValue}
                        edit={props.isEditing}
                    />
                    <Label>Add sources to corpus</Label>
                    <LinkSourceField
                        all={allSources}
                        selected={selectedSources}
                        onLinkSource={linkSource}
                        onUnlinkSource={unlinkSource}
                    />
                    <Label>Add corpus to which main corpus?</Label>
                    <SubCorpusField
                        control={control}
                        corpora={collectionsState.collections}
                    />
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </form>
                <Button variant="contained" onClick={props.onClose}>
                    Close
                </Button>
            </ScrollableModal>
        </>
    )
}
